const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/DirectorImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllDirectors = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           DirectorID,
           DirectorName,
           DirectorDesignation,
           DirectorBio,
           DirectorImage,
           DisplayOrder,
           ActiveStatus
    FROM mst_directordata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDirectorById = (req, res) => {
  const DirectorID = req.query.DirectorID;
  if (!DirectorID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_directordata WHERE DirectorID = ? LIMIT 1';
  db.query(sql, [DirectorID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Director not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateDirector = (req, res) => {
  const {
    DirectorID,
    DirectorName,
    DirectorDesignation,
    DirectorBio,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const DirectorImage = req?.files?.DirectorImage?.[0]?.filename || null;

  if (DirectorID) {
    const getOldSql = 'SELECT DirectorImage FROM mst_directordata WHERE DirectorID = ?';
    db.query(getOldSql, [DirectorID], (err, oldResults) => {
      if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

      const finalImage = DirectorImage || oldResults[0].DirectorImage;
      if (DirectorImage && oldResults[0].DirectorImage && DirectorImage !== oldResults[0].DirectorImage) {
        deleteOldImage(oldResults[0].DirectorImage);
      }

      const updateSql = `
        UPDATE mst_directordata SET
          DirectorName = ?, DirectorDesignation = ?, DirectorBio = ?, DirectorImage = ?,
          DisplayOrder = ?, ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ?
        WHERE DirectorID = ?
      `;
      db.query(updateSql, [
        DirectorName, DirectorDesignation, DirectorBio, finalImage,
        DisplayOrder, ActiveStatus, UpdatedBy, currentTime, DirectorID
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
        return res.json({ success: true, message: "Director updated successfully" });
      });
    });
  } else {
    const insertSql = `
      INSERT INTO mst_directordata (
        DirectorName, DirectorDesignation, DirectorBio, DirectorImage,
        DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [
      DirectorName, DirectorDesignation, DirectorBio, DirectorImage,
      DisplayOrder, ActiveStatus, currentTime, UpdatedBy, currentTime
    ], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
      return res.json({ success: true, message: "Director created successfully" });
    });
  }
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_directordata SET DisplayOrder = ? WHERE DirectorID = ?',
        [item.DisplayOrder, item.DirectorID], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  });

  Promise.all(queries)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => res.status(500).json({ success: false, message: "Database error" }));
};

exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_directordata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteDirector = (req, res) => {
  const DirectorID = req.params.DirectorID;
  const getImageSql = `SELECT DirectorImage FROM mst_directordata WHERE DirectorID = ?`;
  db.query(getImageSql, [DirectorID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { DirectorImage } = results[0];
    db.query('DELETE FROM mst_directordata WHERE DirectorID = ?', [DirectorID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
      if (DirectorImage) deleteOldImage(DirectorImage);
      res.json({ success: true, message: 'Director deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { DirectorID, ActiveStatus } = req.body;
  if (!DirectorID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_directordata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE DirectorID = ?`;
  db.query(sql, [ActiveStatus, DirectorID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
