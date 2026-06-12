const db = require("../db");
const fs = require("fs");
const path = require("path");

exports.getGalleryByProduct = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_productgallery WHERE ProductId = ? ORDER BY DisplayOrder ASC",
    [ProductId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.status(200).json({ success: true, data: results });
    },
  );
};

exports.saveOrUpdateGallery = (req, res) => {
  const { GalleryId, ProductId, Title, DisplayOrder, ActiveStatus, UpdatedBy } =
    req.body;
  const currentTime = new Date();
  const ImageUrl = req.files?.ImageUrl?.[0]?.filename || null;

  if (GalleryId) {
    db.query(
      "SELECT ImageUrl FROM mst_productgallery WHERE GalleryId = ?",
      [GalleryId],
      (err, old) => {
        if (err || old.length === 0)
          return res
            .status(400)
            .json({ success: false, message: "Invalid GalleryId" });
        db.query(
          "UPDATE mst_productgallery SET ImageUrl=?, Title=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? WHERE GalleryId=?",
          [
            ImageUrl || old[0].ImageUrl,
            Title,
            DisplayOrder,
            ActiveStatus,
            UpdatedBy,
            currentTime,
            GalleryId,
          ],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ success: false, message: err.message });
            res.json({
              success: true,
              message: "Gallery item updated successfully",
            });
          },
        );
      },
    );
  } else {
    db.query(
      "INSERT INTO mst_productgallery (ProductId, ImageUrl, Title, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) VALUES (?,?,?,?,?,?,?,?)",
      [
        ProductId,
        ImageUrl,
        Title,
        DisplayOrder,
        ActiveStatus,
        currentTime,
        UpdatedBy,
        currentTime,
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
        res.json({
          success: true,
          message: "Gallery item created successfully",
          GalleryId: result.insertId,
        });
      },
    );
  }
};

exports.deleteGallery = (req, res) => {
  const { GalleryId } = req.params;
  db.query(
    "SELECT ImageUrl FROM mst_productgallery WHERE GalleryId = ?",
    [GalleryId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Gallery item not found" });
      db.query(
        "DELETE FROM mst_productgallery WHERE GalleryId = ?",
        [GalleryId],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          if (results[0].ImageUrl) {
            const filePath = path.join(
              __dirname,
              "../uploads/OnlineImages/ProductImages",
              results[0].ImageUrl,
            );
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error(e);
              }
            }
          }
          res.json({
            success: true,
            message: "Gallery item deleted successfully",
          });
        },
      );
    },
  );
};

exports.updateActiveStatus = (req, res) => {
  const { GalleryId, ActiveStatus } = req.body;
  if (!GalleryId || ActiveStatus === undefined)
    return res
      .status(400)
      .json({ success: false, message: "Missing GalleryId or ActiveStatus" });
  db.query(
    "UPDATE mst_productgallery SET ActiveStatus = ?, UpdatedOn = NOW() WHERE GalleryId = ?",
    [ActiveStatus, GalleryId],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    },
  );
};
