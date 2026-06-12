const db = require("../db");
const fs = require("fs");
const path = require("path");

exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
      ProductId, ProductName, ProductNameURL, ProductHeading,
      ProductMedia, Section1MediaUrl, DisplayOrder, ActiveStatus,
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate
    FROM mst_products
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const { ProductId } = req.query;
  if (!ProductId)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId" });
  db.query(
    "SELECT * FROM mst_products WHERE ProductId = ? LIMIT 1",
    [ProductId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      res.status(200).json({ success: true, data: results[0] });
    },
  );
};

exports.saveOrUpdateProduct = (req, res) => {
  const {
    ProductId,
    ProductName,
    ProductNameURL,
    ProductHeading,
    ProductListDescription,
    ProductSmallDescription,
    Section1Title,
    Section1Description,
    Section3Title,
    Section3Description,
    Section4Title,
    Section4Description,
    Section5Title,
    Section5Description,
    Section6Title,
    Section6Description,
    ActiveStatus,
    DisplayOnHeader,
    DisplayOrder,
    MetaTitle,
    MetaKeywords,
    MetaDescriptions,
    MetaSchema,
    UpdatedBy,
  } = req.body;

  const currentTime = new Date();
  const ProductMedia = req.files?.ProductMedia?.[0]?.filename || null;
  const Section1MediaUrl = req.files?.Section1MediaUrl?.[0]?.filename || null;
  const Section3MediaUrl = req.files?.Section3MediaUrl?.[0]?.filename || null;
  const Section4MediaUrl = req.files?.Section4MediaUrl?.[0]?.filename || null;

  const checkSql = `SELECT ProductId FROM mst_products WHERE (ProductName = ? OR ProductNameURL = ?) ${ProductId ? "AND ProductId != ?" : ""}`;
  const checkParams = ProductId
    ? [ProductName, ProductNameURL, ProductId]
    : [ProductName, ProductNameURL];

  db.query(checkSql, checkParams, (err, dupes) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    if (dupes.length > 0)
      return res.status(400).json({
        success: false,
        message: "Product name or URL already exists",
      });

    if (ProductId) {
      db.query(
        "SELECT ProductMedia, Section1MediaUrl, Section3MediaUrl, Section4MediaUrl FROM mst_products WHERE ProductId = ?",
        [ProductId],
        (err, old) => {
          if (err || old.length === 0)
            return res
              .status(400)
              .json({ success: false, message: "Invalid ProductId" });
          const o = old[0];
          const sql = `
          UPDATE mst_products SET
            ProductName=?, ProductNameURL=?, ProductHeading=?, ProductListDescription=?, ProductSmallDescription=?,
            ProductMedia=?,
            Section1Title=?, Section1Description=?, Section1MediaUrl=?,
            Section3Title=?, Section3Description=?, Section3MediaUrl=?,
            Section4Title=?, Section4Description=?, Section4MediaUrl=?,
            Section5Title=?, Section5Description=?,
            Section6Title=?, Section6Description=?,
            ActiveStatus=?, DisplayOnHeader=?, DisplayOrder=?,
            MetaTitle=?, MetaKeywords=?, MetaDescriptions=?, MetaSchema=?,
            UpdatedBy=?, UpdatedOn=?
          WHERE ProductId=?
        `;
          db.query(
            sql,
            [
              ProductName,
              ProductNameURL,
              ProductHeading,
              ProductListDescription,
              ProductSmallDescription,
              ProductMedia || o.ProductMedia,
              Section1Title,
              Section1Description,
              Section1MediaUrl || o.Section1MediaUrl,
              Section3Title,
              Section3Description,
              Section3MediaUrl || o.Section3MediaUrl,
              Section4Title,
              Section4Description,
              Section4MediaUrl || o.Section4MediaUrl,
              Section5Title,
              Section5Description,
              Section6Title,
              Section6Description,
              ActiveStatus,
              DisplayOnHeader,
              DisplayOrder,
              MetaTitle,
              MetaKeywords,
              MetaDescriptions,
              MetaSchema,
              UpdatedBy,
              currentTime,
              ProductId,
            ],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ success: false, message: err.message });
              res.json({
                success: true,
                message: "Product updated successfully",
              });
            },
          );
        },
      );
    } else {
      const sql = `
        INSERT INTO mst_products (
          ProductName, ProductNameURL, ProductHeading, ProductListDescription, ProductSmallDescription,
          ProductMedia,
          Section1Title, Section1Description, Section1MediaUrl,
          Section3Title, Section3Description, Section3MediaUrl,
          Section4Title, Section4Description, Section4MediaUrl,
          Section5Title, Section5Description,
          Section6Title, Section6Description,
          ActiveStatus, DisplayOnHeader, DisplayOrder,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          UpdatedBy, PostedDate, UpdatedOn
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      db.query(
        sql,
        [
          ProductName,
          ProductNameURL,
          ProductHeading,
          ProductListDescription,
          ProductSmallDescription,
          ProductMedia,
          Section1Title,
          Section1Description,
          Section1MediaUrl,
          Section3Title,
          Section3Description,
          Section3MediaUrl,
          Section4Title,
          Section4Description,
          Section4MediaUrl,
          Section5Title,
          Section5Description,
          Section6Title,
          Section6Description,
          ActiveStatus,
          DisplayOnHeader,
          DisplayOrder,
          MetaTitle,
          MetaKeywords,
          MetaDescriptions,
          MetaSchema,
          UpdatedBy,
          currentTime,
          currentTime,
        ],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });
          res.json({
            success: true,
            message: "Product created successfully",
            ProductId: result.insertId,
          });
        },
      );
    }
  });
};

exports.deleteProduct = (req, res) => {
  const { ProductId } = req.params;
  db.query(
    "SELECT ProductMedia, Section1MediaUrl, Section3MediaUrl, Section4MediaUrl FROM mst_products WHERE ProductId = ?",
    [ProductId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      db.query(
        "DELETE FROM mst_products WHERE ProductId = ?",
        [ProductId],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          if (result.affectedRows === 0)
            return res
              .status(404)
              .json({ success: false, message: "Product not found" });
          if (results.length > 0) {
            Object.values(results[0]).forEach((filename) => {
              if (filename) {
                const filePath = path.join(
                  __dirname,
                  "../uploads/OnlineImages/ProductImages",
                  filename,
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
          res.json({ success: true, message: "Product deleted successfully" });
        },
      );
    },
  );
};

exports.updateActiveStatus = (req, res) => {
  const { ProductId, ActiveStatus } = req.body;
  if (!ProductId || ActiveStatus === undefined)
    return res
      .status(400)
      .json({ success: false, message: "Missing ProductId or ActiveStatus" });
  db.query(
    "UPDATE mst_products SET ActiveStatus = ?, UpdatedOn = NOW() WHERE ProductId = ?",
    [ActiveStatus, ProductId],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Status updated successfully" });
    },
  );
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates))
    return res.status(400).json({ success: false, message: "Invalid format" });
  const queries = updates.map((item) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE mst_products SET DisplayOrder = ? WHERE ProductId = ?",
        [item.DisplayOrder, item.ProductId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  });
  Promise.all(queries)
    .then(() =>
      res.json({
        success: true,
        message: "Display order updated successfully",
      }),
    )
    .catch((err) =>
      res.status(500).json({ success: false, message: "Database error" }),
    );
};

exports.getMaxDisplayOrder = (req, res) => {
  const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_products`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};

exports.getActiveProducts = (req, res) => {
  const sql = `SELECT ProductId ,ProductName , ProductNameURL ,ProductMedia , ProductHeading , ProductListDescription FROM mst_products WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ products: results });
  });
};

exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const product = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM mst_products WHERE ProductNameURL = ? LIMIT 1",
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0])),
      );
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const [highlights, gallery, circuits, technology, drives] =
      await Promise.all([
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM mst_producthighlights WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
            [product.ProductId],
            (err, rows) => (err ? reject(err) : resolve(rows)),
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM mst_productgallery WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
            [product.ProductId],
            (err, rows) => (err ? reject(err) : resolve(rows)),
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM mst_productcircuits WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
            [product.ProductId],
            (err, rows) => (err ? reject(err) : resolve(rows)),
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM mst_producttechnology WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
            [product.ProductId],
            (err, rows) => (err ? reject(err) : resolve(rows)),
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM mst_productdrives WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
            [product.ProductId],
            (err, rows) => (err ? reject(err) : resolve(rows)),
          );
        }),
      ]);
    res.json({ product, highlights, gallery, circuits, technology, drives });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProductBySlugPublic = async (req, res) => {
  const slug = req.params.slug;
  try {
    const product = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM mst_products WHERE ProductNameURL = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC LIMIT 1",
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0])),
      );
    });
    if (!product) return res.status(404).json({ error: "Product not found or inactive" });
    const [highlights, gallery, circuits, technology, drives] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM mst_producthighlights WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM mst_productgallery WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM mst_productcircuits WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM mst_producttechnology WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM mst_productdrives WHERE ProductId = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC",
          [product.ProductId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        );
      }),
    ]);
    return res.json({ product, highlights, gallery, circuits, technology, drives });
  } catch (err) {
    console.error("Public slug API error:", err);
    return res.status(500).json({ error: err.message });
  }
};

