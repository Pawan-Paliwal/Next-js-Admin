const db = require("../db");
// get all career data for admin
exports.getAllCareerAdminData = (req, res) => {
  const sql = `SELECT ROW_NUMBER() OVER (ORDER BY CareerID DESC) AS SerialNo, CareerID, JobCategoryID, FullName, EmailID, PhoneNo, Resume, Message, PostedDate, IsRead FROM mst_careerdata ORDER BY CareerID DESC `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};


// Delete a career application/visitor
exports.deleteCareerData = (req, res) => {
  const CareerID = req.params.CareerID;
  const sql = "DELETE FROM mst_careerdata WHERE CareerID = ?";
  db.query(sql, [CareerID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Career application not found" });
    }
    res.json({ success: true, message: "Career application deleted successfully" });
  });
};



// INSERT Career Enquiry
exports.saveNewCareerEnquiry = (req, res) => {
  try {
    const {
      CareerID,
      JobCategoryID,
      FullName,
      EmailID,
      PhoneNo,
      Message,
    } = req.body;
    const currentTime = new Date();
    const uploadedResume = req?.files?.Resume?.[0]?.filename || null;
    const IsRead = 0;
    if (!JobCategoryID || !FullName || !EmailID || !PhoneNo || !uploadedResume) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const insertSql = `
      INSERT INTO mst_careerdata (
        CareerID,
        JobCategoryID,
        FullName,
        EmailID,
        PhoneNo,
        Resume,
        Message,
        PostedDate,
        IsRead
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [
      CareerID,
      JobCategoryID,
      FullName,
      EmailID,
      PhoneNo,
      uploadedResume,
      Message,
      currentTime,
      IsRead,
    ];
    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to save career enquiry",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Career enquiry submitted successfully",
        CareerEnquiryID: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

