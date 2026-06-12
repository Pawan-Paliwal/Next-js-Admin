const db = require('../db');
const fs = require('fs');
const path = require('path');

// GET all items for a product by section number
exports.getItemsByProductAndSection = (req, res) => {
    const { ProductId, SectionNumber } = req.query;
    if (!ProductId || !SectionNumber) {
        return res.status(400).json({ success: false, message: "Missing ProductId or SectionNumber" });
    }
    const sql = ` SELECT * FROM mst_sectionitems WHERE ProductId = ? AND SectionNumber = ? ORDER BY DisplayOrder ASC `;
    db.query(sql, [ProductId, SectionNumber], (err, results) => {
        if (err) {
            console.error("Error fetching items:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        return res.status(200).json({
            success: true,
            data: results,
        });
    });
};



// SAVE or UPDATE section item
exports.saveOrUpdateSectionItem = (req, res) => {
    const {
        ItemId, ProductId, ItemTitle, ItemDescription, SectionNumber, DisplayOrder, ActiveStatus
    } = req.body;
    const currentTime = new Date();
    const ItemIconUrl = req.files?.ItemIconUrl?.[0]?.filename || null;

    if (ItemId) {
        const getOldSql = "SELECT ItemIconUrl FROM mst_sectionitems WHERE ItemId = ?";
        db.query(getOldSql, [ItemId], (err, oldResults) => {
            if (err || oldResults.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid ItemId" });
            }
            const old = oldResults[0];
            const finalIconUrl = ItemIconUrl || old.ItemIconUrl;
            const updateSql = `
        UPDATE mst_sectionitems 
        SET ItemTitle = ?, ItemDescription = ?, ItemIconUrl = ?, 
            DisplayOrder = ?, ActiveStatus = ?, UpdatedAt = ? 
        WHERE ItemId = ?
      `;
            db.query(updateSql, [
                ItemTitle, ItemDescription || null, finalIconUrl,
                DisplayOrder, ActiveStatus, currentTime, ItemId
            ], (err) => {
                if (err) {
                    console.error("Update error:", err);
                    return res.status(500).json({ success: false, message: "Update failed" });
                }
                return res.json({ success: true, message: "Item updated successfully" });
            });
        });
    } else {
        const insertSql = `
      INSERT INTO mst_sectionitems (
        ProductId, ItemTitle, ItemDescription, ItemIconUrl, 
        SectionNumber, DisplayOrder, ActiveStatus, CreatedAt, UpdatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(insertSql, [
            ProductId, ItemTitle, ItemDescription || null, ItemIconUrl,
            SectionNumber, DisplayOrder, ActiveStatus,
            currentTime, currentTime
        ], (err, result) => {
            if (err) {
                console.error("Insert error:", err);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || err.message
                });
            }
            return res.json({
                success: true,
                message: "Item created successfully",
                ItemId: result.insertId
            });
        });
    }
};



// DELETE section item
exports.deleteSectionItem = (req, res) => {
    const ItemId = req.params.ItemId;
    const getImageSql = 'SELECT ItemIconUrl FROM mst_sectionitems WHERE ItemId = ?';
    db.query(getImageSql, [ItemId], (err, results) => {
        if (err) {
            console.error("Error fetching item:", err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        const ItemIconUrl = results[0].ItemIconUrl;
        const deleteSql = 'DELETE FROM mst_sectionitems WHERE ItemId = ?';
        db.query(deleteSql, [ItemId], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (ItemIconUrl) {
                const imagePath = path.join(__dirname, '../uploads/OnlineImages/ProductImages', ItemIconUrl);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (unlinkErr) {
                        console.error("Error deleting image file:", unlinkErr);
                    }
                }
            }
            res.json({ success: true, message: 'Item deleted successfully' });
        });
    });
};