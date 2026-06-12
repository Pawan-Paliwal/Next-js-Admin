const db = require('../db');

// GET all media items
exports.getAllMedia = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC, MediaID DESC) AS SerialNo,
      MediaID,
      Title,
      MediaImage,
      ThirdPartyLink,
      DATE_FORMAT(MediaDate, '%b %d, %Y') AS MediaDate,
      DisplayOrder,
      ActiveStatus,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_mediadata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC, MediaID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// GET all media items (admin - includes inactive)
exports.getAllMediaAdmin = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC, MediaID DESC) AS SerialNo,
      MediaID,
      Title,
      MediaImage,
      ThirdPartyLink,
      DATE_FORMAT(MediaDate, '%b %d, %Y') AS MediaDate,
      DisplayOrder,
      ActiveStatus,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_mediadata
    ORDER BY DisplayOrder ASC, MediaID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// GET media by ID
exports.getMediaById = (req, res) => {
  const MediaID = req.query.MediaID;
  if (!MediaID) {
    return res.status(400).json({
      success: false,
      message: "Missing Media ID"
    });
  }
  const mediaSql = "SELECT * FROM mst_mediadata WHERE MediaID = ? LIMIT 1";
  db.query(mediaSql, [MediaID], (err, mediaResults) => {
    if (err) {
      console.error("Error fetching media:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
    if (mediaResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: mediaResults[0],
    });
  });
};

// CREATE or UPDATE media
exports.saveOrUpdateMedia = (req, res) => {
  const {
    MediaID,
    Title,
    MediaDate,
    ThirdPartyLink,
    DisplayOrder,
    ActiveStatus,
    DisplayOnHome,
    UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const MediaImage = req.files?.MediaImage?.[0]?.filename || null;

  if (!Title) {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }
  const checkDuplicateSql = `
    SELECT MediaID FROM mst_mediadata 
    WHERE Title = ? 
    ${MediaID ? "AND MediaID != ?" : ""}
  `;
  const checkParams = MediaID ? [Title, MediaID] : [Title];
  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Media with the same title already exists"
      });
    }
    if (MediaID) {
      const getOldSql = "SELECT MediaImage FROM mst_mediadata WHERE MediaID = ?";
      db.query(getOldSql, [MediaID], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid MediaID"
          });
        }

        const old = oldResults[0];
        const finalMediaImage = MediaImage || old.MediaImage;

        const updateSql = `
          UPDATE mst_mediadata SET 
            Title = ?, 
            MediaDate = ?,
            MediaImage = ?, 
            ThirdPartyLink = ?,
            DisplayOrder = ?,
            ActiveStatus = ?,
            DisplayOnHome = ?,
            UpdatedBy = ?, 
            UpdatedOn = ?
          WHERE MediaID = ?
        `;

        db.query(updateSql, [
          Title,
          MediaDate || currentTime,
          finalMediaImage,
          ThirdPartyLink || "",
          DisplayOrder || 0,
          ActiveStatus,
          DisplayOnHome || 0, // NEW FIELD
          UpdatedBy || "Admin",
          currentTime,
          MediaID
        ], (err) => {
          if (err) return res.status(500).json({
            success: false,
            message: "Update failed",
            error: err.message
          });

          return res.json({
            success: true,
            message: "Media updated successfully"
          });
        });
      });
    } else {
      // INSERT OPERATION
      if (!MediaImage) {
        return res.status(400).json({
          success: false,
          message: "Media image is required"
        });
      }

      const insertSql = `
        INSERT INTO mst_mediadata (
          Title, 
          MediaDate,
          MediaImage, 
          ThirdPartyLink,
          DisplayOrder,
          ActiveStatus,
          DisplayOnHome,
          PostedDate, 
          UpdatedBy, 
          UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSql, [
        Title,
        MediaDate || currentTime,
        MediaImage,
        ThirdPartyLink || "",
        DisplayOrder || 0,
        ActiveStatus !== undefined ? ActiveStatus : 1,
        DisplayOnHome !== undefined ? DisplayOnHome : 0, // NEW FIELD
        currentTime,
        UpdatedBy || "Admin",
        currentTime
      ], (err, result) => {
        if (err) return res.status(500).json({
          success: false,
          message: "Insert failed",
          error: err.message
        });

        return res.json({
          success: true,
          message: "Media created successfully",
          MediaID: result.insertId
        });
      });
    }
  });
};

// DELETE media
exports.deleteMedia = (req, res) => {
  const MediaID = req.params.MediaID;
  const sql = 'DELETE FROM mst_mediadata WHERE MediaID = ?';
  db.query(sql, [MediaID], (err, result) => {
    if (err) return res.status(500).json({
      success: false,
      message: 'Database error'
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  });
};

// Update ActiveStatus
exports.updateActiveStatus = (req, res) => {
  const { MediaID, ActiveStatus } = req.body;
  if (!MediaID || ActiveStatus === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing MediaID or ActiveStatus"
    });
  }
  const sql = `
    UPDATE mst_mediadata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE MediaID = ?
  `;
  db.query(sql, [ActiveStatus, MediaID], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Media not found"
      });
    }
    res.json({
      success: true,
      message: "Status updated successfully"
    });
  });
};

// Update DisplayOrder
exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }
  const updatePromises = updates.map(({ MediaID, DisplayOrder }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE mst_mediadata SET DisplayOrder = ? WHERE MediaID  = ?';
      db.query(sql, [DisplayOrder, MediaID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });
  Promise.all(updatePromises)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => {
      console.error('Error updating display order:', err);
      res.status(500).json({ success: false, message: 'Database error', error: err.message });
    });
};


// GET max display order for services
exports.getMaxDisplayOrder = (req, res) => {
  const sql = 'SELECT MAX(DisplayOrder) AS maxOrder FROM mst_mediadata';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ success: true, maxOrder });
  });
};