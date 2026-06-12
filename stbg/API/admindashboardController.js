const db = require('../db');

exports.getDashboardData = (req, res) => {
  const contactQuery = `
    SELECT 
      ContactID,
      FullName,
      EmailID,
      PhoneNo,
      City,
      State,
      Pincode,
      Product,
      Message,
      EnquiryType,
      EnquiryFor,
      PageName,
      IsRead,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_contact_us 
    ORDER BY ContactID DESC
  `;

  const monthlyContactQuery = `
    SELECT 
      YEAR(PostedDate) AS year,
      MONTH(PostedDate) AS month,
      COUNT(*) AS totalContacts,
      MAX(PostedDate) AS lastEnquiryDate
    FROM mst_contact_us
    WHERE PostedDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY YEAR(PostedDate), MONTH(PostedDate)
    ORDER BY year ASC, month ASC
  `;

  const categoryQuery = `
    SELECT 
      CategoryID,
      CategoryName,
      CategoryNameURL,
      CategoryImage,
      SmallDescription,
      DisplayOrder,
      ActiveStatus,
      DisplayOnHome,
      DisplayOnHeader,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      DATE_FORMAT(UpdatedOn, '%d %b %Y') AS UpdatedOn
    FROM mst_categorydata
    ORDER BY DisplayOrder ASC
  `;

  const testimonialQuery = `
    SELECT 
      TestimonialID,
      TestimonialName,
      TestimonialNameURL,
      TestimonialImage,
      Description,
      Location,
      DisplayOrder,
      ActiveStatus,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      DATE_FORMAT(UpdatedOn, '%d %b %Y') AS UpdatedOn
    FROM mst_testimonialdata
    ORDER BY DisplayOrder ASC
  `;

  const teamQuery = `
    SELECT 
      TeamID,
      TeamName,
      TeamDesignation,
      TeamBio,
      TeamImage,
      TeamType,
      ActiveStatus,
      DisplayOrder,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      DATE_FORMAT(UpdatedOn, '%d %b %Y') AS UpdatedOn
    FROM mst_teamdata
    ORDER BY DisplayOrder ASC
  `;

  const jobCategoryQuery = `
    SELECT 
      JobCategoryID,
      JobCategoryName,
      JobCategoryDescription,
      SmallDescription,
      JobLocation,
      DisplayOrder,
      ActiveStatus,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate,
      UpdatedBy,
      DATE_FORMAT(UpdatedOn, '%d %b %Y') AS UpdatedOn
    FROM mst_jobcategorydata
    ORDER BY DisplayOrder ASC
  `;

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(contactQuery, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(monthlyContactQuery, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(categoryQuery, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(testimonialQuery, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(teamQuery, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(jobCategoryQuery, (err, results) => err ? reject(err) : resolve(results));
    })
  ])
    .then(([
      contacts,
      monthlyContacts,
      categories,
      testimonials,
      team,
      jobCategories
    ]) => {
      res.json({
        success: true,
        data: {
          contacts: {
            list: contacts,
            monthly: monthlyContacts,
            total: contacts.length,
            unread: contacts.filter(c => c.IsRead === 0).length,
            read: contacts.filter(c => c.IsRead === 1).length
          },
          categories: {
            list: categories,
            total: categories.length,
            active: categories.filter(c => c.ActiveStatus === 1).length,
            displayOnHome: categories.filter(c => c.DisplayOnHome === 1).length,
            displayOnHeader: categories.filter(c => c.DisplayOnHeader === 1).length
          },
          testimonials: {
            list: testimonials,
            total: testimonials.length,
            active: testimonials.filter(t => t.ActiveStatus === 1).length
          },
          team: {
            list: team,
            total: team.length,
            active: team.filter(t => t.ActiveStatus === 1).length
          },
          jobCategories: {
            list: jobCategories,
            total: jobCategories.length,
            active: jobCategories.filter(j => j.ActiveStatus === 1).length
          }
        }
      });
    })
    .catch(err => {
      console.error('SQL Error:', err);
      res.status(500).json({
        success: false,
        message: 'Database error occurred',
        error: err.message
      });
    });
};