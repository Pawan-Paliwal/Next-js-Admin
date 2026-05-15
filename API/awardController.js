const db = require('../db');
const fs = require('fs');
const path = require('path');


const deleteOldImage = (imageName) => {
  if (!imageName) return;
  const imagePath = path.join(__dirname, '../uploads/OnlineImages/AwardImages', imageName);
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error("Error deleting old image:", err);
    }
  }
};

// GET all AwardLogo
exports.getAllAwardLogo = (req, res) => {
  const sql = `
    SELECT
      ROW_NUMBER() OVER (ORDER BY c.AwardLogoID DESC) AS SerialNo,
      AwardLogoID,
      AwardLogoImage,
      ActiveStatus,
      DisplayOrder,
      DATE_FORMAT(c.PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      UpdatedOn
    FROM mst_awarddata c
    ORDER BY c.AwardLogoID DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};



// GET AwardLogo by ID
exports.getAwardLogoById = (req, res) => {
  const AwardLogoID = req.query.AwardLogoID;
  if (!AwardLogoID) {
    return res.status(400).json({
      success: false,
      message: "Missing AwardLogo ID"
    });
  }
  const AwardLogoSql = `
    SELECT *
    FROM mst_awarddata
    WHERE AwardLogoID = ?
    LIMIT 1;
  `;
  db.query(AwardLogoSql, [AwardLogoID], (err, AwardLogoResults) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
    if (AwardLogoResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "AwardLogo not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: AwardLogoResults[0]
    });
  });
};


// CREATE or UPDATE AwardLogo
exports.saveOrUpdateAwardLogo = (req, res) => {
  const { AwardLogoID, ActiveStatus, UpdatedBy, DisplayOrder } = req.body;
  const currentTime = new Date();
  const AwardLogoImage = req.files?.AwardLogoImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT AwardLogoID FROM mst_awarddata 
    WHERE DisplayOrder = ? ${AwardLogoID ? "AND AwardLogoID != ?" : ""}
  `;
  const checkParams = AwardLogoID ? [DisplayOrder, AwardLogoID] : [DisplayOrder];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Display order already exists" });
    }

    if (AwardLogoID) {
      const getOldSql = `SELECT AwardLogoImage FROM mst_awarddata WHERE AwardLogoID = ?`;
      db.query(getOldSql, [AwardLogoID], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res.status(400).json({ success: false, message: "Invalid AwardLogoID" });
        }

        const old = oldResults[0];
        const finalImage = AwardLogoImage || old.AwardLogoImage;

        if (AwardLogoImage && old.AwardLogoImage && AwardLogoImage !== old.AwardLogoImage) {
          deleteOldImage(old.AwardLogoImage);
        }
        const updateSql = `
          UPDATE mst_awarddata SET
            AwardLogoImage = ?,
            ActiveStatus = ?,
            DisplayOrder = ?,
            UpdatedBy = ?,
            UpdatedOn = ?
          WHERE AwardLogoID = ?
        `;
        db.query(updateSql, [
          finalImage,
          ActiveStatus,
          DisplayOrder || 0,
          UpdatedBy,
          currentTime,
          AwardLogoID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed" });
          return res.json({ success: true, message: "Award Logo updated successfully" });
        });
      });
    } else {
      if (!AwardLogoImage) {
        return res.status(400).json({ success: false, message: "Award Logo image is required" });
      }
      const insertSql = `
        INSERT INTO mst_awarddata (
          AwardLogoImage, ActiveStatus, 
          DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        AwardLogoImage,
        ActiveStatus,
        DisplayOrder || 0,
        currentTime,
        UpdatedBy,
        currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed" });
        return res.json({ success: true, message: "Award Logo created successfully" });
      });
    }
  });
};

// DELETE AwardLogo
exports.deleteAwardLogo = (req, res) => {
  const AwardLogoID = req.params.AwardLogoID;

  const getSql = 'SELECT AwardLogoImage FROM mst_awarddata WHERE AwardLogoID = ?';
  db.query(getSql, [AwardLogoID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'AwardLogo not found' });
    }

    const { AwardLogoImage } = results[0];
    if (AwardLogoImage) {
      deleteOldImage(AwardLogoImage);
    }

    const sql = 'DELETE FROM mst_awarddata WHERE AwardLogoID  = ?';
    db.query(sql, [AwardLogoID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      res.json({ success: true, message: 'AwardLogo deleted successfully' });
    });
  });
};


//Update status
exports.updateActiveStatus = (req, res) => {
  const { AwardLogoID, ActiveStatus } = req.body;
  if (!AwardLogoID || ActiveStatus === undefined) {
    return res.status(400).json({ success: false, message: "Missing ID or ActiveStatus" });
  }
  const sql = `
    UPDATE mst_awarddata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE AwardLogoID  = ?
  `;
  db.query(sql, [ActiveStatus, AwardLogoID], (err, result) => {
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
  const updatePromises = updates.map(({ AwardLogoID, DisplayOrder }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE mst_awarddata SET DisplayOrder = ? WHERE AwardLogoID   = ?';
      db.query(sql, [DisplayOrder, AwardLogoID], (err, result) => {
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
  const sql = 'SELECT MAX(DisplayOrder) AS maxOrder FROM mst_awarddata';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ success: true, maxOrder });
  });
};