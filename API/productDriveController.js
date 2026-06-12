const db = require("../db");
const fs = require("fs");
const path = require("path");

exports.getDrivesByProduct = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res.status(400).json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_productdrives WHERE ProductId = ? ORDER BY DisplayOrder ASC",
    [ProductId],
    (err, results) => {
      if (err)
        return res.status(500).json({ success: false, message: "Database error" });
      res.status(200).json({ success: true, data: results });
    }
  );
};

exports.saveOrUpdateDrive = (req, res) => {
  const { DriveId, ProductId, Title, Tagline, Description, DisplayOrder, ActiveStatus, UpdatedBy } = req.body;
  const currentTime = new Date();
  const IconImage = req.files?.IconImage?.[0]?.filename || null;
  const DefaultImage = req.files?.DefaultImage?.[0]?.filename || null;

  if (DriveId) {
    db.query(
      "SELECT IconImage, DefaultImage FROM mst_productdrives WHERE DriveId = ?",
      [DriveId],
      (err, old) => {
        if (err || old.length === 0)
          return res.status(400).json({ success: false, message: "Invalid DriveId" });
        db.query(
          "UPDATE mst_productdrives SET IconImage=?, DefaultImage=?, Title=?, Tagline=?, Description=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? WHERE DriveId=?",
          [
            IconImage || old[0].IconImage,
            DefaultImage || old[0].DefaultImage,
            Title,
            Tagline,
            Description,
            DisplayOrder,
            ActiveStatus,
            UpdatedBy,
            currentTime,
            DriveId,
          ],
          (err) => {
            if (err)
              return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: "Drive updated successfully" });
          }
        );
      }
    );
  } else {
    db.query(
      "INSERT INTO mst_productdrives (ProductId, IconImage, DefaultImage, Title, Tagline, Description, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        ProductId,
        IconImage,
        DefaultImage,
        Title,
        Tagline,
        Description,
        DisplayOrder,
        ActiveStatus,
        currentTime,
        UpdatedBy,
        currentTime,
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Drive created successfully", DriveId: result.insertId });
      }
    );
  }
};

exports.deleteDrive = (req, res) => {
  const { DriveId } = req.params;
  db.query(
    "SELECT IconImage, DefaultImage FROM mst_productdrives WHERE DriveId = ?",
    [DriveId],
    (err, results) => {
      if (err)
        return res.status(500).json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ success: false, message: "Drive not found" });
      db.query(
        "DELETE FROM mst_productdrives WHERE DriveId = ?",
        [DriveId],
        (err) => {
          if (err)
            return res.status(500).json({ success: false, message: "Database error" });
          if (results[0].IconImage) {
            const filePath = path.join(__dirname, "../uploads/OnlineImages/ProductImages", results[0].IconImage);
            if (fs.existsSync(filePath)) {
              try { fs.unlinkSync(filePath); } catch (e) { console.error(e); }
            }
          }
          if (results[0].DefaultImage) {
            const filePath = path.join(__dirname, "../uploads/OnlineImages/ProductImages", results[0].DefaultImage);
            if (fs.existsSync(filePath)) {
              try { fs.unlinkSync(filePath); } catch (e) { console.error(e); }
            }
          }

          res.json({ success: true, message: "Drive deleted successfully" });
        }
      );
    }
  );
};

exports.updateActiveStatus = (req, res) => {
  const { DriveId, ActiveStatus } = req.body;
  if (!DriveId || ActiveStatus === undefined)
    return res.status(400).json({ success: false, message: "Missing DriveId or ActiveStatus" });
  db.query(
    "UPDATE mst_productdrives SET ActiveStatus = ?, UpdatedOn = NOW() WHERE DriveId = ?",
    [ActiveStatus, DriveId],
    (err) => {
      if (err)
        return res.status(500).json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    }
  );
};