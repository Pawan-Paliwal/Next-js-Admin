const db = require("../db");


const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getHomeData = async (req, res) => {
  try {
    const sqlPartnerLogo = `
      SELECT PartnerLogoID, PartnerLogoImage, DisplayOrder
      FROM mst_partnerlogodata
      WHERE ActiveStatus = 1 AND DisplayOnHome = 1
      ORDER BY DisplayOrder ASC
    `;

    const sqlHomeTestimonials = `
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
  AND p.PageName = 'Home'
ORDER BY t.DisplayOrder ASC;
    `;

    const sqlMilestones = `
      SELECT 
        MilestoneID,
        Title,
        Description,
        MilestoneImage
      FROM mst_milestonedata
      WHERE ActiveStatus = 1
      ORDER BY DisplayOrder ASC, MilestoneID ASC
    `;
    const [partnerLogos, homeTestimonials, milestones] = await Promise.all([
      runQuery(sqlPartnerLogo),
      runQuery(sqlHomeTestimonials),
      runQuery(sqlMilestones),
    ]);
    res.json({ partnerLogos, homeTestimonials, milestones });
  } catch (err) {
    console.error("Home Page SQL Error:", err);
    res.status(500).json({ error: err.sqlMessage || err.message || err });
  }
};


exports.getProductSectionData = async (req, res) => {
  try {
    const sqlCategories = `
      SELECT DISTINCT
        c.CategoryID,
        c.CategoryName,
        c.CategoryNameURL,
        c.CategoryImage,
        c.SmallDescription,
        c.DisplayOrder
      FROM mst_categorydata c
      INNER JOIN mst_product_categories pc ON c.CategoryID = pc.CategoryID
      INNER JOIN mst_productdata p ON pc.ProductId = p.ProductId
      WHERE c.ActiveStatus = 1 
        AND p.ActiveStatus = 1
        AND c.DisplayOnHome = 1
      ORDER BY c.DisplayOrder ASC
    `;

    // const sqlProducts = `
    //   SELECT 
    //     p.ProductId,
    //     p.ProductName,
    //     p.ProductNameURL,
    //     p.ProductSmallDescription,
    //     p.Section1MediaUrl,
    //     p.ProductMedia,
    //     p.Section1ButtonText,
    //     pc.CategoryID,
    //     pc.CategoryTagline
    //   FROM mst_productdata p
    //   INNER JOIN mst_product_categories pc ON p.ProductId = pc.ProductId
    //   INNER JOIN mst_categorydata c ON pc.CategoryID = c.CategoryID
    //   WHERE p.ActiveStatus = 1 
    //     AND c.ActiveStatus = 1
    //     AND p.DisplayOnHome = 1
    //   ORDER BY p.ProductId ASC
    // `;
    const sqlProducts = ` SELECT p.ProductId, p.ProductName, p.ProductNameURL,p.ProductHeaderListName, p.ProductSmallDescription, p.Section1MediaUrl, p.ProductMedia, p.Section1ButtonText, pc.CategoryID, pc.CategoryTagline, pc.DisplayOrder AS ProductCategoryDisplayOrder, c.DisplayOrder AS CategoryDisplayOrder FROM mst_productdata p INNER JOIN mst_product_categories pc ON p.ProductId = pc.ProductId INNER JOIN mst_categorydata c ON pc.CategoryID = c.CategoryID WHERE p.ActiveStatus = 1 AND c.ActiveStatus = 1 AND p.DisplayOnHeader = 1 ORDER BY c.DisplayOrder ASC, pc.DisplayOrder ASC, p.ProductId ASC `;



    const [categories, products] = await Promise.all([
      runQuery(sqlCategories),
      runQuery(sqlProducts),
    ]);

    const data = categories.map((category) => ({
      categoryId: category.CategoryID,
      categoryName: category.CategoryName,
      categoryNameURL: category.CategoryNameURL,
      categoryImage: category.CategoryImage,
      categoryDescription: category.SmallDescription,
      products: products
        .filter((product) => product.CategoryID === category.CategoryID)
        .map((product) => ({
          productId: product.ProductId,
          productName: product.ProductName,
          productNameURL: product.ProductNameURL,
          ProductHeaderListName: product.ProductHeaderListName,
          productDescription: product.CategoryTagline,
          productImage: product.ProductMedia,
          buttonText: product.Section1ButtonText,
        })),
    }));

    res.json(data);
  } catch (err) {
    console.error("Product Section SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductHeaderSectionData = async (req, res) => {
  try {
    const sqlCategories = `
      SELECT DISTINCT
        c.CategoryID,
        c.CategoryName,
        c.CategoryNameURL,
        c.CategoryImage,
        c.SmallDescription,
        c.DisplayOrder
      FROM mst_categorydata c
      INNER JOIN mst_product_categories pc ON c.CategoryID = pc.CategoryID
      INNER JOIN mst_productdata p ON pc.ProductId = p.ProductId
      WHERE c.ActiveStatus = 1 
        AND p.ActiveStatus = 1
        AND c.DisplayOnHeader = 1
      ORDER BY c.DisplayOrder ASC
    `;

    const sqlProducts = ` SELECT p.ProductId, p.ProductName, p.ProductNameURL,p.ProductHeaderListName, p.ProductSmallDescription, p.Section1MediaUrl, p.ProductMedia, p.Section1ButtonText, pc.CategoryID, pc.CategoryTagline, pc.DisplayOrder AS ProductCategoryDisplayOrder, c.DisplayOrder AS CategoryDisplayOrder FROM mst_productdata p INNER JOIN mst_product_categories pc ON p.ProductId = pc.ProductId INNER JOIN mst_categorydata c ON pc.CategoryID = c.CategoryID WHERE p.ActiveStatus = 1 AND c.ActiveStatus = 1 AND p.DisplayOnHeader = 1 ORDER BY c.DisplayOrder ASC, pc.DisplayOrder ASC, p.ProductId ASC `;

    const [categories, products] = await Promise.all([
      runQuery(sqlCategories),
      runQuery(sqlProducts),
    ]);

    const data = categories.map((category) => ({
      categoryId: category.CategoryID,
      categoryName: category.CategoryName,
      categoryNameURL: category.CategoryNameURL,
      categoryImage: category.CategoryImage,
      categoryDescription: category.SmallDescription,
      products: products
        .filter((product) => product.CategoryID === category.CategoryID)
        .map((product) => ({
          productId: product.ProductId,
          productName: product.ProductName,
          productNameURL: product.ProductNameURL,
          ProductHeaderListName: product.ProductHeaderListName,
          productDescription: product.CategoryTagline,
          productImage: product.ProductMedia,
          buttonText: product.Section1ButtonText,
        })),
    }));
    res.json(data);
  } catch (err) {
    console.error("Product Section SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAboutPageData = (req, res) => {
  const teamSql = `
    SELECT TeamID, TeamName, TeamDesignation, TeamBio, TeamImage, TeamType, DisplayOrder
    FROM mst_teamdata
    WHERE ActiveStatus = 1
    ORDER BY TeamType ASC, DisplayOrder ASC
  `;

  const milestoneSql = `
    SELECT MilestoneID, Title, Description, MilestoneImage
    FROM mst_milestonedata
    WHERE ActiveStatus = 1
    ORDER BY MilestoneID ASC
  `;

  const timelineSql = `
    SELECT 
      TimelineID,
      TimelineName,
      TimelineImage,
      TimelineYear,
      Description,
      ActiveStatus,
      DisplayOrder
    FROM mst_ourtimelinedata
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;

  db.query(teamSql, (err, teamResults) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    db.query(milestoneSql, (err, milestoneResults) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });

      db.query(timelineSql, (err, timelineResults) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        const groupedTeam = {};
        teamResults.forEach(t => {
          if (!groupedTeam[t.TeamType]) groupedTeam[t.TeamType] = [];
          groupedTeam[t.TeamType].push(t);
        });

        res.json({
          success: true,
          team: groupedTeam,
          milestones: milestoneResults,
          timelines: timelineResults
        });
      });
    });
  });
};

exports.getFooterProducts = async (req, res) => {
  try {
    const productSQL = `
      SELECT 
        ProductId,
        ProductName,
        ProductNameURL,
        ProductMedia,
        ProductListDescription,
        ProductType,
        ComingSoon
      FROM mst_productdata
      WHERE ActiveStatus = 1 AND (ComingSoon = 0 OR ComingSoon IS NULL)
      ORDER BY ProductId ASC
    `;
    const products = await runQuery(productSQL);
    const staticSQL = `  SELECT Address,Email,PhoneNumber,LinkedIn,Twitter,Instagram,Facebook,MapDirection,IframeLink from mst_staticdata where StaticID = 3;`;
    const staticResults = await runQuery(staticSQL);
    const footerStatic = staticResults[0] || null;
    const groupedFooter = [];
    const typeGroups = [
      { name: 'swasth', displayName: 'Swasth', types: ['swasth-for-families', 'swasth-for-hospitals', 'swasth-for-corporates'] },
      { name: 'procalyx', displayName: 'Procalyx', types: ['procalyx-pharma', 'procalyx-hospital'] },
      { name: 'swasthera', displayName: 'Swasthera', types: ['swasthera'] }
    ];

    for (const group of typeGroups) {
      const groupProducts = products
        .filter(p => group.types.includes(p.ProductType))
        .map(p => ({
          ProductId: p.ProductId,
          ProductName: p.ProductName,
          ProductNameURL: p.ProductNameURL,
          ProductMedia: p.ProductMedia,
          ProductListDescription: p.ProductListDescription
        }));

      if (groupProducts.length > 0) {
        groupedFooter.push({
          type: 'product',
          name: group.name,
          displayName: group.displayName,
          url: group.name,
          ...(group.name === "swasthera" && { displayUrl: "/swastheraPage" }),
          products: groupProducts
        });
      }
    }
    res.json({
      footerStatic,
      footerProducts: groupedFooter
    });

  } catch (err) {
    console.error("Footer Menu SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
};












