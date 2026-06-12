const db = require("../db");
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/PageImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error deleting old image:', err);
    }
  });
};

exports.getAllStatics = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY StaticID DESC) AS SerialNo,
           StaticID, StaticName, StaticNameURL, ActiveStatus,
           DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_staticdata ORDER BY StaticID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};


exports.getStaticById = (req, res) => {
  const StaticID = req.query.StaticID;
  if (!StaticID)
    return res.status(400).json({ success: false, message: "Missing Static ID" });
  const sql = "SELECT * FROM mst_staticdata WHERE StaticID = ? LIMIT 1";
  db.query(sql, [StaticID], (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "Internal server error" });
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "Static not found" });
    return res.json({ success: true, data: results[0] });
  });
};

exports.saveOrUpdateStatic = (req, res) => {
  const {
    StaticID,
    StaticName,
    StaticNameURL,
    SmallDescription,
    Description,
    ActiveStatus,
    StaticAddress,
    StaticAddress2,
    StaticPhoneNumber,
    StaticPhoneNumber2,
    StaticEmail,
    StaticTwitterLink,
    StaticFacebookLink,
    StaticInstagramLink,
    StaticLinkedInLink,
    StaticYouTubeLink,
    StaticWhatsAppLink,
    StaticPinterestLink,
    MetaTitle,
    MetaKeywords,
    MetaDescriptions,
    MetaSchema,
    UpdatedBy,
  } = req.body;
  const StaticImage = req.files?.StaticImage?.[0]?.filename || req.body.StaticImage || null;
  const StaticBannerVideo = req.files?.StaticBannerVideo?.[0]?.filename || req.body.StaticBannerVideo || null;
  const currentTime = new Date();
  const checkDuplicateSql = `
    SELECT StaticID FROM mst_staticdata 
    WHERE (StaticName = ? OR StaticNameURL = ?) 
    ${StaticID ? "AND StaticID != ?" : ""}
  `;
  const checkParams = StaticID
    ? [StaticName, StaticNameURL, StaticID]
    : [StaticName, StaticNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Static with the same name or URL already exists",
      });
    }
    if (StaticID) {
      const fetchImageSql = 'SELECT StaticImage, StaticBannerVideo FROM mst_staticdata WHERE StaticID = ?';
      db.query(fetchImageSql, [StaticID], (err, result) => {
        if (err || result.length === 0) {
          return res.status(400).json({ success: false, message: 'Invalid StaticID' });
        }
        const oldData = result[0];

        if (StaticImage && oldData.StaticImage && StaticImage !== oldData.StaticImage) {
          deleteOldImage(oldData.StaticImage);
        }
        if (StaticBannerVideo && oldData.StaticBannerVideo && StaticBannerVideo !== oldData.StaticBannerVideo) {
          deleteOldImage(oldData.StaticBannerVideo);
        }

        const updateSql = `
          UPDATE mst_staticdata SET
            StaticName = ?, StaticNameURL = ?,
            ${StaticImage ? "StaticImage = ?," : ""}
            ${StaticBannerVideo ? "StaticBannerVideo = ?," : ""}
            SmallDescription = ?, Description = ?, ActiveStatus = ?,
            StaticAddress = ?, StaticAddress2 = ?,
            StaticPhoneNumber = ?, StaticPhoneNumber2 = ?, StaticEmail = ?,
            StaticTwitterLink = ?, StaticFacebookLink = ?, StaticInstagramLink = ?,
            StaticLinkedInLink = ?, StaticYouTubeLink = ?, StaticWhatsAppLink = ?, StaticPinterestLink = ?,
            MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?,
            UpdatedBy = ?, UpdatedOn = ?
          WHERE StaticID = ?
        `;
        const updateParams = [
          StaticName, StaticNameURL,
          ...(StaticImage ? [StaticImage] : []),
          ...(StaticBannerVideo ? [StaticBannerVideo] : []),
          SmallDescription, Description, ActiveStatus,
          StaticAddress, StaticAddress2,
          StaticPhoneNumber, StaticPhoneNumber2, StaticEmail,
          StaticTwitterLink, StaticFacebookLink, StaticInstagramLink,
          StaticLinkedInLink, StaticYouTubeLink, StaticWhatsAppLink, StaticPinterestLink,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          UpdatedBy, currentTime,
          StaticID,
        ];

        db.query(updateSql, updateParams, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message || "Update failed" });
          }
          return res.json({ success: true, message: "Static updated successfully" });
        });
      });
    } else {
      const insertSql = `
        INSERT INTO mst_staticdata (
          StaticName, StaticNameURL, StaticImage, StaticBannerVideo,
          SmallDescription, Description, ActiveStatus,
          StaticAddress, StaticAddress2,
          StaticPhoneNumber, StaticPhoneNumber2, StaticEmail,
          StaticTwitterLink, StaticFacebookLink, StaticInstagramLink,
          StaticLinkedInLink, StaticYouTubeLink, StaticWhatsAppLink, StaticPinterestLink,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertParams = [
        StaticName, StaticNameURL, StaticImage, StaticBannerVideo,
        SmallDescription, Description, ActiveStatus,
        StaticAddress, StaticAddress2,
        StaticPhoneNumber, StaticPhoneNumber2, StaticEmail,
        StaticTwitterLink, StaticFacebookLink, StaticInstagramLink,
        StaticLinkedInLink, StaticYouTubeLink, StaticWhatsAppLink, StaticPinterestLink,
        MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
        currentTime, UpdatedBy, currentTime,
      ];

      db.query(insertSql, insertParams, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: err.sqlMessage || err.message || "Insert failed due to server error",
          });
        }
        return res.json({ success: true, message: "Static created successfully" });
      });
    }
  });
};

exports.deleteStatic = (req, res) => {
  const StaticID = req.params.StaticID;
  const fetchSql = "SELECT StaticImage, StaticBannerVideo FROM mst_staticdata WHERE StaticID = ?";

  db.query(fetchSql, [StaticID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Static not found" });

    const oldData = results[0];
    const sql = "DELETE FROM mst_staticdata WHERE StaticID = ?";

    db.query(sql, [StaticID], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });

      deleteOldImage(oldData.StaticImage);
      deleteOldImage(oldData.StaticBannerVideo);

      res.json({ success: true, message: "Static deleted successfully" });
    });
  });
};

exports.getMataDataById = (req, res) => {
  const StaticID = req.params.ID;
  if (!StaticID)
    return res.status(400).json({ success: false, message: "Missing Static ID" });

  const sql = "SELECT * FROM mst_staticdata WHERE StaticID = ? LIMIT 1";
  db.query(sql, [StaticID], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    if (!results || results.length === 0)
      return res.status(404).json({ success: false, message: "Static not found" });
    return res.json({ success: true, data: results[0] });
  });
};


exports.getMataDataByUrl = async (req, res) => {
  const url = req.params.url;
  if (!url) {
    return res.status(400).json({ success: false, message: "Missing URL parameter" });
  }
  const queryOne = (sql, params) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results?.[0] ?? null)));
    });
  const queries = [
    {
      sql: "SELECT StaticID, MetaTitle, MetaDescriptions, MetaKeywords, MetaSchema, 'static' AS type FROM mst_staticdata WHERE StaticNameURL = ? AND ActiveStatus = 1 LIMIT 1",
      type: "static",
    },
    {
      sql: "SELECT ProductId AS StaticID, MetaTitle, MetaDescriptions, MetaKeywords, MetaSchema, 'product' AS type FROM mst_products WHERE ProductNameURL = ? AND ActiveStatus = 1 LIMIT 1",
      type: "product",
    },
    {
      sql: "SELECT CompanyID AS StaticID, MetaTitle, MetaDescriptions, MetaKeywords, MetaSchema, 'company' AS type FROM mst_companydata WHERE CompanyNameURL = ? AND ActiveStatus = 1 LIMIT 1",
      type: "company",
    },
    {
      sql: "SELECT CategoryID AS StaticID, MetaTitle, MetaDescriptions, MetaKeywords, MetaSchema, 'facility' AS type FROM mst_facilitycategory WHERE CategoryNameURL = ? AND ActiveStatus = 1 LIMIT 1",
      type: "facility",
    },
    {
      sql: "SELECT ClientTypeID AS StaticID, MetaTitle, MetaDescriptions, MetaKeywords, MetaSchema, 'clienttype' AS type FROM mst_clienttype WHERE TypeNameURL = ? AND ActiveStatus = 1 LIMIT 1",
      type: "clienttype",
    },
  ];
  try {
    for (const { sql, type } of queries) {
      const result = await queryOne(sql, [url]);
      if (result) return res.json({ success: true, data: result });
    }
    return res.status(404).json({ success: false, message: "Meta data not found" });
  } catch (err) {
    console.error("Meta fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};