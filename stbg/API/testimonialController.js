const db = require('../db');
const fs = require('fs');
const path = require('path');

// GET all Testimonials with pages
exports.getAllTestimonials = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY t.TestimonialID DESC) AS SerialNo,
      t.TestimonialID,
      t.TestimonialName,
      t.TestimonialNameURL,
      t.TestimonialImage,
      t.Location,
      t.Description,
      t.DisplayOrder,
      t.ActiveStatus,
      GROUP_CONCAT(DISTINCT tp.PageName) AS PageNames
    FROM mst_testimonialdata t
    LEFT JOIN mst_testimonial_pages tp ON t.TestimonialID = tp.TestimonialID
    GROUP BY t.TestimonialID
    ORDER BY t.TestimonialID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: err.message });
    }
    const parsedResults = results.map((row) => {
      const pageNames = row.PageNames ? row.PageNames.split(",") : [];
      return {
        ...row,
        TestimonialPages: pageNames,
        PageNames: undefined,
      };
    });
    res.json(parsedResults);
  });
};

// GET Testimonial by ID with pages
exports.getTestimonialById = (req, res) => {
  const TestimonialID = req.query.TestimonialID;
  if (!TestimonialID) {
    return res.status(400).json({ success: false, message: 'Missing Testimonial ID' });
  }

  const testimonialSql = 'SELECT * FROM mst_testimonialdata WHERE TestimonialID = ? LIMIT 1';
  const pagesSql = 'SELECT PageName FROM mst_testimonial_pages WHERE TestimonialID = ?';

  db.query(testimonialSql, [TestimonialID], (err, testimonialResults) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (testimonialResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    db.query(pagesSql, [TestimonialID], (err, pagesResults) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      const testimonial = testimonialResults[0];
      testimonial.TestimonialPages = pagesResults.map((row) => row.PageName);

      return res.json({ success: true, data: testimonial });
    });
  });
};


// CREATE or UPDATE Testimonial
exports.saveOrUpdateTestimonial = (req, res) => {
  const {
    TestimonialID,
    TestimonialPages,
    TestimonialName,
    TestimonialNameURL,
    Location,
    Description,
    DisplayOrder,
    ActiveStatus,
    UpdatedBy
  } = req.body;
  const currentTime = new Date();
  const uploadedImage = req?.files?.TestimonialImage?.[0]?.filename;
  let pages = [];
  try {
    pages = JSON.parse(TestimonialPages || "[]");
  } catch {
    return res.status(400).json({ success: false, message: "Invalid pages format" });
  }
  if (TestimonialID) {
    if (!TestimonialID || isNaN(TestimonialID)) {
      return res.status(400).json({ success: false, message: "Invalid TestimonialID" });
    }
    const getOldSql = "SELECT TestimonialImage FROM mst_testimonialdata WHERE TestimonialID = ?";
    db.query(getOldSql, [TestimonialID], (err, oldResults) => {
      if (err || oldResults.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid TestimonialID" });
      }
      const finalImage = uploadedImage ?? oldResults[0].TestimonialImage;   // ← safe preserve
      const updateSql = `
        UPDATE mst_testimonialdata SET
          TestimonialName = ?, TestimonialNameURL = ?, TestimonialImage = ?, Location = ?, Description = ?,
          DisplayOrder = ?, ActiveStatus = ?, UpdatedBy = ?, UpdatedOn = ?
        WHERE TestimonialID = ?
      `;
      db.query(updateSql, [
        TestimonialName, TestimonialNameURL, finalImage, Location, Description,
        DisplayOrder, ActiveStatus, UpdatedBy, currentTime, TestimonialID
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
        updateTestimonialPages(TestimonialID, pages, (pageErr) => {
          if (pageErr) return res.status(500).json({ success: false, message: "Failed to update pages" });
          return res.json({ success: true, message: "Testimonial updated successfully" });
        });
      });
    });
  } else {
    const insertSql = `
      INSERT INTO mst_testimonialdata (
        TestimonialName, TestimonialNameURL, TestimonialImage, Location, Description,
        DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [
      TestimonialName, TestimonialNameURL, uploadedImage, Location, Description,
      DisplayOrder, ActiveStatus, currentTime, UpdatedBy, currentTime
    ], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err });
      const newTestimonialID = result.insertId;
      updateTestimonialPages(newTestimonialID, pages, (pageErr) => {
        if (pageErr) return res.status(500).json({ success: false, message: "Testimonial created but failed to assign pages" });
        return res.json({ success: true, message: "Testimonial created successfully" });
      });
    });
  }
};

// Helper function to update testimonial pages (contains both page names and product names)
function updateTestimonialPages(testimonialId, pages, callback) {
  const deleteSql = `
    DELETE FROM mst_testimonial_pages 
    WHERE TestimonialID = ? AND TestimonialID IS NOT NULL
  `;
  db.query(deleteSql, [testimonialId], (err) => {
    if (err) return callback(err);
    if (pages.length === 0) return callback(null);

    const insertSql = `
      INSERT INTO mst_testimonial_pages (TestimonialID, PageName, CreatedAt, UpdatedAt)
      VALUES ?
    `;
    const now = new Date();
    const values = pages.map(p => [testimonialId, p, now, now]);

    db.query(insertSql, [values], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  });
}


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
  const getImageSql = 'SELECT TestimonialImage FROM mst_testimonialdata WHERE TestimonialID = ?';
  db.query(getImageSql, [TestimonialID], (err, imageResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    const sql = 'DELETE FROM mst_testimonialdata WHERE TestimonialID = ?';
    db.query(sql, [TestimonialID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }
      if (imageResults.length > 0 && imageResults[0].TestimonialImage) {
        const filePath = path.join(__dirname, '../uploads/OnlineImages/TestimonialImages', imageResults[0].TestimonialImage);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error('Error deleting file:', e);
          }
        }
      }
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    });
  });
};

// Update status
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