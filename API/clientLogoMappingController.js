const db = require('../db');

exports.getLogosWithAssignment = (req, res) => {
  const { ClientTypeID } = req.query;
  if (!ClientTypeID) return res.status(400).json({ success: false, message: 'Missing ClientTypeID' });
  const sql = `
    SELECT p.PartnerLogoID, p.PartnerLogoImage,
           CASE WHEN m.MappingID IS NOT NULL THEN 1 ELSE 0 END AS IsAssigned
    FROM mst_partnerlogodata p
    LEFT JOIN mst_clientlogomapping m ON p.PartnerLogoID = m.PartnerLogoID AND m.ClientTypeID = ?
    WHERE p.ActiveStatus = 1
    ORDER BY p.DisplayOrder ASC
  `;
  db.query(sql, [ClientTypeID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    res.json({ success: true, data: results });
  });
};



exports.assignLogosToType = (req, res) => {
  const { ClientTypeID, PartnerLogoIDs } = req.body;
  if (!ClientTypeID) return res.status(400).json({ success: false, message: 'Missing ClientTypeID' });
  db.query('DELETE FROM mst_clientlogomapping WHERE ClientTypeID = ?', [ClientTypeID], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to clear old mappings" });
    if (!PartnerLogoIDs || PartnerLogoIDs.length === 0) {
      return res.json({ success: true, message: "Assignments cleared successfully" });
    }
    const values = PartnerLogoIDs.map(id => [ClientTypeID, id]);
    const insertSql = 'INSERT INTO mst_clientlogomapping (ClientTypeID, PartnerLogoID) VALUES ?';
    db.query(insertSql, [values], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to assign logos", error: err });
      res.json({ success: true, message: "Logos assigned successfully" });
    });
  });
};


