const db = require('../db');

exports.getAllClientTypes = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           ClientTypeID, TypeName, ActiveStatus, DisplayOrder, PostedDate
    FROM mst_clienttype
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getClientTypeById = (req, res) => {
  const { ClientTypeID } = req.query;
  if (!ClientTypeID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_clienttype WHERE ClientTypeID = ?';
  db.query(sql, [ClientTypeID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateClientType = (req, res) => {
  const { ClientTypeID, TypeName, ActiveStatus, DisplayOrder, UpdatedBy } = req.body;
  const currentTime = new Date();

  if (ClientTypeID) {
    const updateSql = `
      UPDATE mst_clienttype SET
        TypeName = ?, ActiveStatus = ?, DisplayOrder = ?, UpdatedBy = ?, UpdatedOn = ?
      WHERE ClientTypeID = ?
    `;
    db.query(updateSql, [TypeName, ActiveStatus, DisplayOrder, UpdatedBy, currentTime, ClientTypeID], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
      res.json({ success: true, message: "Client type updated successfully" });
    });
  } else {
    const insertSql = `
      INSERT INTO mst_clienttype (TypeName, ActiveStatus, DisplayOrder, UpdatedBy, UpdatedOn)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [TypeName, ActiveStatus, DisplayOrder, UpdatedBy, currentTime], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
      res.json({ success: true, message: "Client type created successfully" });
    });
  }
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_clienttype SET DisplayOrder = ? WHERE ClientTypeID = ?',
        [item.DisplayOrder, item.ClientTypeID], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  });

  Promise.all(queries)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => res.status(500).json({ success: false, message: "Database error" }));
};

exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_clienttype`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteClientType = (req, res) => {
  const { ClientTypeID } = req.params;
  db.query('DELETE FROM mst_clienttype WHERE ClientTypeID = ?', [ClientTypeID], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, message: 'Client type deleted successfully' });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { ClientTypeID, ActiveStatus } = req.body;
  const sql = `UPDATE mst_clienttype SET ActiveStatus = ?, UpdatedOn = NOW() WHERE ClientTypeID = ?`;
  db.query(sql, [ActiveStatus, ClientTypeID], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
