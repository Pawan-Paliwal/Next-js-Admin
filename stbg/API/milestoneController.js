const db = require('../db');

exports.getAllMilestones = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
      MilestoneID,
      Title,
      Description,
      MilestoneImage,
      ActiveStatus,
      DisplayOrder,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_milestonedata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};



exports.getMilestoneById = (req, res) => {
  const MilestoneID = req.query.MilestoneID;
  if (!MilestoneID) return res.status(400).json({ success: false, message: "Missing Milestone ID" });
  db.query("SELECT * FROM mst_milestonedata WHERE MilestoneID = ? LIMIT 1", [MilestoneID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Milestone not found" });
    res.json({ success: true, data: result[0] });
  });
};


exports.saveOrUpdateMilestone = (req, res) => {
  const { MilestoneID, Title, Description, ActiveStatus, UpdatedBy, DisplayOrder } = req.body;
  const currentTime = new Date();
  const MilestoneImage = req.files?.MilestoneImage?.[0]?.filename || null;
  const titleSql = `SELECT MilestoneID FROM mst_milestonedata WHERE Title = ? ${MilestoneID ? "AND MilestoneID != ?" : ""}`;
  const titleParams = MilestoneID ? [Title, MilestoneID] : [Title];
  db.query(titleSql, titleParams, (err, titleResults) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (titleResults.length > 0) return res.status(400).json({ success: false, message: "Title already exists" });
    const orderSql = `SELECT MilestoneID FROM mst_milestonedata WHERE DisplayOrder = ? ${MilestoneID ? "AND MilestoneID != ?" : ""}`;
    const orderParams = MilestoneID ? [DisplayOrder, MilestoneID] : [DisplayOrder];
    db.query(orderSql, orderParams, (err, orderResults) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });
      if (orderResults.length > 0) return res.status(400).json({ success: false, message: "Display order already exists" });
      if (MilestoneID) {
        const getOldSql = "SELECT MilestoneImage FROM mst_milestonedata WHERE MilestoneID = ?";
        db.query(getOldSql, [MilestoneID], (err, old) => {
          const finalImage = MilestoneImage || old[0].MilestoneImage;
          db.query(`
            UPDATE mst_milestonedata SET
              Title = ?, Description = ?, MilestoneImage = ?, ActiveStatus = ?,
              DisplayOrder = ?, UpdatedBy = ?, UpdatedOn = ?
            WHERE MilestoneID = ?
          `, [
            Title, Description, finalImage, ActiveStatus,
            DisplayOrder || 0, UpdatedBy, currentTime, MilestoneID
          ], err => {
            if (err) return res.status(500).json({ success: false, message: "Update failed" });
            res.json({ success: true, message: "Milestone updated successfully" });
          });
        });
      } else {
        db.query(`
          INSERT INTO mst_milestonedata
          (Title, Description, MilestoneImage, ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          Title, Description, MilestoneImage, ActiveStatus,
          DisplayOrder || 0, currentTime, UpdatedBy || "Admin", currentTime
        ], err => {
          if (err) return res.status(500).json({ success: false, message: "Insert failed" });
          res.json({ success: true, message: "Milestone created successfully" });
        });
      }
    });
  });
};



exports.deleteMilestone = (req, res) => {
  db.query("DELETE FROM mst_milestonedata WHERE MilestoneID = ?", [req.params.MilestoneID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Milestone not found" });
    res.json({ success: true, message: "Milestone deleted successfully" });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { MilestoneID, ActiveStatus } = req.body;
  db.query(
    "UPDATE mst_milestonedata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE MilestoneID = ?",
    [ActiveStatus, MilestoneID],
    err => err ? res.status(500).json({ success: false }) : res.json({ success: true, message: "Status updated" })
  );
};

exports.updateMilestoneDisplayOrder = (req, res) => {
  const updates = req.body;
  const promises = updates.map(x =>
    new Promise((resolve, reject) => {
      db.query("UPDATE mst_milestonedata SET DisplayOrder = ? WHERE MilestoneID = ?", [x.DisplayOrder, x.MilestoneID], err =>
        err ? reject(err) : resolve()
      );
    })
  );

  Promise.all(promises)
    .then(() => res.json({ success: true, message: "Display order updated successfully" }))
    .catch(err => res.status(500).json({ success: false, message: "Database error", error: err.message }));
};


exports.getMaxMilestoneDisplayOrder = (req, res) => {
  db.query("SELECT MAX(DisplayOrder) AS maxOrder FROM mst_milestonedata", (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, maxOrder: result[0]?.maxOrder || 0 });
  });
};