const db = require("../db");
const fs = require("fs");
const path = require("path");

// GET all products
exports.getAllProducts = (req, res) => {
  const sql = ` 
    SELECT 
      ROW_NUMBER() OVER (ORDER BY p.ProductId DESC) AS SerialNo, 
      p.ProductId, 
      p.ProductName,
      p.ProductType,
      p.ProductMedia,
      p.Section1MediaUrl, 
      p.DisplayOrder, 
      p.ActiveStatus, 
      DATE_FORMAT(p.CreatedAt, '%d %b %Y') AS CreatedAt,
      GROUP_CONCAT(pc.CategoryID) AS CategoryIDs,
      GROUP_CONCAT(c.CategoryName) AS CategoryNames,
      GROUP_CONCAT(pc.CategoryTagline) AS CategoryTaglines,
      GROUP_CONCAT(pc.DisplayOrder) AS CategoryDisplayOrders
    FROM mst_productdata p
    LEFT JOIN mst_product_categories pc ON p.ProductId = pc.ProductId
    LEFT JOIN mst_categorydata c ON pc.CategoryID = c.CategoryID
    GROUP BY p.ProductId
    ORDER BY p.ProductId DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const parsedResults = results.map((row) => {
      const ids = row.CategoryIDs ? row.CategoryIDs.split(",") : [];
      const names = row.CategoryNames ? row.CategoryNames.split(",") : [];
      const taglines = row.CategoryTaglines ? row.CategoryTaglines.split(",") : [];
      const displayOrders = row.CategoryDisplayOrders ? row.CategoryDisplayOrders.split(",") : [];

      const ProductCategories = ids.map((id, index) => ({
        CategoryID: parseInt(id),
        CategoryName: names[index] || null,
        CategoryTagline: taglines[index] || null,
        DisplayOrder: parseInt(displayOrders[index]) || 0
      }));

      return {
        ...row,
        ProductCategories,
        CategoryIDs: undefined,
        CategoryNames: undefined,
        CategoryTaglines: undefined,
        CategoryDisplayOrders: undefined
      };
    });

    res.json(parsedResults);
  });
};

// Update getProductById to include DisplayOrder
exports.getProductById = (req, res) => {
  const ProductId = req.query.ProductId;
  if (!ProductId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Product ID" });
  }

  const productSql = "SELECT * FROM mst_productdata WHERE ProductId = ? LIMIT 1";
  const categorySql = `
    SELECT pc.CategoryID, pc.CategoryTagline, pc.DisplayOrder, c.CategoryName 
    FROM mst_product_categories pc
    LEFT JOIN mst_categorydata c ON pc.CategoryID = c.CategoryID
    WHERE pc.ProductId = ?
    ORDER BY pc.DisplayOrder ASC
  `;

  db.query(productSql, [ProductId], (err, productResults) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    if (productResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    db.query(categorySql, [ProductId], (err, categoryResults) => {
      if (err) {
        console.error("Error fetching categories:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const product = productResults[0];
      product.ProductCategories = categoryResults.map((row) => row.CategoryID);
      product.ProductCategoriesWithTaglines = categoryResults.map((row) => ({
        CategoryID: row.CategoryID,
        CategoryName: row.CategoryName,
        CategoryTagline: row.CategoryTagline || '',
        DisplayOrder: row.DisplayOrder || 0
      }));

      return res.status(200).json({ success: true, data: product });
    });
  });
};



exports.saveOrUpdateProduct = (req, res) => {
  const {
    ProductId,
    ProductType,
    ProductName,
    ProductNameURL,
    ProductHeaderListName,
    ProductSmallDescription,
    ProductListDescription,
    ProductCategory,
    Section1Title,
    Section1Subtitle,
    Section1Description,
    Section1ButtonText,
    Section2Title,
    Section2Subtitle,
    Section2Description,
    Section2ButtonText,
    Section3Title,
    Section3Subtitle,
    Section3Description,
    Section3ButtonText,
    Section4Title,
    Section4Subtitle,
    Section4Description,
    Section4ButtonText,
    Section5Title,
    Section5Subtitle,
    Section5ButtonText,
    Section6Title,
    Section6Subtitle,
    Section6Description,
    Section6FormHeading,
    ActiveStatus,
    DisplayOnHome,
    DisplayOnHeader,
    DisplayOnFooter,
    ComingSoon,
    DisplayOrder,
    MetaTitle,
    MetaKeywords,
    MetaDescriptions,
    MetaSchema,
  } = req.body;

  const currentTime = new Date();
  const ProductMedia = req.files?.ProductMedia?.[0]?.filename || null;
  const Section1MediaUrl = req.files?.Section1MediaUrl?.[0]?.filename || null;
  const Section2MediaUrl = req.files?.Section2MediaUrl?.[0]?.filename || null;
  const Section3MediaUrl = req.files?.Section3MediaUrl?.[0]?.filename || null;
  const Section4MediaUrl = req.files?.Section4MediaUrl?.[0]?.filename || null;

  let categories = [];
  try {
    categories = JSON.parse(ProductCategory || "[]");
  } catch {
    return res.status(400).json({ success: false, message: "Invalid category format" });
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ success: false, message: "At least one category is required" });
  }

  // Validate that each category has CategoryID (and optionally DisplayOrder)
  const validCategories = categories.every(cat => cat.CategoryID);
  if (!validCategories) {
    return res.status(400).json({ success: false, message: "Invalid category data format" });
  }

  if (!ProductType) {
    return res.status(400).json({ success: false, message: "Product type is required" });
  }

  const checkDuplicateSql = `
    SELECT ProductId FROM mst_productdata 
    WHERE (ProductName = ? OR ProductNameURL = ?) 
    ${ProductId ? "AND ProductId != ?" : ""}
  `;
  const checkParams = ProductId
    ? [ProductName, ProductNameURL, ProductId]
    : [ProductName, ProductNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Product with the same name or URL already exists" });
    }

    if (ProductId) {
      // UPDATE existing product
      const getOldSql = `SELECT ProductMedia, Section1MediaUrl, Section2MediaUrl, Section3MediaUrl, Section4MediaUrl FROM mst_productdata WHERE ProductId = ?`;
      db.query(getOldSql, [ProductId], (err, oldResults) => {
        if (err || oldResults.length === 0) {
          return res.status(400).json({ success: false, message: "Invalid ProductId" });
        }
        const old = oldResults[0];
        const updateSql = `
          UPDATE mst_productdata SET 
            ProductType=?, ProductName=?, ProductNameURL=?, ProductHeaderListName=?,
            ProductSmallDescription=?, ProductListDescription=?, ProductMedia=?,
            Section1Title=?, Section1Subtitle=?, Section1Description=?, Section1MediaUrl=?, Section1ButtonText=?,
            Section2Title=?, Section2Subtitle=?, Section2Description=?, Section2MediaUrl=?, Section2ButtonText=?,
            Section3Title=?, Section3Subtitle=?, Section3Description=?, Section3MediaUrl=?, Section3ButtonText=?,
            Section4Title=?, Section4Subtitle=?, Section4Description=?, Section4MediaUrl=?, Section4ButtonText=?,
            Section5Title=?, Section5Subtitle=?, Section5ButtonText=?,
            Section6Title=?, Section6Subtitle=?, Section6Description=?, Section6FormHeading=?,
            ActiveStatus=?, DisplayOnHome=?, DisplayOnHeader=?, DisplayOnFooter=?, ComingSoon=?, DisplayOrder=?,
            MetaTitle=?, MetaKeywords=?, MetaDescriptions=?, MetaSchema=?, UpdatedAt=?
          WHERE ProductId=?
        `;
        db.query(updateSql, [
          ProductType, ProductName, ProductNameURL, ProductHeaderListName, ProductSmallDescription, ProductListDescription, ProductMedia || old.ProductMedia,
          Section1Title, Section1Subtitle, Section1Description, Section1MediaUrl || old.Section1MediaUrl, Section1ButtonText,
          Section2Title, Section2Subtitle, Section2Description, Section2MediaUrl || old.Section2MediaUrl, Section2ButtonText,
          Section3Title, Section3Subtitle, Section3Description, Section3MediaUrl || old.Section3MediaUrl, Section3ButtonText,
          Section4Title, Section4Subtitle, Section4Description, Section4MediaUrl || old.Section4MediaUrl, Section4ButtonText,
          Section5Title, Section5Subtitle, Section5ButtonText,
          Section6Title, Section6Subtitle, Section6Description, Section6FormHeading,
          ActiveStatus, DisplayOnHome, DisplayOnHeader, DisplayOnFooter, ComingSoon, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema, currentTime, ProductId
        ], (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          updateProductCategories(ProductId, categories, (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: "Product updated successfully" });
          });
        });
      });
    } else {
      // INSERT new product
      const insertSql = `
        INSERT INTO mst_productdata (
          ProductType, ProductName, ProductNameURL,ProductHeaderListName, ProductSmallDescription, ProductListDescription, ProductMedia,
          Section1Title, Section1Subtitle, Section1Description, Section1MediaUrl, Section1ButtonText,
          Section2Title, Section2Subtitle, Section2Description, Section2MediaUrl, Section2ButtonText,
          Section3Title, Section3Subtitle, Section3Description, Section3MediaUrl, Section3ButtonText,
          Section4Title, Section4Subtitle, Section4Description, Section4MediaUrl, Section4ButtonText,
          Section5Title, Section5Subtitle, Section5ButtonText,
          Section6Title, Section6Subtitle, Section6Description, Section6FormHeading,
          ActiveStatus, DisplayOnHome, DisplayOnHeader, DisplayOnFooter, ComingSoon, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          CreatedAt, UpdatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        ProductType, ProductName, ProductNameURL, ProductSmallDescription, ProductListDescription, ProductMedia,
        Section1Title, Section1Subtitle, Section1Description, Section1MediaUrl, Section1ButtonText,
        Section2Title, Section2Subtitle, Section2Description, Section2MediaUrl, Section2ButtonText,
        Section3Title, Section3Subtitle, Section3Description, Section3MediaUrl, Section3ButtonText,
        Section4Title, Section4Subtitle, Section4Description, Section4MediaUrl, Section4ButtonText,
        Section5Title, Section5Subtitle, Section5ButtonText,
        Section6Title, Section6Subtitle, Section6Description, Section6FormHeading,
        ActiveStatus, DisplayOnHome, DisplayOnHeader, DisplayOnFooter, ComingSoon, DisplayOrder,
        MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
        currentTime, currentTime
      ], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        updateProductCategories(result.insertId, categories, (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: "Product created successfully", ProductId: result.insertId });
        });
      });
    }
  });
};

// Helper function to update product categories with DisplayOrder
function updateProductCategories(productId, categories, callback) {
  const deleteSql = "DELETE FROM mst_product_categories WHERE ProductId = ?";

  db.query(deleteSql, [productId], (err) => {
    if (err) return callback(err);

    if (categories.length === 0) {
      return callback(null);
    }

    const insertSql = `
      INSERT INTO mst_product_categories 
      (ProductId, CategoryID, CategoryTagline, DisplayOrder, CreatedAt) 
      VALUES ?
    `;

    const currentTime = new Date();
    const values = categories.map((cat) => [
      productId,
      cat.CategoryID,
      cat.CategoryTagline || null,
      cat.DisplayOrder || 0,
      currentTime
    ]);

    db.query(insertSql, [values], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  });
}



exports.deleteProduct = (req, res) => {
  const ProductId = req.params.ProductId;
  const getMediaSql = `SELECT ProductMedia, Section1MediaUrl, Section2MediaUrl, Section3MediaUrl, Section4MediaUrl FROM mst_productdata WHERE ProductId = ?`;
  const getItemsSql = `SELECT ItemIconUrl FROM mst_sectionitems WHERE ProductId = ?`;
  db.query(getMediaSql, [ProductId], (err, productMedia) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    db.query(getItemsSql, [ProductId], (err, itemMedia) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      const sql = "DELETE FROM mst_productdata WHERE ProductId = ?";
      db.query(sql, [ProductId], (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        if (productMedia.length > 0) {
          const media = productMedia[0];
          Object.values(media).forEach((filename) => {
            if (filename) {
              const filePath = path.join(
                __dirname,
                "../uploads/OnlineImages/ProductImages",
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
        itemMedia.forEach((item) => {
          if (item.ItemIconUrl) {
            const filePath = path.join(
              __dirname,
              "../uploads/OnlineImages/ProductImages",
              item.ItemIconUrl
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
        res.json({ success: true, message: "Product deleted successfully" });
      });
    });
  });
};

exports.updateActiveStatus = (req, res) => {
  const { ProductId, ActiveStatus } = req.body;
  if (!ProductId || ActiveStatus === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing ID or ActiveStatus" });
  }
  const sql = `UPDATE mst_productdata SET ActiveStatus = ?, UpdatedAt = NOW() WHERE ProductId = ?`;
  db.query(sql, [ActiveStatus, ProductId], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Status updated successfully" });
  });
};



exports.getActiveProducts = (req, res) => {
  const sql = `
    SELECT ProductId, ProductName ,ProductType
    FROM mst_productdata
    WHERE ActiveStatus = 1
    ORDER BY ProductId DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ products: results });
  });
};



exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const product = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM mst_productdata 
         WHERE ProductNameURL = ?  LIMIT 1`,
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0]))
      );
    });

    if (product) {
      const sections = await new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM mst_sectionitems
           WHERE ProductId = ? 
           ORDER BY SectionNumber ASC, DisplayOrder ASC`,
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });
      const caseStudies = await new Promise((resolve, reject) => {
        db.query(
          `SELECT cs.*
FROM mst_casestudydata cs
INNER JOIN mst_casestudy_products csp 
     ON cs.CaseStudyId = csp.CaseStudyId
WHERE csp.ProductId = ?
ORDER BY cs.DisplayOrder ASC;
`,
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });
      const homeTestimonials = await new Promise((resolve, reject) => {
        db.query(
          `SELECT t.*
FROM mst_testimonialdata t
INNER JOIN mst_testimonial_pages p 
     ON t.TestimonialID = p.TestimonialID
WHERE p.PageName = ?
ORDER BY t.DisplayOrder ASC;
`,
          [product.ProductName],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });

      const groupedSections = {};
      sections.forEach(item => {
        const key = `section${item.SectionNumber}`;
        if (!groupedSections[key]) groupedSections[key] = [];
        groupedSections[key].push(item);
      });

      return res.json({
        product: { ...product, caseStudies },
        sections: groupedSections,
        caseStudy: null,
        moreCaseStudies: [],
        homeTestimonials
      });
    }
    const caseStudy = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM mst_casestudydata 
         WHERE CaseStudyNameURL = ? LIMIT 1`,
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0]))
      );
    });

    if (caseStudy) {
      const mappedProducts = await new Promise((resolve, reject) => {
        db.query(
          `SELECT ProductId FROM mst_casestudy_products 
           WHERE CaseStudyId = ?`,
          [caseStudy.CaseStudyId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });

      const primaryProductId = mappedProducts?.[0]?.ProductId || 0;
      const moreCaseStudies = await new Promise((resolve, reject) => {
        db.query(
          `SELECT cs.*
           FROM mst_casestudydata cs
           INNER JOIN mst_casestudy_products csp
                ON cs.CaseStudyId = csp.CaseStudyId
           WHERE csp.ProductId = ? 
             AND cs.CaseStudyId != ?
           ORDER BY cs.DisplayOrder ASC`,
          [primaryProductId, caseStudy.CaseStudyId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });
      const homeTestimonials = await new Promise((resolve, reject) => {
        db.query(
          `SELECT t.*
FROM mst_testimonialdata t
INNER JOIN mst_testimonial_pages p 
     ON t.TestimonialID = p.TestimonialID
INNER JOIN mst_productdata pr
     ON pr.ProductId = ?
WHERE p.PageName = pr.ProductName
ORDER BY t.DisplayOrder ASC;
`,
          [primaryProductId],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });
      return res.json({
        product: null,
        sections: {},
        caseStudy,
        moreCaseStudies,
        homeTestimonials
      });
    }
    return res.status(404).json({ error: "Page not found" });
  } catch (err) {
    console.error("Slug API Error:", err);
    return res.status(500).json({ error: err.message });
  }
};





