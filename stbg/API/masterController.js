const db = require("../db");

exports.getPartnerPageData = (req, res) => {
  const sqlPartnerTestimonials = `
    SELECT 
      t.TestimonialID,
      t.TestimonialName,
      t.TestimonialNameURL,
      t.TestimonialImage,
      t.Description,
      t.Location,
      t.DisplayOrder
    FROM mst_testimonialdata t
    INNER JOIN mst_testimonial_pages p 
      ON t.TestimonialID = p.TestimonialID
    WHERE t.ActiveStatus = 1
      AND p.PageName = 'Partner'
    ORDER BY t.DisplayOrder ASC;
  `;
  const sqlPartnerLogo = `
    SELECT 
      PartnerLogoID, 
      PartnerLogoImage, 
      DisplayOrder
    FROM mst_partnerlogodata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;
  const sqlPartnerStats = `SELECT NoOfPartners,HowManyCities,ActiveCollaboration,StrategicAlliances from mst_staticdata WHERE StaticID=6;`;
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlPartnerTestimonials, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlPartnerLogo, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlPartnerStats, (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || {});
      });
    })
  ])
    .then(([partnerTestimonials, partnerLogos, partnerStats]) => {
      res.json({
        partnerTestimonials,
        partnerLogos,
        partnerStats
      });
    })
    .catch((err) => {
      console.error("Partner Page API Error:", err);
      res.status(500).json({ error: err.message });
    });
};


exports.getMediaPageData = (req, res) => {
  const { home } = req.query;
  let sqlMediaData = `
    SELECT 
      MediaID,
      Title,
      MediaDate,
      MediaImage,
      ThirdPartyLink
    FROM mst_mediadata
    WHERE ActiveStatus = 1
  `;
  if (home === 'true' || home === '1') {
    sqlMediaData += ` AND DisplayOnHome = 1`;
  }
  sqlMediaData += ` ORDER BY MediaDate DESC`;
  db.query(sqlMediaData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};



exports.getJobCategoryData = (req, res) => {
  const sqlJobCategoryData = `
     SELECT 
      JobCategoryID,
      JobCategoryName,
      JobCategoryDescription,
      SmallDescription,
      JobLocation,
      DisplayOrder,
      ActiveStatus
    FROM mst_jobcategorydata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;
  const sqlTestimonials = `
     SELECT 
    t.TestimonialID,
    t.TestimonialName,
    t.TestimonialNameURL,
    t.TestimonialImage,
    t.Description,
    t.Location,
    t.DisplayOrder
      FROM mst_testimonialdata t
      INNER JOIN mst_testimonial_pages p 
          ON t.TestimonialID = p.TestimonialID
      WHERE t.ActiveStatus = 1
        AND p.PageName = 'Careers'
      ORDER BY t.DisplayOrder ASC;
  `;
  db.query(sqlJobCategoryData, (err, jobResults) => {
    if (err) {
      return res.status(500).json({ error: "Database error on JobCategory" });
    }
    db.query(sqlTestimonials, (err2, testimonialResults) => {
      if (err2) {
        return res.status(500).json({ error: "Database error on Testimonials" });
      }
      res.json({
        jobData: jobResults,
        testimonialData: testimonialResults,
      });
    });
  });
};
