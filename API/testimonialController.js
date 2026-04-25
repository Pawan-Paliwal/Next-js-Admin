const db = require('../db');
const path = require('path');
const fs = require('fs');

// DELETE OLD IMAGE FUNCTION
const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/TestimonialImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting old image:', err);
    }
  });
};


// GET all Testimonials
exports.getAllTestimonials = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY TestimonialID DESC) AS SerialNo,
           TestimonialID,
           TestimonialName,
           TestimonialNameURL,
           TestimonialImage,
           TestimonialDescription,
           DisplayOnHome,
           DisplayOrder,
           ActiveStatus
    FROM mst_testimonialdata
    ORDER BY TestimonialID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};


// GET Testimonial by ID
exports.getTestimonialById = (req, res) => {
  const TestimonialID = req.query.TestimonialID;
  if (!TestimonialID) return res.status(400).json({ success: false, message: 'Missing Testimonial ID' });
  const sql = 'SELECT * FROM mst_testimonialdata WHERE TestimonialID = ? LIMIT 1';
  db.query(sql, [TestimonialID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.json({ success: true, data: results[0] });
  });
};

// CREATE or UPDATE Testimonial
exports.saveOrUpdateTestimonial = (req, res) => {
  const {
    TestimonialID,
    TestimonialName,
    TestimonialNameURL,
    TestimonialDescription,
    DisplayOnHome,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const TestimonialImage = req?.files?.TestimonialImage?.[0]?.filename || null;
  const checkDuplicateSql = `
    SELECT TestimonialID FROM mst_testimonialdata
    WHERE (TestimonialName = ? OR TestimonialNameURL = ?)
    ${TestimonialID ? 'AND TestimonialID != ?' : ''}
  `;
  const checkParams = TestimonialID ? [TestimonialName, TestimonialNameURL, TestimonialID] : [TestimonialName, TestimonialNameURL];
  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Testimonial with the same name or URL already exists" });
    }
    if (TestimonialID) {
      const getOldSql = 'SELECT TestimonialImage FROM mst_testimonialdata WHERE TestimonialID = ?';
      db.query(getOldSql, [TestimonialID], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res.status(400).json({ success: false, message: "Invalid TestimonialID" });
        }
        const finalImage = TestimonialImage || oldResults[0].TestimonialImage;
        if (TestimonialImage && oldResults[0].TestimonialImage && TestimonialImage !== oldResults[0].TestimonialImage) {
          deleteOldImage(oldResults[0].TestimonialImage);
        }
        const updateSql = `
          UPDATE mst_testimonialdata SET
            TestimonialName = ?, TestimonialNameURL = ?, TestimonialImage = ?, TestimonialDescription = ?, DisplayOnHome = ?,
            DisplayOrder = ?, ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ?
          WHERE TestimonialID = ?
        `;
        db.query(updateSql, [
          TestimonialName, TestimonialNameURL, finalImage, TestimonialDescription, DisplayOnHome,
          DisplayOrder, ActiveStatus, UpdatedBy, currentTime, TestimonialID
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
          return res.json({ success: true, message: "Testimonial updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_testimonialdata (
          TestimonialName, TestimonialNameURL, TestimonialImage, TestimonialDescription, DisplayOnHome,
          DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        TestimonialName, TestimonialNameURL, TestimonialImage, TestimonialDescription, DisplayOnHome,
        DisplayOrder, ActiveStatus, currentTime, UpdatedBy, currentTime
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
        return res.json({ success: true, message: "Testimonial created successfully" });
      });
    }
  });
};


// Update Display Order
exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ success: false, message: "Invalid data format" });
  }
  const queries = updates.map(item => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE mst_testimonialdata SET DisplayOrder = ? WHERE TestimonialID = ?';
      db.query(sql, [item.DisplayOrder, item.TestimonialID], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
  Promise.all(queries)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(err => {
      console.error("Error updating display orders:", err);
      res.status(500).json({ success: false, message: "Database error" });
    });
};

// Max Display Order
exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_testimonialdata`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const maxOrder = results[0]?.maxOrder || 0;
    res.json({ maxOrder });
  });
};


// DELETE Testimonial
exports.deleteTestimonial = (req, res) => {
  const TestimonialID = req.params.TestimonialID;
  const getImageSql = `
    SELECT TestimonialImage
    FROM mst_testimonialdata
    WHERE TestimonialID = ?
  `;
  db.query(getImageSql, [TestimonialID], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    const { TestimonialImage } = results[0];
    const deleteSql = 'DELETE FROM mst_testimonialdata WHERE TestimonialID = ?';
    db.query(deleteSql, [TestimonialID], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }
      if (TestimonialImage) deleteOldImage(TestimonialImage);
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    });
  });
};

//Update status
exports.updateActiveStatus = (req, res) => {
  const { TestimonialID, ActiveStatus } = req.body;
  if (!TestimonialID || ActiveStatus === undefined) {
    return res.status(400).json({ success: false, message: "Missing ID or ActiveStatus" });
  }
  const sql = `
    UPDATE mst_testimonialdata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE TestimonialID = ?
  `;
  db.query(sql, [ActiveStatus, TestimonialID], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Status updated successfully" });
  });
};