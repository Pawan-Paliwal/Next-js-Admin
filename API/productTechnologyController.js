const db = require("../db");

exports.getTechnologyByProduct = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_producttechnology WHERE ProductId = ? ORDER BY DisplayOrder ASC",
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

exports.saveOrUpdateTechnology = (req, res) => {
  const {
    TechnologyId,
    ProductId,
    Title,
    Description,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy,
  } = req.body;
  const currentTime = new Date();

  if (TechnologyId) {
    db.query(
      "UPDATE mst_producttechnology SET Title=?, Description=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? WHERE TechnologyId=?",
      [
        Title,
        Description,
        DisplayOrder,
        ActiveStatus,
        UpdatedBy,
        currentTime,
        TechnologyId,
      ],
      (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Technology updated successfully" });
      },
    );
  } else {
    db.query(
      "INSERT INTO mst_producttechnology (ProductId, Title, Description, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) VALUES (?,?,?,?,?,?,?,?)",
      [
        ProductId,
        Title,
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
          message: "Technology created successfully",
          TechnologyId: result.insertId,
        });
      },
    );
  }
};

exports.deleteTechnology = (req, res) => {
  const { TechnologyId } = req.params;
  db.query(
    "DELETE FROM mst_producttechnology WHERE TechnologyId = ?",
    [TechnologyId],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, message: "Technology not found" });
      res.json({ success: true, message: "Technology deleted successfully" });
    },
  );
};

exports.updateActiveStatus = (req, res) => {
  const { TechnologyId, ActiveStatus } = req.body;
  if (!TechnologyId || ActiveStatus === undefined)
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing TechnologyId or ActiveStatus",
      });
  db.query(
    "UPDATE mst_producttechnology SET ActiveStatus = ?, UpdatedOn = NOW() WHERE TechnologyId = ?",
    [ActiveStatus, TechnologyId],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    },
  );
};
