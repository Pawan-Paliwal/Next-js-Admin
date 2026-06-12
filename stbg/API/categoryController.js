const db = require("../db");

exports.getAllCategorys = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY CategoryID DESC) AS SerialNo,
      p.*
    FROM mst_categorydata p
    ORDER BY p.CategoryID DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};


exports.saveOrUpdateCategory = (req, res) => {
  try {
    const {
      CategoryID,
      CategoryName,
      CategoryNameURL,
      SmallDescription,
      DisplayOrder,
      DisplayOnHome,
      DisplayOnHeader,
      ActiveStatus,
      PostedDate,
      UpdatedBy,
    } = req.body;

    const currentTime = new Date();
    const uploadedImage =
      req?.files?.CategoryImage?.[0]?.filename || req.body.CategoryImage || null;

    const checkSql = `
      SELECT CategoryID 
      FROM mst_categorydata 
      WHERE (CategoryName = ? OR CategoryNameURL = ?)
      ${CategoryID ? "AND CategoryID != ?" : ""}
    `;
    const checkParams = CategoryID
      ? [CategoryName, CategoryNameURL, CategoryID]
      : [CategoryName, CategoryNameURL];

    db.query(checkSql, checkParams, (err, duplicates) => {
      if (err) return res.status(500).json({ success: false, message: "Database error", error: err.message });
      if (duplicates.length > 0) return res.status(400).json({ success: false, message: "Category with the same name or URL already exists" });

      const updatedByValue = Array.isArray(UpdatedBy) ? [...new Set(UpdatedBy)].join(", ") : UpdatedBy;

      if (CategoryID) {
        const updateSql = `
          UPDATE mst_categorydata SET
            CategoryName=?, CategoryNameURL=?, SmallDescription=?, CategoryImage=?, DisplayOrder=?, 
            DisplayOnHome=?, DisplayOnHeader=?, ActiveStatus=?, PostedDate=?,
            UpdatedBy=?, UpdatedOn=?
          WHERE CategoryID=?
        `;
        const updateParams = [
          CategoryName, CategoryNameURL, SmallDescription || null,
          uploadedImage, DisplayOrder,
          DisplayOnHome || 0, DisplayOnHeader || 0, ActiveStatus || 0, PostedDate || currentTime,
          updatedByValue, currentTime,
          CategoryID
        ];

        db.query(updateSql, updateParams, (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err.message });
          return res.json({ success: true, message: "Category updated successfully" });
        });
      } else {
        const insertSql = `
          INSERT INTO mst_categorydata
            (CategoryName, CategoryNameURL, SmallDescription, CategoryImage, DisplayOrder, DisplayOnHome, DisplayOnHeader, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertParams = [
          CategoryName, CategoryNameURL, SmallDescription || null,
          uploadedImage, DisplayOrder,
          DisplayOnHome || 0, DisplayOnHeader || 0, ActiveStatus || 1, PostedDate || currentTime,
          UpdatedBy, currentTime
        ];

        db.query(insertSql, insertParams, (err, result) => {
          if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err.message });
          return res.json({ success: true, message: "Category created successfully", CategoryID: result.insertId });
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

exports.getCategoryById = (req, res) => {
  const CategoryID = req.query.CategoryID;
  if (!CategoryID)
    return res
      .status(400)
      .json({ success: false, message: "Missing Category ID" });
  const sql = "SELECT * FROM mst_categorydata WHERE CategoryID = ? LIMIT 1";
  db.query(sql, [CategoryID], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    if (results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    return res.json({ success: true, data: results[0] });
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data format" });
  }
  const updatePromises = updates.map(({ CategoryID, DisplayOrder }) => {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE mst_categorydata SET DisplayOrder = ? WHERE CategoryID = ?";
      db.query(sql, [DisplayOrder, CategoryID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  Promise.all(updatePromises)
    .then(() =>
      res.json({ success: true, message: "Display order updated successfully" })
    )
    .catch((err) => {
      console.error("Error updating display order:", err);
      res
        .status(500)
        .json({
          success: false,
          message: "Database error",
          error: err.message,
        });
    });
};

exports.getMaxDisplayOrder = (req, res) => {
  const sql = "SELECT MAX(DisplayOrder) AS maxOrder FROM mst_categorydata";
  db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({
          success: false,
          message: "Database error",
          error: err.message,
        });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ success: true, maxOrder });
  });
};

exports.deleteCategory = (req, res) => {
  const { CategoryID } = req.params;
  if (!CategoryID)
    return res
      .status(400)
      .json({ success: false, message: "Missing CategoryID in params" });
  const sql = "DELETE FROM mst_categorydata WHERE CategoryID = ?";
  db.query(sql, [CategoryID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({
          success: false,
          message: "Database error",
          error: err.message,
        });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { CategoryID, ActiveStatus } = req.body;
  if (!CategoryID || ActiveStatus === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing CategoryID or ActiveStatus" });
  }
  const sql = `
    UPDATE mst_categorydata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE CategoryID = ?
  `;
  db.query(sql, [ActiveStatus, CategoryID], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }

    res.json({ success: true, message: "Status updated successfully" });
  });
};

exports.getAllCategoryData = (req, res) => {
  const sql = `SELECT CategoryID,CategoryName,CategoryNameURL FROM mst_categorydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }
    res.json({ success: true, data: results });
  });
};