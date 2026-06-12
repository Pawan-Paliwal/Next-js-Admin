const db = require('../db');
const fs = require('fs');
const path = require('path');


// GET all PartnerLogo
exports.getAllPartnerLogo = (req, res) => {
  const sql = `
    SELECT
      ROW_NUMBER() OVER (ORDER BY c.PartnerLogoID DESC) AS SerialNo,
      PartnerLogoID,
      PartnerLogoImage,
      ActiveStatus,
      DisplayOnHome,
      DisplayOrder,
      DATE_FORMAT(c.PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      UpdatedOn
    FROM mst_partnerlogodata c
    ORDER BY c.PartnerLogoID DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};



// GET PartnerLogo by ID
exports.getPartnerLogoById = (req, res) => {
  const PartnerLogoID = req.query.PartnerLogoID;
  if (!PartnerLogoID) {
    return res.status(400).json({
      success: false,
      message: "Missing PartnerLogo ID"
    });
  }
  const PartnerLogoSql = `
    SELECT *
    FROM mst_partnerlogodata
    WHERE PartnerLogoID = ?
    LIMIT 1;
  `;
  db.query(PartnerLogoSql, [PartnerLogoID], (err, PartnerLogoResults) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
    if (PartnerLogoResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "PartnerLogo not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: PartnerLogoResults[0]
    });
  });
};


// CREATE or UPDATE PartnerLogo
exports.saveOrUpdatePartnerLogo = (req, res) => {
  const { PartnerLogoID, ActiveStatus, DisplayOnHome, UpdatedBy, DisplayOrder } = req.body;
  const currentTime = new Date();
  const PartnerLogoImage = req.files?.PartnerLogoImage?.[0]?.filename || null;

  const deleteOldImage = (imageName) => {
    if (!imageName) return;
    const imagePath = path.join(__dirname, '../uploads/OnlineImages/PartnerLogoImages', imageName);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }
  };

  const checkDuplicateSql = `
    SELECT PartnerLogoID FROM mst_partnerlogodata 
    WHERE DisplayOrder = ? ${PartnerLogoID ? "AND PartnerLogoID != ?" : ""}
  `;
  const checkParams = PartnerLogoID ? [DisplayOrder, PartnerLogoID] : [DisplayOrder];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Display order already exists" });
    }

    if (PartnerLogoID) {
      const getOldSql = `SELECT PartnerLogoImage FROM mst_partnerlogodata WHERE PartnerLogoID = ?`;
      db.query(getOldSql, [PartnerLogoID], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res.status(400).json({ success: false, message: "Invalid PartnerLogoID" });
        }

        const old = oldResults[0];
        const finalImage = PartnerLogoImage || old.PartnerLogoImage;

        if (PartnerLogoImage && old.PartnerLogoImage && PartnerLogoImage !== old.PartnerLogoImage) {
          deleteOldImage(old.PartnerLogoImage);
        }

        const updateSql = `
          UPDATE mst_partnerlogodata SET
            PartnerLogoImage = ?,
            ActiveStatus = ?,
            DisplayOnHome = ?,
            DisplayOrder = ?,
            UpdatedBy = ?,
            UpdatedOn = ?
          WHERE PartnerLogoID = ?
        `;

        db.query(updateSql, [
          finalImage,
          ActiveStatus,
          DisplayOnHome,
          DisplayOrder || 0,
          UpdatedBy,
          currentTime,
          PartnerLogoID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed" });
          return res.json({ success: true, message: "Partner Logo updated successfully" });
        });
      });
    } else {
      if (!PartnerLogoImage) {
        return res.status(400).json({ success: false, message: "Partner Logo image is required" });
      }

      const insertSql = `
        INSERT INTO mst_partnerlogodata (
          PartnerLogoImage, ActiveStatus, DisplayOnHome,
          DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSql, [
        PartnerLogoImage,
        ActiveStatus,
        DisplayOnHome,
        DisplayOrder || 0,
        currentTime,
        UpdatedBy,
        currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed" });
        return res.json({ success: true, message: "Partner Logo created successfully" });
      });
    }
  });
};

// DELETE PartnerLogo
exports.deletePartnerLogo = (req, res) => {
  const PartnerLogoID = req.params.PartnerLogoID;
  const sql = 'DELETE FROM mst_partnerlogodata WHERE PartnerLogoID  = ?';
  db.query(sql, [PartnerLogoID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'PartnerLogo not found' });
    }
    res.json({ success: true, message: 'PartnerLogo deleted successfully' });
  });
};


//Update status
exports.updateActiveStatus = (req, res) => {
  const { PartnerLogoID, ActiveStatus } = req.body;
  if (!PartnerLogoID || ActiveStatus === undefined) {
    return res.status(400).json({ success: false, message: "Missing ID or ActiveStatus" });
  }
  const sql = `
    UPDATE mst_partnerlogodata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE PartnerLogoID  = ?
  `;
  db.query(sql, [ActiveStatus, PartnerLogoID], (err, result) => {
    if (err) {
      //console.error("Error updating status:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Status updated successfully" });
  });
};


// UPDATE display order
exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }
  const updatePromises = updates.map(({ PartnerLogoID, DisplayOrder }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE mst_partnerlogodata SET DisplayOrder = ? WHERE PartnerLogoID   = ?';
      db.query(sql, [DisplayOrder, PartnerLogoID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });
  Promise.all(updatePromises)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => {
      //console.error('Error updating display order:', err);
      res.status(500).json({ success: false, message: 'Database error', error: err.message });
    });
};


// GET max display order
exports.getMaxDisplayOrder = (req, res) => {
  const sql = 'SELECT MAX(DisplayOrder) AS maxOrder FROM mst_partnerlogodata';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ success: true, maxOrder });
  });
};