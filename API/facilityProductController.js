const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/FacilityproductImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllFacilityProducts = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY p.DisplayOrder ASC) AS SerialNo,
           p.ProductID,
           p.CategoryID,
           c.CategoryName,
           p.ProductName,
           p.ProductNameURL,
           p.FacilityDefaultImage,
           p.DisplayOrder,
           p.ActiveStatus
    FROM mst_facilityproduct p
    LEFT JOIN mst_facilitycategory c ON p.CategoryID = c.CategoryID
    ORDER BY p.DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getFacilityProductById = (req, res) => {
  const ProductID = req.query.ProductID;
  if (!ProductID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_facilityproduct WHERE ProductID = ? LIMIT 1';
  db.query(sql, [ProductID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateFacilityProduct = (req, res) => {
  const {
    ProductID, CategoryID, ProductName, ProductNameURL, Description,
    ActiveStatus, DisplayOrder, UpdatedBy
  } = req.body;
  const currentTime = new Date();

  const FacilityDefaultImage = req?.files?.FacilityDefaultImage?.[0]?.filename || null;
  const FacilityOtherImage1 = req?.files?.FacilityOtherImage1?.[0]?.filename || null;
  const FacilityOtherImage2 = req?.files?.FacilityOtherImage2?.[0]?.filename || null;
  const FacilityOtherImage3 = req?.files?.FacilityOtherImage3?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT ProductID FROM mst_facilityproduct
    WHERE (ProductName = ? OR ProductNameURL = ?)
    ${ProductID ? 'AND ProductID != ?' : ''}
  `;
  const checkParams = ProductID ? [ProductName, ProductNameURL, ProductID] : [ProductName, ProductNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Product with the same name or URL already exists" });
    }

    if (ProductID) {
      const getOldSql = 'SELECT FacilityDefaultImage, FacilityOtherImage1, FacilityOtherImage2, FacilityOtherImage3 FROM mst_facilityproduct WHERE ProductID = ?';
      db.query(getOldSql, [ProductID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const oldData = oldResults[0];
        const finalDefaultImage = FacilityDefaultImage || oldData.FacilityDefaultImage;
        const finalOther1 = FacilityOtherImage1 || oldData.FacilityOtherImage1;
        const finalOther2 = FacilityOtherImage2 || oldData.FacilityOtherImage2;
        const finalOther3 = FacilityOtherImage3 || oldData.FacilityOtherImage3;

        // Delete old images if new ones are uploaded
        if (FacilityDefaultImage && oldData.FacilityDefaultImage) deleteOldImage(oldData.FacilityDefaultImage);
        if (FacilityOtherImage1 && oldData.FacilityOtherImage1) deleteOldImage(oldData.FacilityOtherImage1);
        if (FacilityOtherImage2 && oldData.FacilityOtherImage2) deleteOldImage(oldData.FacilityOtherImage2);
        if (FacilityOtherImage3 && oldData.FacilityOtherImage3) deleteOldImage(oldData.FacilityOtherImage3);

        const updateSql = `
          UPDATE mst_facilityproduct SET
            CategoryID = ?, ProductName = ?, ProductNameURL = ?, FacilityDefaultImage = ?, 
            FacilityOtherImage1 = ?, FacilityOtherImage2 = ?, FacilityOtherImage3 = ?,
            Description = ?, ActiveStatus = ?, DisplayOrder = ?,
            UpdatedBy = ?, UpdatedOn = ?
          WHERE ProductID = ?
        `;
        db.query(updateSql, [
          CategoryID, ProductName, ProductNameURL, finalDefaultImage,
          finalOther1, finalOther2, finalOther3,
          Description, ActiveStatus, DisplayOrder,
          UpdatedBy, currentTime, ProductID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Product updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_facilityproduct (
          CategoryID, ProductName, ProductNameURL, FacilityDefaultImage, 
          FacilityOtherImage1, FacilityOtherImage2, FacilityOtherImage3,
          Description, ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        CategoryID, ProductName, ProductNameURL, FacilityDefaultImage,
        FacilityOtherImage1, FacilityOtherImage2, FacilityOtherImage3,
        Description, ActiveStatus, DisplayOrder, currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Product created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_facilityproduct SET DisplayOrder = ? WHERE ProductID = ?',
        [item.DisplayOrder, item.ProductID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_facilityproduct`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteFacilityProduct = (req, res) => {
  const ProductID = req.params.ProductID;
  const getImageSql = `SELECT FacilityDefaultImage, FacilityOtherImage1, FacilityOtherImage2, FacilityOtherImage3 FROM mst_facilityproduct WHERE ProductID = ?`;
  db.query(getImageSql, [ProductID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { FacilityDefaultImage, FacilityOtherImage1, FacilityOtherImage2, FacilityOtherImage3 } = results[0];
    db.query('DELETE FROM mst_facilityproduct WHERE ProductID = ?', [ProductID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });

      if (FacilityDefaultImage) deleteOldImage(FacilityDefaultImage);
      if (FacilityOtherImage1) deleteOldImage(FacilityOtherImage1);
      if (FacilityOtherImage2) deleteOldImage(FacilityOtherImage2);
      if (FacilityOtherImage3) deleteOldImage(FacilityOtherImage3);

      res.json({ success: true, message: 'Product deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { ProductID, ActiveStatus } = req.body;
  if (!ProductID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_facilityproduct SET ActiveStatus = ?, UpdatedOn = NOW() WHERE ProductID = ?`;
  db.query(sql, [ActiveStatus, ProductID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
