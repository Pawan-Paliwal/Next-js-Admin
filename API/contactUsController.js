const db = require("../db");

exports.getAllLeads = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY ContactID DESC) AS SerialNo,
      ContactID, VendorID, FullName, EmailID, PhoneNo,
      CompanyName, Message, EnquiryType, EnquiryFor,
      CountryName, PageName,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate, IsRead
    FROM mst_contact_us 
    ORDER BY ContactID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    res.json(results);
  });
};

exports.saveNewEnquiry = (req, res) => {
  console.log(" hit data");
  const {
    VendorID = null,
    FullName,
    EmailID,
    PhoneNo,
    CompanyName = null,
    Message,
    EnquiryType,
    EnquiryFor,
    CountryName = null,
    PageName = "/thank-you",
  } = req.body;

  const currentTime = new Date();
  const IsRead = 0;

  const insertSql = `
    INSERT INTO mst_contact_us (
      VendorID, FullName, EmailID, PhoneNo, CompanyName, Message, 
      EnquiryType, EnquiryFor, CountryName,
      PageName, PostedDate, IsRead
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    VendorID,
    FullName,
    EmailID,
    PhoneNo,
    CompanyName,
    Message,
    EnquiryType,
    EnquiryFor,
    CountryName,
    PageName,
    currentTime,
    IsRead,
  ];

  db.query(insertSql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to save enquiry",
      });
    }

    res.json({
      success: true,
      message: "Enquiry submitted successfully!",
      contactId: result.insertId,
    });
  });
};

exports.deleteEnquiry = (req, res) => {
  const ContactID = req.params.ContactID;
  const sql = "DELETE FROM mst_contact_us WHERE ContactID = ?";
  db.query(sql, [ContactID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, message: "Enquiry deleted successfully" });
  });
};
