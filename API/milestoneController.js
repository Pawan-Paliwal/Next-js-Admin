const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/MilestoneImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllMilestones = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           MilestoneID,
           MilestoneName,
           MilestoneNameURL,
           MilestoneImage,
           MilestoneYear,
           Description,
           DisplayOrder,
           ActiveStatus
    FROM mst_ourmilestonedata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getMilestoneById = (req, res) => {
  const MilestoneID = req.query.MilestoneID;
  if (!MilestoneID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_ourmilestonedata WHERE MilestoneID = ? LIMIT 1';
  db.query(sql, [MilestoneID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Milestone not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateMilestone = (req, res) => {
  const {
    MilestoneID, MilestoneName, MilestoneNameURL, MilestoneYear, Description,
    ActiveStatus, DisplayOrder, UpdatedBy
  } = req.body;

  const currentTime = new Date();
  const MilestoneImage = req?.files?.MilestoneImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT MilestoneID FROM mst_ourmilestonedata
    WHERE (MilestoneName = ? OR MilestoneNameURL = ?)
    ${MilestoneID ? 'AND MilestoneID != ?' : ''}
  `;
  const checkParams = MilestoneID ? [MilestoneName, MilestoneNameURL, MilestoneID] : [MilestoneName, MilestoneNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Milestone with the same name or URL already exists" });
    }

    if (MilestoneID) {
      const getOldSql = 'SELECT MilestoneImage FROM mst_ourmilestonedata WHERE MilestoneID = ?';
      db.query(getOldSql, [MilestoneID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const finalImage = MilestoneImage || oldResults[0].MilestoneImage;

        if (MilestoneImage && oldResults[0].MilestoneImage && MilestoneImage !== oldResults[0].MilestoneImage) {
          deleteOldImage(oldResults[0].MilestoneImage);
        }

        const updateSql = `
          UPDATE mst_ourmilestonedata SET
            MilestoneName = ?, MilestoneNameURL = ?, MilestoneImage = ?, MilestoneYear = ?,
            Description = ?, ActiveStatus = ?, DisplayOrder = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE MilestoneID = ?
        `;
        db.query(updateSql, [
          MilestoneName, MilestoneNameURL, finalImage, MilestoneYear,
          Description, ActiveStatus, DisplayOrder, UpdatedBy, currentTime, MilestoneID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Milestone updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_ourmilestonedata (
          MilestoneName, MilestoneNameURL, MilestoneImage, MilestoneYear,
          Description, ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        MilestoneName, MilestoneNameURL, MilestoneImage, MilestoneYear,
        Description, ActiveStatus, DisplayOrder, currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Milestone created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_ourmilestonedata SET DisplayOrder = ? WHERE MilestoneID = ?',
        [item.DisplayOrder, item.MilestoneID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_ourmilestonedata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteMilestone = (req, res) => {
  const MilestoneID = req.params.MilestoneID;
  const getImageSql = `SELECT MilestoneImage FROM mst_ourmilestonedata WHERE MilestoneID = ?`;
  db.query(getImageSql, [MilestoneID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { MilestoneImage } = results[0];
    db.query('DELETE FROM mst_ourmilestonedata WHERE MilestoneID = ?', [MilestoneID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
      if (MilestoneImage) deleteOldImage(MilestoneImage);
      res.json({ success: true, message: 'Milestone deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { MilestoneID, ActiveStatus } = req.body;
  if (!MilestoneID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_ourmilestonedata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE MilestoneID = ?`;
  db.query(sql, [ActiveStatus, MilestoneID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
