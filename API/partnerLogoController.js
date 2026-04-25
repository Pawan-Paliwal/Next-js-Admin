const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/PartnerLogos', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllPartnerLogos = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           PartnerLogoID,
           PartnerLogoImage,
           DisplayOnHome,
           DisplayOrder,
           ActiveStatus,
           PostedDate
    FROM mst_partnerlogodata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getPartnerLogoById = (req, res) => {
  const { PartnerLogoID } = req.query;
  if (!PartnerLogoID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_partnerlogodata WHERE PartnerLogoID = ? LIMIT 1';
  db.query(sql, [PartnerLogoID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Partner logo not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdatePartnerLogo = (req, res) => {
  const {
    PartnerLogoID, ActiveStatus, DisplayOnHome, DisplayOrder, UpdatedBy
  } = req.body;

  const currentTime = new Date();
  const PartnerLogoImage = req.file?.filename || null;

  if (PartnerLogoID) {
    const getOldSql = 'SELECT PartnerLogoImage FROM mst_partnerlogodata WHERE PartnerLogoID = ?';
    db.query(getOldSql, [PartnerLogoID], (err, oldResults) => {
      if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

      const finalImage = PartnerLogoImage || oldResults[0].PartnerLogoImage;

      if (PartnerLogoImage && oldResults[0].PartnerLogoImage && PartnerLogoImage !== oldResults[0].PartnerLogoImage) {
        deleteOldImage(oldResults[0].PartnerLogoImage);
      }

      const updateSql = `
        UPDATE mst_partnerlogodata SET
          PartnerLogoImage = ?, ActiveStatus = ?, DisplayOnHome = ?, DisplayOrder = ?,
          UpdatedBy = ?, UpdatedOn = ?
        WHERE PartnerLogoID = ?
      `;
      db.query(updateSql, [
        finalImage, ActiveStatus, DisplayOnHome, DisplayOrder,
        UpdatedBy, currentTime, PartnerLogoID
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
        return res.json({ success: true, message: "Partner logo updated successfully" });
      });
    });
  } else {
    const insertSql = `
      INSERT INTO mst_partnerlogodata (
        PartnerLogoImage, ActiveStatus, DisplayOnHome, DisplayOrder,
        PostedDate, UpdatedBy, UpdatedOn
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [
      PartnerLogoImage, ActiveStatus, DisplayOnHome, DisplayOrder,
      currentTime, UpdatedBy, currentTime
    ], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
      return res.json({ success: true, message: "Partner logo created successfully" });
    });
  }
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_partnerlogodata SET DisplayOrder = ? WHERE PartnerLogoID = ?',
        [item.DisplayOrder, item.PartnerLogoID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_partnerlogodata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deletePartnerLogo = (req, res) => {
  const PartnerLogoID = req.params.PartnerLogoID;
  const getImageSql = `SELECT PartnerLogoImage FROM mst_partnerlogodata WHERE PartnerLogoID = ?`;
  db.query(getImageSql, [PartnerLogoID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { PartnerLogoImage } = results[0];
    db.query('DELETE FROM mst_partnerlogodata WHERE PartnerLogoID = ?', [PartnerLogoID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });

      if (PartnerLogoImage) deleteOldImage(PartnerLogoImage);

      res.json({ success: true, message: 'Partner logo deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { PartnerLogoID, ActiveStatus } = req.body;
  if (!PartnerLogoID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_partnerlogodata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE PartnerLogoID = ?`;
  db.query(sql, [ActiveStatus, PartnerLogoID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
