const db = require("../db");
const fs = require("fs");
const path = require("path");

// GET all case studies with products
exports.getAllCaseStudies = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY cs.CaseStudyId DESC) AS SerialNo,
      cs.CaseStudyId,
      cs.CaseStudyName,
      cs.CaseStudyNameURL,
      cs.CaseStudyDescription,
      cs.CaseStudyImage,
      cs.ActiveStatus,
      cs.DisplayOrder,
      DATE_FORMAT(cs.CreatedAt, '%d %b %Y') AS CreatedAt,
      GROUP_CONCAT(csp.ProductId) AS ProductIDs,
      GROUP_CONCAT(p.ProductName) AS ProductNames
    FROM mst_casestudydata cs
    LEFT JOIN mst_casestudy_products csp ON cs.CaseStudyId = csp.CaseStudyId
    LEFT JOIN mst_productdata p ON csp.ProductId = p.ProductId
    GROUP BY cs.CaseStudyId
    ORDER BY cs.DisplayOrder ASC, cs.CaseStudyId DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching case studies:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const parsedResults = results.map((row) => {
      const ids = row.ProductIDs ? row.ProductIDs.split(",") : [];
      const names = row.ProductNames ? row.ProductNames.split(",") : [];

      const CaseStudyProducts = ids.map((id, index) => ({
        ProductId: parseInt(id),
        ProductName: names[index] || null,
      }));

      return {
        ...row,
        CaseStudyProducts,
        ProductIDs: undefined,
        ProductNames: undefined,
      };
    });

    res.json(parsedResults);
  });
};

// GET case study by ID with products
exports.getCaseStudyById = (req, res) => {
  const CaseStudyId = req.query.CaseStudyId;
  if (!CaseStudyId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing CaseStudy ID" });
  }

  const caseStudySql = "SELECT * FROM mst_casestudydata WHERE CaseStudyId = ? LIMIT 1";
  const productSql = "SELECT ProductId FROM mst_casestudy_products WHERE CaseStudyId = ?";

  db.query(caseStudySql, [CaseStudyId], (err, caseStudyResults) => {
    if (err) {
      console.error("Error fetching case study:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    if (caseStudyResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Case study not found" });
    }

    db.query(productSql, [CaseStudyId], (err, productResults) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const caseStudy = caseStudyResults[0];
      caseStudy.CaseStudyProducts = productResults.map((row) => row.ProductId);
      return res.status(200).json({ success: true, data: caseStudy });
    });
  });
};

// GET case studies by Product ID
exports.getCaseStudiesByProductId = (req, res) => {
  const ProductId = req.query.ProductId;
  if (!ProductId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Product ID" });
  }

  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY cs.CaseStudyId DESC) AS SerialNo,
      cs.CaseStudyId,
      cs.CaseStudyName,
      cs.CaseStudyNameURL,
      cs.CaseStudyDescription,
      cs.CaseStudyImage,
      cs.ActiveStatus,
      cs.DisplayOrder,
      DATE_FORMAT(cs.CreatedAt, '%d %b %Y') AS CreatedAt
    FROM mst_casestudydata cs
    INNER JOIN mst_casestudy_products csp ON cs.CaseStudyId = csp.CaseStudyId
    WHERE csp.ProductId = ? AND cs.ActiveStatus = 1
    ORDER BY cs.DisplayOrder ASC, cs.CaseStudyId DESC
  `;

  db.query(sql, [ProductId], (err, results) => {
    if (err) {
      console.error("Error fetching case studies:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, data: results });
  });
};

// GET case study by slug (for frontend)
exports.getCaseStudyBySlug = (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res.status(400).json({ success: false, message: "Missing slug" });
  }

  const sql = `
    SELECT cs.*,
      GROUP_CONCAT(csp.ProductId) AS ProductIDs,
      GROUP_CONCAT(p.ProductName) AS ProductNames,
      GROUP_CONCAT(p.ProductNameURL) AS ProductURLs
    FROM mst_casestudydata cs
    LEFT JOIN mst_casestudy_products csp ON cs.CaseStudyId = csp.CaseStudyId
    LEFT JOIN mst_productdata p ON csp.ProductId = p.ProductId
    WHERE cs.CaseStudyNameURL = ? AND cs.ActiveStatus = 1
    GROUP BY cs.CaseStudyId
    LIMIT 1
  `;

  db.query(sql, [slug], (err, results) => {
    if (err) {
      console.error("Error fetching case study:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Case study not found" });
    }

    const caseStudy = results[0];
    const ids = caseStudy.ProductIDs ? caseStudy.ProductIDs.split(",") : [];
    const names = caseStudy.ProductNames ? caseStudy.ProductNames.split(",") : [];
    const urls = caseStudy.ProductURLs ? caseStudy.ProductURLs.split(",") : [];

    caseStudy.CaseStudyProducts = ids.map((id, index) => ({
      ProductId: parseInt(id),
      ProductName: names[index] || null,
      ProductURL: urls[index] || null,
    }));

    delete caseStudy.ProductIDs;
    delete caseStudy.ProductNames;
    delete caseStudy.ProductURLs;

    res.json({ success: true, data: caseStudy });
  });
};

// SAVE or UPDATE case study with products
exports.saveOrUpdateCaseStudy = (req, res) => {
  const {
    CaseStudyId,
    CaseStudyProducts,
    CaseStudyName,
    CaseStudyNameURL,
    CaseStudyDescription,
    ButtonText,
    Box1Title,
    Box1Description,
    Box2Title,
    Box2Description,
    Box3Title,
    Box3Description,
    Section1Title,
    Section1Subtitle,
    Section1Description,
    Section1ButtonText,
    Section2Title,
    Section2Subtitle,
    Section2Description,
    Section3Title,
    Section3Subtitle,
    Section3Description,
    Section4Title,
    Section4Subtitle,
    Section4Description,
    ActiveStatus,
    DisplayOrder,
    MetaTitle,
    MetaKeywords,
    MetaDescriptions,
    MetaSchema,
  } = req.body;

  const currentTime = new Date();

  // Get file names from uploads
  const CaseStudyImage = req.files?.CaseStudyImage?.[0]?.filename || null;
  const Box1Media = req.files?.Box1Media?.[0]?.filename || null;
  const Box2Media = req.files?.Box2Media?.[0]?.filename || null;
  const Box3Media = req.files?.Box3Media?.[0]?.filename || null;
  const Section1MediaUrl = req.files?.Section1MediaUrl?.[0]?.filename || null;
  const Section2MediaUrl = req.files?.Section2MediaUrl?.[0]?.filename || null;
  const Section3MediaUrl = req.files?.Section3MediaUrl?.[0]?.filename || null;
  const Section4MediaUrl = req.files?.Section4MediaUrl?.[0]?.filename || null;

  // Parse products
  let products = [];
  try {
    products = JSON.parse(CaseStudyProducts || "[]");
  } catch (e) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product format" });
  }

  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "At least one product is required" });
  }

  // Validations
  if (!CaseStudyName || !CaseStudyName.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Case Study name is required" });
  }

  if (!CaseStudyNameURL || !CaseStudyNameURL.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Case Study URL is required" });
  }

  // Check for duplicate name/URL
  const checkDuplicateSql = `
    SELECT CaseStudyId FROM mst_casestudydata 
    WHERE (CaseStudyName = ? OR CaseStudyNameURL = ?) 
    ${CaseStudyId ? "AND CaseStudyId != ?" : ""}
  `;
  const checkParams = CaseStudyId
    ? [CaseStudyName, CaseStudyNameURL, CaseStudyId]
    : [CaseStudyName, CaseStudyNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Case Study with the same name or URL already exists",
      });
    }

    if (CaseStudyId) {
      // UPDATE existing case study
      const getOldSql = `
        SELECT CaseStudyImage, Box1Media, Box2Media, Box3Media, 
               Section1MediaUrl, Section2MediaUrl, Section3MediaUrl, Section4MediaUrl 
        FROM mst_casestudydata WHERE CaseStudyId = ?
      `;

      db.query(getOldSql, [CaseStudyId], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid CaseStudyId" });
        }

        const old = oldResults[0];
        const finalCaseStudyImage = CaseStudyImage || old.CaseStudyImage;
        const finalBox1Media = Box1Media || old.Box1Media;
        const finalBox2Media = Box2Media || old.Box2Media;
        const finalBox3Media = Box3Media || old.Box3Media;
        const finalSection1Media = Section1MediaUrl || old.Section1MediaUrl;
        const finalSection2Media = Section2MediaUrl || old.Section2MediaUrl;
        const finalSection3Media = Section3MediaUrl || old.Section3MediaUrl;
        const finalSection4Media = Section4MediaUrl || old.Section4MediaUrl;

        // Delete old files if new ones are uploaded
        const deleteOldFile = (oldFile, newFile) => {
          if (newFile && oldFile) {
            const filePath = path.join(
              __dirname,
              "../uploads/OnlineImages/CasestudiesImages",
              oldFile
            );
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error(e);
              }
            }
          }
        };

        deleteOldFile(old.CaseStudyImage, CaseStudyImage);
        deleteOldFile(old.Box1Media, Box1Media);
        deleteOldFile(old.Box2Media, Box2Media);
        deleteOldFile(old.Box3Media, Box3Media);
        deleteOldFile(old.Section1MediaUrl, Section1MediaUrl);
        deleteOldFile(old.Section2MediaUrl, Section2MediaUrl);
        deleteOldFile(old.Section3MediaUrl, Section3MediaUrl);
        deleteOldFile(old.Section4MediaUrl, Section4MediaUrl);

        const updateSql = `
          UPDATE mst_casestudydata SET 
            CaseStudyName = ?, CaseStudyNameURL = ?,
            CaseStudyDescription = ?, CaseStudyImage = ?, ButtonText = ?,
            Box1Title = ?, Box1Description = ?, Box1Media = ?,
            Box2Title = ?, Box2Description = ?, Box2Media = ?,
            Box3Title = ?, Box3Description = ?, Box3Media = ?,
            Section1Title = ?, Section1Subtitle = ?, Section1Description = ?, 
            Section1ButtonText = ?, Section1MediaUrl = ?,
            Section2Title = ?, Section2Subtitle = ?, Section2Description = ?, Section2MediaUrl = ?,
            Section3Title = ?, Section3Subtitle = ?, Section3Description = ?, Section3MediaUrl = ?,
            Section4Title = ?, Section4Subtitle = ?, Section4Description = ?, Section4MediaUrl = ?,
            ActiveStatus = ?, DisplayOrder = ?,
            MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?,
            UpdatedAt = ?
          WHERE CaseStudyId = ?
        `;

        db.query(
          updateSql,
          [
            CaseStudyName,
            CaseStudyNameURL,
            CaseStudyDescription || null,
            finalCaseStudyImage,
            ButtonText || null,
            Box1Title || null,
            Box1Description || null,
            finalBox1Media,
            Box2Title || null,
            Box2Description || null,
            finalBox2Media,
            Box3Title || null,
            Box3Description || null,
            finalBox3Media,
            Section1Title || null,
            Section1Subtitle || null,
            Section1Description || null,
            Section1ButtonText || null,
            finalSection1Media,
            Section2Title || null,
            Section2Subtitle || null,
            Section2Description || null,
            finalSection2Media,
            Section3Title || null,
            Section3Subtitle || null,
            Section3Description || null,
            finalSection3Media,
            Section4Title || null,
            Section4Subtitle || null,
            Section4Description || null,
            finalSection4Media,
            ActiveStatus || 0,
            DisplayOrder || 0,
            MetaTitle || null,
            MetaKeywords || null,
            MetaDescriptions || null,
            MetaSchema || null,
            currentTime,
            CaseStudyId,
          ],
          (err) => {
            if (err) {
              console.error("Update error:", err);
              return res
                .status(500)
                .json({ success: false, message: "Update failed" });
            }

            updateCaseStudyProducts(CaseStudyId, products, (prodErr) => {
              if (prodErr) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to update products",
                });
              }
              return res.json({
                success: true,
                message: "Case Study updated successfully",
              });
            });
          }
        );
      });
    } else {
      const insertSql = `
        INSERT INTO mst_casestudydata (
          CaseStudyName, CaseStudyNameURL,
          CaseStudyDescription, CaseStudyImage, ButtonText,
          Box1Title, Box1Description, Box1Media,
          Box2Title, Box2Description, Box2Media,
          Box3Title, Box3Description, Box3Media,
          Section1Title, Section1Subtitle, Section1Description, Section1ButtonText, Section1MediaUrl,
          Section2Title, Section2Subtitle, Section2Description, Section2MediaUrl,
          Section3Title, Section3Subtitle, Section3Description, Section3MediaUrl,
          Section4Title, Section4Subtitle, Section4Description, Section4MediaUrl,
          ActiveStatus, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          CreatedAt, UpdatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;
      db.query(
        insertSql,
        [
          CaseStudyName,
          CaseStudyNameURL,
          CaseStudyDescription || null,
          CaseStudyImage,
          ButtonText || null,
          Box1Title || null,
          Box1Description || null,
          Box1Media,
          Box2Title || null,
          Box2Description || null,
          Box2Media,
          Box3Title || null,
          Box3Description || null,
          Box3Media,
          Section1Title || null,
          Section1Subtitle || null,
          Section1Description || null,
          Section1ButtonText || null,
          Section1MediaUrl,
          Section2Title || null,
          Section2Subtitle || null,
          Section2Description || null,
          Section2MediaUrl,
          Section3Title || null,
          Section3Subtitle || null,
          Section3Description || null,
          Section3MediaUrl,
          Section4Title || null,
          Section4Subtitle || null,
          Section4Description || null,
          Section4MediaUrl,
          ActiveStatus || 0,
          DisplayOrder || 0,
          MetaTitle || null,
          MetaKeywords || null,
          MetaDescriptions || null,
          MetaSchema || null,
          currentTime,
          currentTime,
        ],
        (err, result) => {
          if (err) {
            console.error("Insert error:", err);
            return res
              .status(500)
              .json({ success: false, message: err.sqlMessage || err.message });
          }
          const newCaseStudyId = result.insertId;
          updateCaseStudyProducts(newCaseStudyId, products, (prodErr) => {
            if (prodErr) {
              return res.status(500).json({
                success: false,
                message: "Case Study created but failed to assign products",
              });
            }
            return res.json({
              success: true,
              message: "Case Study created successfully",
              CaseStudyId: newCaseStudyId,
            });
          });
        }
      );
    }
  });
};

function updateCaseStudyProducts(caseStudyId, products, callback) {
  const deleteSql = "DELETE FROM mst_casestudy_products WHERE CaseStudyId = ?";
  db.query(deleteSql, [caseStudyId], (err) => {
    if (err) return callback(err);
    if (products.length === 0) {
      return callback(null);
    }
    const insertSql =
      "INSERT INTO mst_casestudy_products (CaseStudyId, ProductId) VALUES ?";
    const values = products.map((prodId) => [caseStudyId, prodId]);
    db.query(insertSql, [values], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  });
}

// DELETE case study
exports.deleteCaseStudy = (req, res) => {
  const CaseStudyId = req.params.CaseStudyId;
  const getMediaSql = `
    SELECT CaseStudyImage, Box1Media, Box2Media, Box3Media,
           Section1MediaUrl, Section2MediaUrl, Section3MediaUrl, Section4MediaUrl 
    FROM mst_casestudydata WHERE CaseStudyId = ?
  `;
  db.query(getMediaSql, [CaseStudyId], (err, mediaResults) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });

    const sql = "DELETE FROM mst_casestudydata WHERE CaseStudyId = ?";
    db.query(sql, [CaseStudyId], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Case Study not found" });
      }
      if (mediaResults.length > 0) {
        const media = mediaResults[0];
        Object.values(media).forEach((filename) => {
          if (filename) {
            const filePath = path.join(
              __dirname,
              "../uploads/OnlineImages/CasestudiesImages",
              filename
            );
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error(e);
              }
            }
          }
        });
      }

      res.json({ success: true, message: "Case Study deleted successfully" });
    });
  });
};


// UPDATE active status
exports.updateActiveStatus = (req, res) => {
  const { CaseStudyId, ActiveStatus } = req.body;
  if (!CaseStudyId || ActiveStatus === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing ID or ActiveStatus" });
  }
  const sql = `UPDATE mst_casestudydata SET ActiveStatus = ?, UpdatedAt = NOW() WHERE CaseStudyId = ?`;
  db.query(sql, [ActiveStatus, CaseStudyId], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Status updated successfully" });
  });
};