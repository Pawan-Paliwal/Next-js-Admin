const db = require("../db");

// GET all careers for admin
exports.getAllCareers = (req, res) => {
    const sql = `
        SELECT 
            ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC, CareerID DESC) AS SerialNo,
            CareerID,
            CareerName,
            CareerDescription,
            Location,
            CareerType,
            DisplayOrder,
            ActiveStatus,
            PostedDate
        FROM mst_careerdata
        ORDER BY DisplayOrder ASC, CareerID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, data: results });
    });
};

// GET career by ID
exports.getCareerById = (req, res) => {
    const { CareerID } = req.query;
    if (!CareerID) return res.status(400).json({ success: false, message: "Missing Career ID" });

    const sql = "SELECT * FROM mst_careerdata WHERE CareerID = ?";
    db.query(sql, [CareerID], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Internal server error" });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Career not found" });
        res.json({ success: true, data: results[0] });
    });
};

// SAVE or UPDATE career
exports.saveOrUpdateCareer = (req, res) => {
    const {
        CareerID,
        CareerName,
        CareerDescription,
        Location,
        CareerType,
        DisplayOrder,
        ActiveStatus,
        UpdatedBy
    } = req.body;

    const currentTime = new Date();
    const activeStatusVal = parseInt(ActiveStatus) || 0;
    const displayOrderVal = parseInt(DisplayOrder) || 0;

    if (CareerID) {
        const updateSql = `
            UPDATE mst_careerdata 
            SET CareerName=?, CareerDescription=?, Location=?, CareerType=?, DisplayOrder=?, ActiveStatus=?, UpdatedBy=?, UpdatedOn=? 
            WHERE CareerID=?
        `;
        db.query(updateSql, [CareerName, CareerDescription, Location, CareerType, displayOrderVal, activeStatusVal, UpdatedBy, currentTime, CareerID], (err) => {
            if (err) return res.status(500).json({ success: false, message: "Update failed", error: err });
            res.json({ success: true, message: "Career updated successfully" });
        });
    } else {
        const insertSql = `
            INSERT INTO mst_careerdata (CareerName, CareerDescription, Location, CareerType, DisplayOrder, ActiveStatus, PostedDate, UpdatedBy, UpdatedOn) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertSql, [CareerName, CareerDescription, Location, CareerType, displayOrderVal, activeStatusVal, currentTime, UpdatedBy, currentTime], (err) => {
            if (err) return res.status(500).json({ success: false, message: "Creation failed", error: err });
            res.json({ success: true, message: "Career created successfully" });
        });
    }
};

// DELETE career
exports.deleteCareer = (req, res) => {
    const { CareerID } = req.params;
    const sql = "DELETE FROM mst_careerdata WHERE CareerID = ?";
    db.query(sql, [CareerID], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Career deleted successfully" });
    });
};

// UPDATE status (Active/Inactive)
exports.updateCareerStatus = (req, res) => {
    const { CareerID, ActiveStatus } = req.body;
    const sql = "UPDATE mst_careerdata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE CareerID = ?";
    db.query(sql, [ActiveStatus, CareerID], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Status update failed" });
        res.json({ success: true, message: "Status updated successfully" });
    });
};

// UPDATE Multi-Display Order
exports.updateDisplayOrder = (req, res) => {
    const updates = req.body;
    if (!Array.isArray(updates)) return res.status(400).json({ success: false, message: "Invalid data format" });

    const promises = updates.map(({ CareerID, DisplayOrder }) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE mst_careerdata SET DisplayOrder = ? WHERE CareerID = ?", [DisplayOrder, CareerID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(promises)
        .then(() => res.json({ success: true, message: "Display orders updated successfully" }))
        .catch(err => res.status(500).json({ success: false, message: "Update failed", error: err }));
};
