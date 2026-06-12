const db = require("../db");
const fs = require("fs");
const path = require("path");

exports.getCircuitsByProduct = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_productcircuits WHERE ProductId = ? ORDER BY DisplayOrder ASC",
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

exports.saveOrUpdateCircuit = (req, res) => {
  const {
    CircuitId,
    ProductId,
    Description,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy,
  } = req.body;
  const currentTime = new Date();
  const ImageUrl = req.files?.ImageUrl?.[0]?.filename || null;
  if (CircuitId) {
    db.query(
      "SELECT ImageUrl FROM mst_productcircuits WHERE CircuitId = ?",
      [CircuitId],
      (err, old) => {
        if (err || old.length === 0)
          return res
            .status(400)
            .json({ success: false, message: "Invalid CircuitId" });
        db.query(
          "UPDATE mst_productcircuits SET ImageUrl=?, Description=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? WHERE CircuitId=?",
          [
            ImageUrl || old[0].ImageUrl,
            Description,
            DisplayOrder,
            ActiveStatus,
            UpdatedBy,
            currentTime,
            CircuitId,
          ],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ success: false, message: err.message });
            res.json({
              success: true,
              message: "Circuit updated successfully",
            });
          },
        );
      },
    );
  } else {
    db.query(
      "INSERT INTO mst_productcircuits (ProductId, ImageUrl, Description, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) VALUES (?,?,?,?,?,?,?,?)",
      [
        ProductId,
        ImageUrl,
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
        res.json({
          success: true,
          message: "Circuit created successfully",
          CircuitId: result.insertId,
        });
      },
    );
  }
};

exports.deleteCircuit = (req, res) => {
  const { CircuitId } = req.params;
  db.query(
    "SELECT ImageUrl FROM mst_productcircuits WHERE CircuitId = ?",
    [CircuitId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Circuit not found" });
      db.query(
        "DELETE FROM mst_productcircuits WHERE CircuitId = ?",
        [CircuitId],
        (err) => {
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
          res.json({ success: true, message: "Circuit deleted successfully" });
        },
      );
    },
  );
};

exports.updateActiveStatus = (req, res) => {
  const { CircuitId, ActiveStatus } = req.body;
  if (!CircuitId || ActiveStatus === undefined)
    return res
      .status(400)
      .json({ success: false, message: "Missing CircuitId or ActiveStatus" });
  db.query(
    "UPDATE mst_productcircuits SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CircuitId = ?",
    [ActiveStatus, CircuitId],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    },
  );
};
