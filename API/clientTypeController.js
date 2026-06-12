const db = require('../db');
const path = require('path');
const fs = require('fs');

// ─── Helper ───────────────────────────────────────────────────────────────────
const deleteOldImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../uploads/OnlineImages/ClientTypeImages', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Error deleting old image:', err);
  });
};


exports.getAllClientTypes = (req, res) => {
  const sql = `
    SELECT ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
           ClientTypeID, TypeName, TypeNameURL, SmallDescription, Heading,
           BannerImage, Image1, Image2, Image3,
           ActiveStatus, DisplayOrder, PostedDate
    FROM mst_clienttype
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


exports.getClientTypeById = (req, res) => {
  const { ClientTypeID } = req.query;
  if (!ClientTypeID) return res.status(400).json({ success: false, message: 'Missing ID' });
  db.query('SELECT * FROM mst_clienttype WHERE ClientTypeID = ? LIMIT 1', [ClientTypeID], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
    if (!results.length) return res.status(404).json({ success: false, message: 'Client type not found' });
    res.json({ success: true, data: results[0] });
  });
};


exports.saveOrUpdateClientType = (req, res) => {
  const {
    ClientTypeID, TypeName, TypeNameURL, SmallDescription,
    Heading, ListHeading,
    Description, ListDescription, ProductDescription,
    MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
    ActiveStatus, DisplayOrder, UpdatedBy,
  } = req.body;

  const BannerImage = req.files?.BannerImage?.[0]?.filename || null;
  const Image1 = req.files?.Image1?.[0]?.filename || null;
  const Image2 = req.files?.Image2?.[0]?.filename || null;
  const Image3 = req.files?.Image3?.[0]?.filename || null;
  const currentTime = new Date();

  const checkDuplicateSql = `
    SELECT ClientTypeID FROM mst_clienttype
    WHERE (TypeName = ? OR TypeNameURL = ?)
    ${ClientTypeID ? 'AND ClientTypeID != ?' : ''}
  `;
  const checkParams = ClientTypeID
    ? [TypeName, TypeNameURL, ClientTypeID]
    : [TypeName, TypeNameURL];

  db.query(checkDuplicateSql, checkParams, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Client type with the same name or URL already exists' });
    }

    if (ClientTypeID) {
      db.query(
        'SELECT BannerImage, Image1, Image2, Image3 FROM mst_clienttype WHERE ClientTypeID = ?',
        [ClientTypeID],
        (err, old) => {
          if (err || !old.length) return res.status(400).json({ success: false, message: 'Invalid ClientTypeID' });

          const finalBanner = BannerImage || old[0].BannerImage;
          const finalImage1 = Image1 || old[0].Image1;
          const finalImage2 = Image2 || old[0].Image2;
          const finalImage3 = Image3 || old[0].Image3;

          if (BannerImage && old[0].BannerImage && BannerImage !== old[0].BannerImage) deleteOldImage(old[0].BannerImage);
          if (Image1 && old[0].Image1 && Image1 !== old[0].Image1) deleteOldImage(old[0].Image1);
          if (Image2 && old[0].Image2 && Image2 !== old[0].Image2) deleteOldImage(old[0].Image2);
          if (Image3 && old[0].Image3 && Image3 !== old[0].Image3) deleteOldImage(old[0].Image3);

          const updateSql = `
            UPDATE mst_clienttype SET
              TypeName = ?, TypeNameURL = ?, SmallDescription = ?,
              Heading = ?, ListHeading = ?,
              Description = ?, ListDescription = ?, ProductDescription = ?,
              BannerImage = ?, Image1 = ?, Image2 = ?, Image3 = ?,
              MetaTitle = ?, MetaKeywords = ?, MetaDescriptions = ?, MetaSchema = ?,
              ActiveStatus = ?, DisplayOrder = ?, UpdatedBy = ?, UpdatedOn = ?
            WHERE ClientTypeID = ?
          `;
          db.query(updateSql, [
            TypeName, TypeNameURL, SmallDescription,
            Heading, ListHeading,
            Description, ListDescription, ProductDescription,
            finalBanner, finalImage1, finalImage2, finalImage3,
            MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
            ActiveStatus, DisplayOrder, UpdatedBy, currentTime,
            ClientTypeID,
          ], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Update failed', error: err });
            res.json({ success: true, message: 'Client type updated successfully' });
          });
        }
      );
    } else {
      const insertSql = `
        INSERT INTO mst_clienttype (
          TypeName, TypeNameURL, SmallDescription,
          Heading, ListHeading,
          Description, ListDescription, ProductDescription,
          BannerImage, Image1, Image2, Image3,
          MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
          ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [
        TypeName, TypeNameURL, SmallDescription,
        Heading, ListHeading,
        Description, ListDescription, ProductDescription,
        BannerImage, Image1, Image2, Image3,
        MetaTitle, MetaKeywords, MetaDescriptions, MetaSchema,
        ActiveStatus, DisplayOrder, currentTime, UpdatedBy, currentTime,
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Insert failed', error: err });
        res.json({ success: true, message: 'Client type created successfully' });
      });
    }
  });
};

exports.updateDisplayOrder = (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: 'Invalid format' });

  const queries = updates.map(item =>
    new Promise((resolve, reject) => {
      db.query(
        'UPDATE mst_clienttype SET DisplayOrder = ? WHERE ClientTypeID = ?',
        [item.DisplayOrder, item.ClientTypeID],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    })
  );
  Promise.all(queries)
    .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
    .catch(() => res.status(500).json({ success: false, message: 'Database error' }));
};

exports.getMaxDisplayOrder = (req, res) => {
  db.query('SELECT MAX(DisplayOrder) AS maxOrder FROM mst_clienttype', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ maxOrder: results[0]?.maxOrder || 0 });
  });
};


exports.deleteClientType = (req, res) => {
  const { ClientTypeID } = req.params;
  db.query(
    'SELECT BannerImage, Image1, Image2, Image3 FROM mst_clienttype WHERE ClientTypeID = ?',
    [ClientTypeID],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (!results.length) return res.status(404).json({ success: false, message: 'Not found' });
      db.query('DELETE FROM mst_clienttype WHERE ClientTypeID = ?', [ClientTypeID], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Not found' });
        const { BannerImage, Image1, Image2, Image3 } = results[0];
        deleteOldImage(BannerImage);
        deleteOldImage(Image1);
        deleteOldImage(Image2);
        deleteOldImage(Image3);

        res.json({ success: true, message: 'Client type deleted successfully' });
      });
    }
  );
};

exports.updateActiveStatus = (req, res) => {
  const { ClientTypeID, ActiveStatus } = req.body;
  if (!ClientTypeID || ActiveStatus === undefined)
    return res.status(400).json({ success: false, message: 'Missing ClientTypeID or ActiveStatus' });

  db.query(
    'UPDATE mst_clienttype SET ActiveStatus = ?, UpdatedOn = NOW() WHERE ClientTypeID = ?',
    [ActiveStatus, ClientTypeID],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      res.json({ success: true, message: 'Status updated successfully' });
    }
  );
};

exports.getAllActiveClientTypes = (req, res) => {
  const sql = `
    SELECT ClientTypeID, TypeName, TypeNameURL, SmallDescription,
           Heading, BannerImage, Image1, Image2, Image3,
           DisplayOrder, ActiveStatus
    FROM mst_clienttype
    WHERE ActiveStatus = 1
    ORDER BY DisplayOrder ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getClientTypeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const clientType = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM mst_clienttype WHERE TypeNameURL = ? AND ActiveStatus = 1 LIMIT 1',
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0]))
      );
    });
    if (!clientType) return res.status(404).json({ error: 'Client type not found' });
    res.json({ clientType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveTurnkeycategory = (req, res) => {
  const sql = `SELECT ClientTypeID  ,TypeName , TypeNameURL ,Image1 , ListHeading , ListDescription FROM mst_clienttype WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ turnkeycategory: results });
  });
};

exports.getTurnkeyProjectBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const turnkeyProject = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM mst_clienttype WHERE TypeNameURL = ? AND ActiveStatus = 1 LIMIT 1",
        [slug],
        (err, rows) => (err ? reject(err) : resolve(rows[0]))
      );
    });
    if (!turnkeyProject) return res.status(404).json({ error: "Turnkey project not found" });
    const mappings = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM mst_clientlogomapping WHERE ClientTypeID = ?",
        [turnkeyProject.ClientTypeID],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    const allLogos = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM mst_partnerlogodata WHERE ActiveStatus = 1",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    const partnerLogos = await new Promise((resolve, reject) => {
      db.query(
        `SELECT p.* FROM mst_partnerlogodata p
         INNER JOIN mst_clientlogomapping m ON m.PartnerLogoID = p.PartnerLogoID
         WHERE m.ClientTypeID = ? AND p.ActiveStatus = 1
         ORDER BY p.DisplayOrder ASC`,
        [turnkeyProject.ClientTypeID],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    res.json({
      turnkeyProject,
      partnerLogos
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};