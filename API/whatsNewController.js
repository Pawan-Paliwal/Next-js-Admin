const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/WhatsnewImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllWhatsNew = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY WhatsNewID DESC) AS SerialNo,
           WhatsNewID,
           WhatsNewName,
           WhatsNewNameURL,
           WhatsNewImage,
           Tagline,
           Description,
           DisplayOrder,
           ActiveStatus
    FROM mst_whatsnewdata
    ORDER BY WhatsNewID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getWhatsNewById = (req, res) => {
  const WhatsNewID = req.query.WhatsNewID;
  if (!WhatsNewID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_whatsnewdata WHERE WhatsNewID = ? LIMIT 1';
  db.query(sql, [WhatsNewID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Whats New item not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateWhatsNew = (req, res) => {
  const {
    WhatsNewID,
    WhatsNewName,
    WhatsNewNameURL,
    Tagline,
    Description,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const WhatsNewImage = req?.files?.WhatsNewImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT WhatsNewID FROM mst_whatsnewdata
    WHERE (WhatsNewName = ? OR WhatsNewNameURL = ?)
    ${WhatsNewID ? 'AND WhatsNewID != ?' : ''}
  `;
  const checkParams = WhatsNewID ? [WhatsNewName, WhatsNewNameURL, WhatsNewID] : [WhatsNewName, WhatsNewNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Whats New item with the same name or URL already exists" });
    }

    if (WhatsNewID) {
      const getOldSql = 'SELECT WhatsNewImage FROM mst_whatsnewdata WHERE WhatsNewID = ?';
      db.query(getOldSql, [WhatsNewID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const finalImage = WhatsNewImage || oldResults[0].WhatsNewImage;
        if (WhatsNewImage && oldResults[0].WhatsNewImage && WhatsNewImage !== oldResults[0].WhatsNewImage) {
          deleteOldImage(oldResults[0].WhatsNewImage);
        }

        const updateSql = `
          UPDATE mst_whatsnewdata SET
            WhatsNewName = ?, WhatsNewNameURL = ?, WhatsNewImage = ?, Tagline = ?, Description = ?,
            DisplayOrder = ?, ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE WhatsNewID = ?
        `;
        db.query(updateSql, [
          WhatsNewName, WhatsNewNameURL, finalImage, Tagline, Description,
          DisplayOrder, ActiveStatus, UpdatedBy, currentTime, WhatsNewID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Whats New updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_whatsnewdata (
          WhatsNewName, WhatsNewNameURL, WhatsNewImage, Tagline, Description,
          DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        WhatsNewName, WhatsNewNameURL, WhatsNewImage, Tagline, Description,
        DisplayOrder, ActiveStatus, currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Whats New created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_whatsnewdata SET DisplayOrder = ? WHERE WhatsNewID = ?',
        [item.DisplayOrder, item.WhatsNewID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_whatsnewdata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteWhatsNew = (req, res) => {
  const WhatsNewID = req.params.WhatsNewID;
  const getImageSql = `SELECT WhatsNewImage FROM mst_whatsnewdata WHERE WhatsNewID = ?`;
  db.query(getImageSql, [WhatsNewID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { WhatsNewImage } = results[0];
    db.query('DELETE FROM mst_whatsnewdata WHERE WhatsNewID = ?', [WhatsNewID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
      if (WhatsNewImage) deleteOldImage(WhatsNewImage);
      res.json({ success: true, message: 'Whats New deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { WhatsNewID, ActiveStatus } = req.body;
  if (!WhatsNewID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_whatsnewdata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE WhatsNewID = ?`;
  db.query(sql, [ActiveStatus, WhatsNewID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
