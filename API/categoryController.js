const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (folder, imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages', folder, imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};

exports.getAllCategories = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           CategoryID,
           CategoryName,
           CategoryNameURL,
           CategoryImage,
           CategoryBannerImage,
           DisplayOrder,
           ActiveStatus
    FROM mst_categorydata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCategoryById = (req, res) => {
  const { CategoryID } = req.query;
  if (!CategoryID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_categorydata WHERE CategoryID = ?';
  db.query(sql, [CategoryID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateCategory = (req, res) => {
  const {
    CategoryID, CategoryName, CategoryNameURL, SmallDescription, ActiveStatus,
    DisplayOnHeader, DisplayOnHome, DisplayOnSearchBy, DisplayOrder,
    MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, UpdatedBy
  } = req.body;

  const currentTime = new Date();
  const CategoryImage = req.files?.CategoryImage?.[0]?.filename || null;
  const CategoryBannerImage = req.files?.CategoryBannerImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT CategoryID FROM mst_categorydata
    WHERE (CategoryName = ? OR CategoryNameURL = ?)
    ${CategoryID ? 'AND CategoryID != ?' : ''}
  `;
  const checkParams = CategoryID ? [CategoryName, CategoryNameURL, CategoryID] : [CategoryName, CategoryNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Category with the same name or URL already exists" });
    }

    if (CategoryID) {
      const getOldSql = 'SELECT CategoryImage, CategoryBannerImage FROM mst_categorydata WHERE CategoryID = ?';
      db.query(getOldSql, [CategoryID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const finalImage = CategoryImage || oldResults[0].CategoryImage;
        const finalBanner = CategoryBannerImage || oldResults[0].CategoryBannerImage;

        if (CategoryImage && oldResults[0].CategoryImage && CategoryImage !== oldResults[0].CategoryImage) {
          deleteOldImage('CategoryImages', oldResults[0].CategoryImage);
        }
        if (CategoryBannerImage && oldResults[0].CategoryBannerImage && CategoryBannerImage !== oldResults[0].CategoryBannerImage) {
          deleteOldImage('CategoryImages', oldResults[0].CategoryBannerImage);
        }

        const updateSql = `
          UPDATE mst_categorydata SET
            CategoryName = ?, CategoryNameURL = ?, CategoryImage = ?, CategoryBannerImage = ?, 
            SmallDescription = ?, ActiveStatus = ?, DisplayOnHeader = ?, DisplayOnHome = ?, 
            DisplayOnSearchBy = ?, DisplayOrder = ?, MetaTitle = ?, MetaKeywords = ?, 
            MetaDescriptions = ?, MetaSchema = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE CategoryID = ?
        `;
        db.query(updateSql, [
          CategoryName, CategoryNameURL, finalImage, finalBanner,
          SmallDescription, ActiveStatus, DisplayOnHeader, DisplayOnHome,
          DisplayOnSearchBy, DisplayOrder, MetaTitle, MetaKeywords,
          MetaDescriptions, MetaSchema, UpdatedBy, currentTime, CategoryID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Category updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_categorydata (
          CategoryName, CategoryNameURL, CategoryImage, CategoryBannerImage, 
          SmallDescription, ActiveStatus, DisplayOnHeader, DisplayOnHome, 
          DisplayOnSearchBy, DisplayOrder, MetaTitle, MetaKeywords, 
          MetaDescriptions, MetaSchema, UpdatedBy, PostedDate, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        CategoryName, CategoryNameURL, CategoryImage, CategoryBannerImage,
        SmallDescription, ActiveStatus, DisplayOnHeader, DisplayOnHome,
        DisplayOnSearchBy, DisplayOrder, MetaTitle, MetaKeywords,
        MetaDescriptions, MetaSchema, UpdatedBy, currentTime, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Category created successfully" });
      });
    }
  });
};

exports.deleteCategory = (req, res) => {
  const CategoryID = req.params.CategoryID;
  const getFilesSql = `SELECT CategoryImage, CategoryBannerImage FROM mst_categorydata WHERE CategoryID = ?`;
  db.query(getFilesSql, [CategoryID], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const { CategoryImage, CategoryBannerImage } = results[0];

    db.query('DELETE FROM mst_categorydata WHERE CategoryID = ?', [CategoryID], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Delete failed' });
      if (CategoryImage) deleteOldImage('CategoryImages', CategoryImage);
      if (CategoryBannerImage) deleteOldImage('CategoryImages', CategoryBannerImage);
      res.json({ success: true, message: 'Category deleted successfully' });
    });
  });
};

exports.updateStatus = (req, res) => {
  const { CategoryID, ActiveStatus } = req.body;
  const sql = `UPDATE mst_categorydata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CategoryID = ?`;
  db.query(sql, [ActiveStatus, CategoryID], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_categorydata SET DisplayOrder = ? WHERE CategoryID = ?',
        [item.DisplayOrder, item.CategoryID], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  });

  Promise.all(queries)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => res.status(500).json({ success: false, message: "Database error" }));
};
