const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/FacilitycategoryImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllFacilityCategories = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           CategoryID,
           CategoryName,
           CategoryNameURL,
           CategoryImage,
           SmallDescription,
           DisplayOrder,
           ActiveStatus
    FROM mst_facilitycategory
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getFacilityCategoryById = (req, res) => {
  const CategoryID = req.query.CategoryID;
  if (!CategoryID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_facilitycategory WHERE CategoryID = ? LIMIT 1';
  db.query(sql, [CategoryID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateFacilityCategory = (req, res) => {
  const {
    CategoryID, CategoryName, CategoryNameURL, Tagline, SmallDescription, Description,
    ActiveStatus, DisplayOrder, MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const CategoryImage = req?.files?.CategoryImage?.[0]?.filename || null;
  const BannerImage = req?.files?.BannerImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT CategoryID FROM mst_facilitycategory
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
      const getOldSql = 'SELECT CategoryImage, BannerImage FROM mst_facilitycategory WHERE CategoryID = ?';
      db.query(getOldSql, [CategoryID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });

        const finalImage = CategoryImage || oldResults[0].CategoryImage;
        const finalBanner = BannerImage || oldResults[0].BannerImage;

        if (CategoryImage && oldResults[0].CategoryImage && CategoryImage !== oldResults[0].CategoryImage) {
          deleteOldImage(oldResults[0].CategoryImage);
        }
        if (BannerImage && oldResults[0].BannerImage && BannerImage !== oldResults[0].BannerImage) {
          deleteOldImage(oldResults[0].BannerImage);
        }

        const updateSql = `
          UPDATE mst_facilitycategory SET
            CategoryName = ?, CategoryNameURL = ?, CategoryImage = ?, BannerImage = ?,
            Tagline = ?, SmallDescription = ?, Description = ?, 
            ActiveStatus = ?, DisplayOrder = ?,
            MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?, 
            UpdatedBy = ?, UpdatedOn = ?
          WHERE CategoryID = ?
        `;
        db.query(updateSql, [
          CategoryName, CategoryNameURL, finalImage, finalBanner,
          Tagline, SmallDescription, Description,
          ActiveStatus, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          UpdatedBy, currentTime, CategoryID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Category updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_facilitycategory (
          CategoryName, CategoryNameURL, CategoryImage, BannerImage,
          Tagline, SmallDescription, Description, 
          ActiveStatus, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, 
          PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        CategoryName, CategoryNameURL, CategoryImage, BannerImage,
        Tagline, SmallDescription, Description,
        ActiveStatus, DisplayOrder,
        MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
        currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Category created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });

  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_facilitycategory SET DisplayOrder = ? WHERE CategoryID = ?',
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

exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_facilitycategory`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteFacilityCategory = (req, res) => {
  const CategoryID = req.params.CategoryID;
  const getImageSql = `SELECT CategoryImage FROM mst_facilitycategory WHERE CategoryID = ?`;
  db.query(getImageSql, [CategoryID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const { CategoryImage } = results[0];
    db.query('DELETE FROM mst_facilitycategory WHERE CategoryID = ?', [CategoryID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
      if (CategoryImage) deleteOldImage(CategoryImage);
      res.json({ success: true, message: 'Category deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { CategoryID, ActiveStatus } = req.body;
  if (!CategoryID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });

  const sql = `UPDATE mst_facilitycategory SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CategoryID = ?`;
  db.query(sql, [ActiveStatus, CategoryID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
