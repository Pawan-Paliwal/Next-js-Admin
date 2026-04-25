const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/CompanyImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllCompanies = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           CompanyID,
           CompanyName,
           CompanyNameURL,
           CompanyImage,
           CompanyBannerImage,
           SmallDescription,
           Tagline,
           DisplayOrder,
           ActiveStatus
    FROM mst_companydata
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCompanyById = (req, res) => {
  const CompanyID = req.query.CompanyID;
  if (!CompanyID) return res.status(400).json({ success: false, message: 'Missing ID' });
  const sql = 'SELECT * FROM mst_companydata WHERE CompanyID = ? LIMIT 1';
  db.query(sql, [CompanyID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateCompany = (req, res) => {
  const {
    CompanyID, CompanyName, CompanyNameURL, SmallDescription, Tagline, Description,
    ActiveStatus, DisplayOrder, MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, UpdatedBy
  } = req.body;
  
  const currentTime = new Date();
  const CompanyImage = req?.files?.CompanyImage?.[0]?.filename || null;
  const CompanyBannerImage = req?.files?.CompanyBannerImage?.[0]?.filename || null;

  const checkDuplicateSql = `
    SELECT CompanyID FROM mst_companydata
    WHERE (CompanyName = ? OR CompanyNameURL = ?)
    ${CompanyID ? 'AND CompanyID != ?' : ''}
  `;
  const checkParams = CompanyID ? [CompanyName, CompanyNameURL, CompanyID] : [CompanyName, CompanyNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Company with the same name or URL already exists" });
    }

    if (CompanyID) {
      const getOldSql = 'SELECT CompanyImage, CompanyBannerImage FROM mst_companydata WHERE CompanyID = ?';
      db.query(getOldSql, [CompanyID], (err, oldResults) => {
        if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: "Invalid ID" });
        
        const finalImage = CompanyImage || oldResults[0].CompanyImage;
        const finalBanner = CompanyBannerImage || oldResults[0].CompanyBannerImage;

        if (CompanyImage && oldResults[0].CompanyImage && CompanyImage !== oldResults[0].CompanyImage) {
          deleteOldImage(oldResults[0].CompanyImage);
        }
        if (CompanyBannerImage && oldResults[0].CompanyBannerImage && CompanyBannerImage !== oldResults[0].CompanyBannerImage) {
          deleteOldImage(oldResults[0].CompanyBannerImage);
        }

        const updateSql = `
          UPDATE mst_companydata SET
            CompanyName = ?, CompanyNameURL = ?, CompanyImage = ?, CompanyBannerImage = ?, 
            SmallDescription = ?, Tagline = ?, Description = ?, ActiveStatus = ?, DisplayOrder = ?,
            MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?, 
            UpdatedBy = ?, UpdatedOn = ?
          WHERE CompanyID = ?
        `;
        db.query(updateSql, [
          CompanyName, CompanyNameURL, finalImage, finalBanner,
          SmallDescription, Tagline, Description, ActiveStatus, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          UpdatedBy, currentTime, CompanyID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Company updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_companydata (
          CompanyName, CompanyNameURL, CompanyImage, CompanyBannerImage, 
          SmallDescription, Tagline, Description, ActiveStatus, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, 
          PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        CompanyName, CompanyNameURL, CompanyImage, CompanyBannerImage,
        SmallDescription, Tagline, Description, ActiveStatus, DisplayOrder,
        MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
        currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Company created successfully" });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid format" });
  
  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mst_companydata SET DisplayOrder = ? WHERE CompanyID = ?', 
      [item.DisplayOrder, item.CompanyID], (err, result) => {
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
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_companydata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.deleteCompany = (req, res) => {
  const CompanyID = req.params.CompanyID;
  const getImageSql = `SELECT CompanyImage, CompanyBannerImage FROM mst_companydata WHERE CompanyID = ?`;
  db.query(getImageSql, [CompanyID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    
    const { CompanyImage, CompanyBannerImage } = results[0];
    db.query('DELETE FROM mst_companydata WHERE CompanyID = ?', [CompanyID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
      
      if (CompanyImage) deleteOldImage(CompanyImage);
      if (CompanyBannerImage) deleteOldImage(CompanyBannerImage);
      
      res.json({ success: true, message: 'Company deleted successfully' });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { CompanyID, ActiveStatus } = req.body;
  if (!CompanyID || ActiveStatus === undefined) return res.status(400).json({ success: false, message: "Missing ID/Status" });
  
  const sql = `UPDATE mst_companydata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CompanyID = ?`;
  db.query(sql, [ActiveStatus, CompanyID], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
};
