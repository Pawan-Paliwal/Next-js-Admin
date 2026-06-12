const db = require("../db");

// GET all Statics
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

// GET Static by ID
exports.getStaticById = (req, res) => {
  const StaticID = req.query.StaticID;
  if (!StaticID)
    return res
      .status(400)
      .json({ success: false, message: "Missing Static ID" });

  const sql = "SELECT * FROM mst_staticdata WHERE StaticID = ? LIMIT 1";
  db.query(sql, [StaticID], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    if (results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Static not found" });
    return res.json({ success: true, data: results[0] });
  });
};

// CREATE or UPDATE Static
exports.saveOrUpdateStatic = (req, res) => {
  const {
    StaticID,
    StaticName,
    StaticNameURL,
    ActiveStatus,
    Address,
    Email,
    PhoneNumber,
    MapDirection,
    IframeLink,
    LinkedIn,
    Twitter,
    Instagram,
    Facebook,
    NoOfPartners,
    HowManyCities,
    ActiveCollaboration,
    StrategicAlliances,
    MetaTitle,
    MetaKeywords,
    MetaDescriptions,
    MetaSchema,
    UpdatedBy,
  } = req.body;

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
      const updateSql = `
        UPDATE mst_staticdata SET 
          StaticName = ?, StaticNameURL = ?, ActiveStatus = ?,
          Address = ?, Email = ?, PhoneNumber = ?, MapDirection = ?, IframeLink = ?,
          LinkedIn = ?, Twitter = ?, Instagram = ?, Facebook = ?,
          NoOfPartners = ?, HowManyCities = ?, ActiveCollaboration = ?, StrategicAlliances = ?,
          MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?, 
          UpdatedBy = ?, UpdatedOn = ? 
        WHERE StaticID = ?
      `;

      db.query(
        updateSql,
        [
          StaticName,
          StaticNameURL,
          ActiveStatus,
          Address,
          Email,
          PhoneNumber,
          MapDirection,
          IframeLink,
          LinkedIn,
          Twitter,
          Instagram,
          Facebook,
          NoOfPartners,
          HowManyCities,
          ActiveCollaboration,
          StrategicAlliances,
          MetaTitle,
          MetaKeywords,
          MetaDescriptions,
          MetaSchema,
          UpdatedBy,
          currentTime,
          StaticID,
        ],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: err.message || "Update failed",
            });
          }

          return res.json({
            success: true,
            message: "Static updated successfully",
          });
        }
      );
    } else {
      const insertSql = `
        INSERT INTO mst_staticdata (
          StaticName, StaticNameURL, ActiveStatus,
          Address, Email, PhoneNumber, MapDirection, IframeLink,
          LinkedIn, Twitter, Instagram, Facebook,
          NoOfPartners, HowManyCities, ActiveCollaboration, StrategicAlliances,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          StaticName,
          StaticNameURL,
          ActiveStatus,
          Address,
          Email,
          PhoneNumber,
          MapDirection,
          IframeLink,
          LinkedIn,
          Twitter,
          Instagram,
          Facebook,
          NoOfPartners,
          HowManyCities,
          ActiveCollaboration,
          StrategicAlliances,
          MetaTitle,
          MetaKeywords,
          MetaDescriptions,
          MetaSchema,
          currentTime,
          UpdatedBy,
          currentTime,
        ],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: err.sqlMessage || err.message || "Insert failed due to server error"
            });
          }
          return res.json({
            success: true,
            message: "Static created successfully"
          });
        }
      );
    }
  });
};

// DELETE Static
exports.deleteStatic = (req, res) => {
  const StaticID = req.params.StaticID;
  const sql = "DELETE FROM mst_staticdata WHERE StaticID = ?";

  db.query(sql, [StaticID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Static not found" });
    }
    res.json({ success: true, message: "Static deleted successfully" });
  });
};

/**********************Front End API*********************/
// Select Meta Data
exports.getMataDataById = (req, res) => {
  const StaticID = req.params.ID;
  if (!StaticID)
    return res
      .status(400)
      .json({ success: false, message: "Missing Static ID" });

  const sql = "SELECT * FROM mst_staticdata WHERE StaticID = ? LIMIT 1";
  db.query(sql, [StaticID], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    if (!results || results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Static not found" });
    return res.json({ success: true, data: results[0] });
  });
};

// Select Meta Data
exports.getMataDataByUrl = (req, res) => {
  const url = req.params.url;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "Missing product url",
    });
  }

  const sqlProduct = `
    SELECT 
      ProductID as StaticID,
      MetaTitle,
      MetaDescriptions,
      MetaKeywords,
      'product' AS type
    FROM mst_productdata
    WHERE ProductNameURL = ?
    LIMIT 1
  `;

  const sqlCaseStudy = `
    SELECT 
      CaseStudyId as StaticID,
      MetaTitle,
      MetaDescriptions,
      MetaKeywords,
      'casestudy' AS type
    FROM mst_casestudydata
    WHERE CaseStudyNameURL = ? AND ActiveStatus = 1
    LIMIT 1
  `;

  // First: Try Product
  db.query(sqlProduct, [url], (err, productResults) => {
    if (err) {
      console.error("Product meta fetch error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    if (productResults?.length > 0) {
      return res.json({ success: true, data: productResults[0] });
    }

    // Second: Try Case Study
    db.query(sqlCaseStudy, [url], (err, caseStudyResults) => {
      if (err) {
        console.error("CaseStudy meta fetch error:", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      if (caseStudyResults?.length > 0) {
        return res.json({ success: true, data: caseStudyResults[0] });
      }

      // Not found anywhere
      return res.status(404).json({
        success: false,
        message: "Meta data not found",
      });
    });
  });
};

