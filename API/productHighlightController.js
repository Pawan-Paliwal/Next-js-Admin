const db = require("../db");

exports.getHighlightsByProduct = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_producthighlights WHERE ProductId = ? ORDER BY DisplayOrder ASC",
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

exports.saveOrUpdateHighlight = (req, res) => {
  const {
    HighlightId,
    ProductId,
    Title,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy,
  } = req.body;
  const currentTime = new Date();

  if (HighlightId) {
    db.query(
      "UPDATE mst_producthighlights SET Title=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? WHERE HighlightId=?",
      [Title, DisplayOrder, ActiveStatus, UpdatedBy, currentTime, HighlightId],
      (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Highlight updated successfully" });
      },
    );
  } else {
    db.query(
      "INSERT INTO mst_producthighlights (ProductId, Title, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) VALUES (?,?,?,?,?,?,?)",
      [
        ProductId,
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
          message: "Highlight created successfully",
          HighlightId: result.insertId,
        });
      },
    );
  }
};

exports.deleteHighlight = (req, res) => {
  const { HighlightId } = req.params;
  db.query(
    "DELETE FROM mst_producthighlights WHERE HighlightId = ?",
    [HighlightId],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, message: "Highlight not found" });
      res.json({ success: true, message: "Highlight deleted successfully" });
    },
  );
};

exports.updateActiveStatus = (req, res) => {
  const { HighlightId, ActiveStatus } = req.body;
  if (!HighlightId || ActiveStatus === undefined)
    return res
      .status(400)
      .json({ success: false, message: "Missing HighlightId or ActiveStatus" });
  db.query(
    "UPDATE mst_producthighlights SET ActiveStatus = ?, UpdatedOn = NOW() WHERE HighlightId = ?",
    [ActiveStatus, HighlightId],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    },
  );
};
