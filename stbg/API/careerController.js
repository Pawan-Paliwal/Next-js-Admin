const db = require("../db");

// GET all careers
exports.getAllCareers = (req, res) => {
  const sql = `
    SELECT
      ROW_NUMBER() OVER (ORDER BY JobCategoryID DESC) AS SerialNo,
      JobCategoryID,
      JobCategoryName,
      JobCategoryDescription,
      SmallDescription,
      JobLocation,
      DisplayOrder,
      ActiveStatus,
      PostedDate
    FROM mst_jobcategorydata
    ORDER BY JobCategoryID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};


// GET career by ID
exports.getCareerById = (req, res) => {
  const JobCategoryID = req.query.JobCategoryID;
  if (!JobCategoryID) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Career ID" });
  }
  const careerSql =
    "SELECT * FROM mst_jobcategorydata WHERE JobCategoryID  = ? LIMIT 1";
  db.query(careerSql, [JobCategoryID], (err, careerResults) => {
    if (err) {
      console.error("DB Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    if (careerResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Career not found" });
    }
    return res.json({
      success: true,
      data: careerResults[0],
    });
  });
};


// CREATE or UPDATE career
exports.saveOrUpdateCareer = (req, res) => {
  const {
    JobCategoryID,
    JobCategoryName,
    JobCategoryDescription,
    SmallDescription,
    JobLocation,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy,
  } = req.body;
  const currentTime = new Date();
  const activeStatusVal = ActiveStatus === "1" || ActiveStatus === 1 ? 1 : 0;
  const displayOrderVal = parseInt(DisplayOrder, 10) || 0;
  const checkDuplicateSql = `
    SELECT JobCategoryID FROM mst_jobcategorydata
    WHERE JobCategoryName = ?
    ${JobCategoryID ? "AND JobCategoryID != ?" : ""}
  `;
  const checkParams = JobCategoryID
    ? [JobCategoryName, JobCategoryID]
    : [JobCategoryName];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Job Category with the same name already exists",
      });
    }

    let updatedByVal = Array.isArray(UpdatedBy) ? UpdatedBy[0] : UpdatedBy;
    if (!updatedByVal) updatedByVal = "Admin Panel";
    if (parseInt(JobCategoryID, 10) > 0) {
      const updateSql = ` UPDATE mst_jobcategorydata SET JobCategoryName = ?, JobCategoryDescription = ?,SmallDescription=?, JobLocation=?,DisplayOrder = ?, 
      ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ? WHERE JobCategoryID = ?`;
      db.query(
        updateSql, [JobCategoryName, JobCategoryDescription, SmallDescription, JobLocation, displayOrderVal, activeStatusVal, updatedByVal, currentTime, JobCategoryID],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Update failed" });
          }
          return res.json({
            success: true,
            message: "Job Category updated successfully",
          });
        }
      );
    } else {
      const insertSql = `
        INSERT INTO mst_jobcategorydata (
          JobCategoryName, JobCategoryDescription,SmallDescription,JobLocation, DisplayOrder, 
          ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
        ) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)
      `;
      db.query(
        insertSql, [JobCategoryName, JobCategoryDescription, SmallDescription, JobLocation, displayOrderVal, activeStatusVal, currentTime, updatedByVal, currentTime],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }
          return res.json({
            success: true,
            message: "Job Category created successfully",
          });
        }
      );
    }
  });
};


// DELETE career
exports.deleteCareer = (req, res) => {
  const JobCategoryID = req.params.JobCategoryID;
  const sql = "DELETE FROM mst_jobcategorydata WHERE JobCategoryID  = ?";

  db.query(sql, [JobCategoryID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Career not found" });
    }
    res.json({ success: true, message: "Career deleted successfully" });
  });
};

exports.updateCareerDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data format" });
  }
  const updatePromises = updates.map(({ JobCategoryID, DisplayOrder }) => {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE mst_jobcategorydata SET DisplayOrder = ? WHERE JobCategoryID   = ?";
      db.query(sql, [DisplayOrder, JobCategoryID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });
  Promise.all(updatePromises)
    .then(() =>
      res.json({
        success: true,
        message: "Career display order updated successfully",
      })
    )
    .catch((err) => {
      console.error("Error updating Career display order:", err);
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};

//Update status
exports.updateActiveStatus = (req, res) => {
  let { JobCategoryID, ActiveStatus } = req.body;
  JobCategoryID = parseInt(JobCategoryID, 10);
  ActiveStatus = parseInt(ActiveStatus, 10);
  if (isNaN(JobCategoryID) || isNaN(ActiveStatus)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID or ActiveStatus" });
  }
  const sql = `
    UPDATE mst_jobcategorydata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE JobCategoryID  = ?
  `;
  db.query(sql, [ActiveStatus, JobCategoryID], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "JobCategoryID  not found" });
    }

    res.json({ success: true, message: "Status updated successfully" });
  });
};


// Max Display Order
exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_jobcategorydata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ maxOrder });
  });
};

//  Fetch all active careers
exports.getAllCareersdata = (req, res) => {
  const careersSql = `SELECT * FROM mst_jobcategorydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC;`;
  const gallerySql = `SELECT CareerGalleryID, Type, CareerGalleryImage, VideoUrl, CareerGalleryImageAlt, DisplayOrder FROM mst_careergallerydata ORDER BY DisplayOrder ASC;`;
  db.query(careersSql, (err, careers) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching careers", error: err.message });
    db.query(gallerySql, (err, gallery) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching gallery", error: err.message });
      res.json({ success: true, careers, gallery });
    });
  });
};


