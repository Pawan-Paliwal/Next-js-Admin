const db = require("../db");
const path = require("path");
const fs = require("fs");

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(
    __dirname,
    "../uploads/OnlineImages/CollaborationImages",
    imagePath,
  );
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error deleting old image:", err);
    }
  });
};

exports.getAllCollaborations = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY CollaborationID DESC) AS SerialNo,
           CollaborationID,
           CollaborationName,
           CollaborationNameURL,
           CollaborationImage,
           Description,
           DisplayOrder,
           ActiveStatus
    FROM mst_collaborationdata
    ORDER BY CollaborationID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCollaborationById = (req, res) => {
  const CollaborationID = req.query.CollaborationID;
  if (!CollaborationID)
    return res.status(400).json({ success: false, message: "Missing ID" });
  const sql =
    "SELECT * FROM mst_collaborationdata WHERE CollaborationID = ? LIMIT 1";
  db.query(sql, [CollaborationID], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    if (results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Collaboration not found" });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateCollaboration = (req, res) => {
  const {
    CollaborationID,
    CollaborationName,
    CollaborationNameURL,
    Description,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy,
  } = req.body;
  const currentTime = new Date();
  const CollaborationImage =
    req?.files?.CollaborationImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT CollaborationID FROM mst_collaborationdata
    WHERE (CollaborationName = ? OR CollaborationNameURL = ?)
    ${CollaborationID ? "AND CollaborationID != ?" : ""}
  `;
  const checkParams = CollaborationID
    ? [CollaborationName, CollaborationNameURL, CollaborationID]
    : [CollaborationName, CollaborationNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Collaboration with the same name or URL already exists",
        });
    }

    if (CollaborationID) {
      const getOldSql =
        "SELECT CollaborationImage FROM mst_collaborationdata WHERE CollaborationID = ?";
      db.query(getOldSql, [CollaborationID], (err, oldResults) => {
        if (err || oldResults.length === 0)
          return res
            .status(400)
            .json({ success: false, message: "Invalid ID" });

        const finalImage =
          CollaborationImage || oldResults[0].CollaborationImage;
        if (
          CollaborationImage &&
          oldResults[0].CollaborationImage &&
          CollaborationImage !== oldResults[0].CollaborationImage
        ) {
          deleteOldImage(oldResults[0].CollaborationImage);
        }
        const updateSql = `
          UPDATE mst_collaborationdata SET
            CollaborationName = ?, CollaborationNameURL = ?, CollaborationImage = ?, Description = ?,
            DisplayOrder = ?, ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE CollaborationID = ?
        `;
        db.query(
          updateSql,
          [
            CollaborationName,
            CollaborationNameURL,
            finalImage,
            Description,
            DisplayOrder,
            ActiveStatus,
            UpdatedBy,
            currentTime,
            CollaborationID,
          ],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ success: false, message: "Update failed", error: err });
            return res.json({
              success: true,
              message: "Collaboration updated successfully",
            });
          },
        );
      });
    } else {
      const insertSql = `
        INSERT INTO mst_collaborationdata (
          CollaborationName, CollaborationNameURL, CollaborationImage, Description,
          DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [
          CollaborationName,
          CollaborationNameURL,
          CollaborationImage,
          Description,
          DisplayOrder,
          ActiveStatus,
          currentTime,
          UpdatedBy,
          currentTime,
        ],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: "Insert failed", error: err });
          return res.json({
            success: true,
            message: "Collaboration created successfully",
          });
        },
      );
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates))
    return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map((item) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE mst_collaborationdata SET DisplayOrder = ? WHERE CollaborationID = ?",
        [item.DisplayOrder, item.CollaborationID],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  });

  Promise.all(queries)
    .then(() =>
      res.json({
        success: true,
        message: "Display order updated successfully",
      }),
    )
    .catch((err) =>
      res.status(500).json({ success: false, message: "Database error" }),
    );
};

exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_collaborationdata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteCollaboration = (req, res) => {
  const CollaborationID = req.params.CollaborationID;
  const getImageSql = `SELECT CollaborationImage FROM mst_collaborationdata WHERE CollaborationID = ?`;
  db.query(getImageSql, [CollaborationID], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "Not found" });

    const { CollaborationImage } = results[0];
    db.query(
      "DELETE FROM mst_collaborationdata WHERE CollaborationID = ?",
      [CollaborationID],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        if (result.affectedRows === 0)
          return res.status(404).json({ success: false, message: "Not found" });
        if (CollaborationImage) deleteOldImage(CollaborationImage);
        res.json({
          success: true,
          message: "Collaboration deleted successfully",
        });
      },
    );
  });
};

exports.updateActiveStatus = (req, res) => {
  const { CollaborationID, ActiveStatus } = req.body;
  if (!CollaborationID || ActiveStatus === undefined)
    return res
      .status(400)
      .json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_collaborationdata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CollaborationID = ?`;
  db.query(sql, [ActiveStatus, CollaborationID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
