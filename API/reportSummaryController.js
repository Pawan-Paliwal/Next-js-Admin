const db = require("../db");

exports.getAdminDashboard = async (req, res) => {
  try {
    const queries = {
      TotalBlog: "SELECT COUNT(*) as count FROM mst_blogdata",
      TotalAward: "SELECT COUNT(*) as count FROM mst_awarddata",
      TotalCareer: "SELECT COUNT(*) as count FROM mst_careerdata",
      TotalCompany: "SELECT COUNT(*) as count FROM mst_companydata",
      TotalTestimonial: "SELECT COUNT(*) as count FROM mst_testimonialdata",
      TotalGallery: "SELECT COUNT(*) as count FROM mst_webgallerydatab",
      TotalEnquiry: "SELECT COUNT(*) as count FROM mst_contact_us",
      TotalFacilityCategory:
        "SELECT COUNT(*) as count FROM mst_facilitycategory",
      TotalFacilityProduct: "SELECT COUNT(*) as count FROM mst_facilityproduct",
      TotalClientType: "SELECT COUNT(*) as count FROM mst_clienttype",
      TotalWhatsNew: "SELECT COUNT(*) as count FROM mst_whatsnewdata",
      TotalCategory: "SELECT COUNT(*) as count FROM mst_categorydata",
    };

    const results = {};

    const executeQuery = (key, sql) => {
      return new Promise((resolve) => {
        db.query(sql, (err, rows) => {
          if (err) {
            console.error(`Error querying ${key}:`, err.message);
            resolve(0);
          } else {
            resolve(rows[0]?.count || 0);
          }
        });
      });
    };

    const promises = Object.keys(queries).map(async (key) => {
      results[key] = await executeQuery(key, queries[key]);
    });

    await Promise.all(promises);

    // recent interactions (last 10 enquiries)
    const recentEnquiriesSql = `
      SELECT *, DATE_FORMAT(PostedDate, '%d %b %Y, %h:%i %p') AS FormattedDate
      FROM mst_contact_us
      ORDER BY ContactID DESC
      LIMIT 10
    `;
    const recentEnquiries = await new Promise((resolve) => {
      db.query(recentEnquiriesSql, (err, rows) => {
        if (err) resolve([]);
        else resolve(rows);
      });
    });

    res.json({
      success: true,
      predictionCounts: results,
      recentEnquiries: recentEnquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMonthWiseReport = (req, res) => {
  const sql = `
    SELECT MONTH(PostedDate) as month, COUNT(*) as count
    FROM mst_contact_us 
    WHERE YEAR(PostedDate) = YEAR(CURDATE())
    GROUP BY MONTH(PostedDate)
  `;
  db.query(sql, (err, results) => {
    const currentYearArray = Array(12).fill(0);
    if (!err && results) {
      results.forEach((row) => {
        if (row.month >= 1 && row.month <= 12) {
          currentYearArray[row.month - 1] = row.count;
        }
      });
    }
    res.json({ success: true, currentYearArray });
  });
};
