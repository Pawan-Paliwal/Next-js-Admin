const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/ManufacturingImages', filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old file:', err);
    }
  });
};

exports.getAllManufacturing = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           ManufacturingID,
           ManufacturingName,
           ManufacturingNameURL,
           ManufacturingVideoUrl,
           DisplayOrder,
           ActiveStatus
    FROM mst_manufacturing
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getManufacturingById = (req, res) => {
  const ManufacturingID = req.query.ManufacturingID;
  if (!ManufacturingID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_manufacturing WHERE ManufacturingID = ? LIMIT 1';
  db.query(sql, [ManufacturingID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Manufacturing not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateManufacturing = (req, res) => {
  const {
    ManufacturingID, ManufacturingName, ManufacturingNameURL,
    ActiveStatus, DisplayOrder, UpdatedBy
  } = req.body;

  const currentTime = new Date();
  const ManufacturingVideoUrl = req?.files?.ManufacturingVideoUrl?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT ManufacturingID FROM mst_manufacturing
    WHERE (ManufacturingName = ? OR ManufacturingNameURL = ?)
    ${ManufacturingID ? 'AND ManufacturingID != ?' : ''}
  `;
  const checkParams = ManufacturingID ? [ManufacturingName, ManufacturingNameURL, ManufacturingID] : [ManufacturingName, ManufacturingNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Manufacturing with the same name or URL already exists" });
    }

    if (ManufacturingID) {
      const getOldSql = 'SELECT ManufacturingVideoUrl FROM mst_manufacturing WHERE ManufacturingID = ?';
      db.query(getOldSql, [ManufacturingID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const finalVideo = ManufacturingVideoUrl || oldResults[0].ManufacturingVideoUrl;

        if (ManufacturingVideoUrl && oldResults[0].ManufacturingVideoUrl && ManufacturingVideoUrl !== oldResults[0].ManufacturingVideoUrl) {
          deleteOldFile(oldResults[0].ManufacturingVideoUrl);
        }
        const updateSql = `
          UPDATE mst_manufacturing SET
            ManufacturingName = ?, ManufacturingNameURL = ?, ManufacturingVideoUrl = ?, 
            ActiveStatus = ?, DisplayOrder = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE ManufacturingID = ?
        `;
        db.query(updateSql, [
          ManufacturingName, ManufacturingNameURL, finalVideo,
          ActiveStatus, DisplayOrder, UpdatedBy, currentTime, ManufacturingID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Manufacturing updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_manufacturing (
          ManufacturingName, ManufacturingNameURL, ManufacturingVideoUrl, 
          ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        ManufacturingName, ManufacturingNameURL, ManufacturingVideoUrl,
        ActiveStatus, DisplayOrder, currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Manufacturing created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_manufacturing SET DisplayOrder = ? WHERE ManufacturingID = ?',
        [item.DisplayOrder, item.ManufacturingID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_manufacturing`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteManufacturing = (req, res) => {
  const ManufacturingID = req.params.ManufacturingID;
  const getFileSql = `SELECT ManufacturingVideoUrl FROM mst_manufacturing WHERE ManufacturingID = ?`;
  db.query(getFileSql, [ManufacturingID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { ManufacturingVideoUrl } = results[0];
    db.query('DELETE FROM mst_manufacturing WHERE ManufacturingID = ?', [ManufacturingID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });

      if (ManufacturingVideoUrl) deleteOldFile(ManufacturingVideoUrl);

      res.json({ success: true, message: 'Manufacturing deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { ManufacturingID, ActiveStatus } = req.body;
  if (!ManufacturingID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_manufacturing SET ActiveStatus = ?, UpdatedOn = NOW() WHERE ManufacturingID = ?`;
  db.query(sql, [ActiveStatus, ManufacturingID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
