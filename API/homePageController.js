const db = require("../db");


exports.getAllDataOfHeader = (req, res) => {
  const productSql = ` SELECT ProductId, ProductName, ProductNameURL FROM mst_products WHERE ActiveStatus = 1 AND DisplayOnHeader = 1 ORDER BY DisplayOrder ASC `;
  const categorySql = ` SELECT CategoryID, CategoryName, CategoryNameURL FROM mst_facilitycategory WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(productSql, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      db.query(categorySql, (err, results) => err ? reject(err) : resolve(results));
    }),
  ])
    .then(([products, facilityCategories]) => {
      res.json({ products, facilityCategories });
    })
    .catch(err => {
      console.error('SQL Error:', err);
      res.status(500).json({ error: err.message });
    });
};

exports.getAllDataOfFooter = (req, res) => {
  const turnKey = ` SELECT ClientTypeID , TypeName, TypeNameURL FROM mst_clienttype WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(turnKey, (err, results) => err ? reject(err) : resolve(results));
    }),
  ])
    .then(([trunkeycategory]) => {
      res.json({ trunkeycategory });
    })
    .catch(err => {
      console.error('SQL Error:', err);
      res.status(500).json({ error: err.message });
    });
};


exports.getHomePageData = (req, res) => {
  const sqlPartnerLogos = ` SELECT PartnerLogoID, PartnerLogoImage, DisplayOrder FROM mst_partnerlogodata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC `;
  const sqlManufacturing = ` SELECT ManufacturingID, ManufacturingName, ManufacturingVideoUrl, DisplayOrder FROM mst_manufacturing WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlBlogs = ` SELECT BlogID, BlogName, BlogNameURL, BlogImage, DisplayOrder,  DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate FROM mst_blogdata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlTestimonials = ` SELECT TestimonialID, TestimonialName,TestimonialDescription, TestimonialImage, DisplayOrder FROM mst_testimonialdata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC `;
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlPartnerLogos, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlManufacturing, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlBlogs, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlTestimonials, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
  ])
    .then(([partnerLogos, manufacturing, blogs, testimonials]) => {
      res.json({ partnerLogos, manufacturing, blogs, testimonials });
    })
    .catch((err) => {
      console.error("SQL Error:", err);
      res.status(500).json({ error: err.message });
    });
};

exports.getAboutPageData = (req, res) => {
  const sqlMilestones = ` SELECT MilestoneID, MilestoneName, MilestoneImage,Description,MilestoneYear, DisplayOrder FROM mst_ourmilestonedata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlDirector = ` SELECT DirectorID , DirectorName, DirectorDesignation,DirectorBio,DirectorImage, DisplayOrder FROM mst_directordata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlCompany = ` SELECT CompanyID , CompanyName , CompanyImage, SmallDescription, DisplayOrder, CompanyNameURL , DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate FROM mst_companydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlCollaboration = ` SELECT CollaborationID , CollaborationName ,CollaborationNameURL , CollaborationImage,Description, DisplayOrder FROM mst_collaborationdata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC `;
  const sqlAward = ` SELECT AwardLogoID  , AwardLogoImage , DisplayOrder FROM mst_awarddata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC`;

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlMilestones, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlDirector, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlCompany, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlCollaboration, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
    new Promise((resolve, reject) => {
      db.query(sqlAward, (err, results) =>
        err ? reject(err) : resolve(results),
      );
    }),
  ])
    .then(
      ([
        Milestonedata,
        directorData,
        companyData,
        collaborationData,
        awardData,
      ]) => {
        res.json({
          Milestonedata,
          directorData,
          companyData,
          collaborationData,
          awardData,
        });
      },
    )
    .catch((err) => {
      console.error("SQL Error:", err);
      res.status(500).json({ error: err.message });
    });
};

exports.getClientPageData = (req, res) => {
  const sqlClientTypes = `
    SELECT ClientTypeID, TypeName, DisplayOrder
    FROM mst_clienttype
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;
  db.query(sqlClientTypes, (err, clientTypes) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (clientTypes.length === 0) {
      return res.json({ clientData: [] });
    }
    const logoPromises = clientTypes.map((type) => {
      return new Promise((resolve, reject) => {
        const sqlLogos = `
          SELECT p.PartnerLogoID, p.PartnerLogoImage, p.DisplayOrder
          FROM mst_clientlogomapping m
          INNER JOIN mst_partnerlogodata p ON m.PartnerLogoID = p.PartnerLogoID
          WHERE m.ClientTypeID = ? AND p.ActiveStatus = 1
          ORDER BY p.DisplayOrder ASC
        `;
        db.query(sqlLogos, [type.ClientTypeID], (err, logos) => {
          if (err) return reject(err);
          resolve({
            ClientTypeID: type.ClientTypeID,
            TypeName: type.TypeName,
            DisplayOrder: type.DisplayOrder,
            logos,
          });
        });
      });
    });
    Promise.all(logoPromises)
      .then((clientData) => {
        res.json({ clientData });
      })
      .catch((err) => {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
      });
  });
};

exports.getWhatsNewData = (req, res) => {
  const sql = `
    SELECT 
      WhatsNewID,
      WhatsNewName,
      WhatsNewNameURL,
      WhatsNewImage,
      Tagline,
      Description,
      DisplayOrder,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_whatsnewdata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ whatsNewData: results });
  });
};

exports.getTestimonialData = (req, res) => {
  const sql = `
    SELECT
      TestimonialID,
      TestimonialName,
      TestimonialNameURL,
      TestimonialImage,
      TestimonialDescription,
      DisplayOnHome,
      DisplayOrder,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_testimonialdata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ testimonialData: results });
  });
};

exports.getGalleryData = (req, res) => {
  const sqlGallery = `
    SELECT
      galleryID,
      galleryType,
      galleryTitle,
      galleryImage
    FROM mst_webgallerydatab
    WHERE activeStatus = 1
    AND (galleryVideoURL IS NULL OR galleryVideoURL = '')
    ORDER BY galleryID ASC
  `;

  db.query(sqlGallery, (err, galleries) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (galleries.length === 0) {
      return res.json({ galleryData: [] });
    }

    const photoPromises = galleries.map((gallery) => {
      return new Promise((resolve, reject) => {
        const sqlPhotos = `
          SELECT photoID, photoImage
          FROM mst_webgalleryphotos
          WHERE galleryID = ?
        `;
        db.query(sqlPhotos, [gallery.galleryID], (err, photos) => {
          if (err) return reject(err);
          resolve({
            ...gallery,
            photos,
          });
        });
      });
    });

    Promise.all(photoPromises)
      .then((galleryData) => {
        res.json({ galleryData });
      })
      .catch((err) => {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
      });
  });
};

exports.getVideoGalleryData = (req, res) => {
  const sql = `
    SELECT
      galleryID,
      galleryType,
      galleryTitle,
      galleryImage,
      galleryVideoURL
    FROM mst_webgallerydatab
    WHERE activeStatus = 1
    AND (galleryVideoURL IS NOT NULL AND galleryVideoURL != '')
    ORDER BY galleryID ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ videoGalleryData: results });
  });
};

exports.getCareerData = (req, res) => {
  const sql = `
    SELECT
      CareerID,
      CareerName,
      CareerDescription,
      Location,
      CareerType,
      DisplayOrder,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_careerdata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ careerData: results });
  });
};


exports.getSearchData = (req, res) => {
  const keyword = String(req.body.keyword || "").trim().toLowerCase();
  const searchValue = `${keyword}%`;
  const sqlClientType = `
    SELECT ClientTypeID, TypeName, TypeNameURL, 'clienttype' AS Type
    FROM mst_clienttype
    WHERE ActiveStatus = 1 AND LOWER(TypeName) LIKE ?
    ORDER BY TypeName ASC
  `;                                                        
  const sqlProducts = `
    SELECT ProductId, ProductName, ProductNameURL, 'product' AS Type
    FROM mst_products
    WHERE ActiveStatus = 1 AND LOWER(ProductName) LIKE ?
    ORDER BY ProductName ASC
  `;
  db.query(sqlClientType, [searchValue], (err, clientTypes) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(sqlProducts, [searchValue], (err, products) => {
      if (err) return res.status(500).json({ error: err.message });
      const combinedResults = [...clientTypes, ...products];
      res.json({ clientTypes, products, combinedResults });
    });
  });
};
