const db = require('../db');

// GET all team members
exports.getAllTeamMembers = (req, res) => {
    const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY TeamID DESC) AS SerialNo, 
      TeamID, 
      TeamName, 
      TeamDesignation, 
      TeamBio, 
      TeamImage, 
      TeamType, 
      ActiveStatus, 
      DisplayOrder, 
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate 
    FROM mst_teamdata 
    ORDER BY TeamID DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
};


// GET team member by ID
exports.getTeamMemberById = (req, res) => {
    const TeamID = req.query.TeamID;
    if (!TeamID) {
        return res
            .status(400)
            .json({ success: false, message: "Missing Team ID" });
    }
    const teamSql = "SELECT * FROM mst_teamdata WHERE TeamID = ? LIMIT 1";
    db.query(teamSql, [TeamID], (err, teamResults) => {
        if (err) {
            console.error("Error fetching team member:", err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
        if (teamResults.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Team member not found" });
        }
        return res.status(200).json({
            success: true,
            data: teamResults[0],
        });
    });
};

// CREATE or UPDATE team member
exports.saveOrUpdateTeamMember = (req, res) => {
    const {
        TeamID,
        TeamName,
        TeamDesignation,
        TeamBio,
        TeamType,
        ActiveStatus,
        UpdatedBy,
        DisplayOrder
    } = req.body;
    const currentTime = new Date();
    const TeamImage = req.files?.TeamImage?.[0]?.filename || null;
    const checkDuplicateSql = `
    SELECT TeamID FROM mst_teamdata 
    WHERE TeamName = ? 
    ${TeamID ? "AND TeamID != ?" : ""}
  `;
    const checkParams = TeamID ? [TeamName, TeamID] : [TeamName];
    db.query(checkDuplicateSql, checkParams, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Team member with the same name already exists" });
        }
        if (TeamID) {
            const getOldSql = "SELECT TeamImage FROM mst_teamdata WHERE TeamID = ?";
            db.query(getOldSql, [TeamID], (err, oldResults) => {
                if (err || oldResults.length === 0) {
                    return res.status(400).json({ success: false, message: "Invalid TeamID" });
                }
                const old = oldResults[0];
                const finalTeamImage = TeamImage || old.TeamImage;

                const updateSql = `
          UPDATE mst_teamdata SET 
            TeamName = ?, 
            TeamDesignation = ?, 
            TeamBio = ?, 
            TeamImage = ?, 
            TeamType = ?, 
            ActiveStatus = ?, 
            UpdatedBy = ?, 
            UpdatedOn = ?, 
            DisplayOrder = ?
          WHERE TeamID = ?
        `;
                db.query(updateSql, [
                    TeamName,
                    TeamDesignation,
                    TeamBio,
                    finalTeamImage,
                    TeamType,
                    ActiveStatus,
                    UpdatedBy,
                    currentTime,
                    DisplayOrder,
                    TeamID
                ], (err) => {
                    if (err) return res.status(500).json({ success: false, message: "Update failed", error: err.message });
                    return res.json({ success: true, message: "Team member updated successfully" });
                });
            });
        } else {
            const insertSql = `
        INSERT INTO mst_teamdata (
          TeamName, 
          TeamDesignation, 
          TeamBio, 
          TeamImage, 
          TeamType, 
          ActiveStatus, 
          PostedDate, 
          UpdatedBy, 
          UpdatedOn, 
          DisplayOrder
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            db.query(insertSql, [
                TeamName || "",
                TeamDesignation || "",
                TeamBio || "",
                TeamImage,
                TeamType || "",
                ActiveStatus,
                currentTime,
                UpdatedBy || "Admin",
                currentTime,
                DisplayOrder
            ], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: "Insert failed", error: err.message });
                return res.json({ success: true, message: "Team member created successfully" });
            });
        }
    });
};

// DELETE team member
exports.deleteTeamMember = (req, res) => {
    const TeamID = req.params.TeamID;
    const sql = 'DELETE FROM mst_teamdata WHERE TeamID = ?';
    db.query(sql, [TeamID], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.json({ success: true, message: 'Team member deleted successfully' });
    });
};

// Update status
exports.updateActiveStatus = (req, res) => {
    const { TeamID, ActiveStatus } = req.body;
    if (!TeamID || ActiveStatus === undefined) {
        return res.status(400).json({ success: false, message: "Missing ID or ActiveStatus" });
    }
    const sql = `UPDATE mst_teamdata SET ActiveStatus = ?, UpdatedOn = NOW() WHERE TeamID = ?`;
    db.query(sql, [ActiveStatus, TeamID], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "Status updated successfully" });
    });
};

// UPDATE display order for team members
exports.updateDisplayOrder = (req, res) => {
    const updates = req.body;
    if (!Array.isArray(updates)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
    }
    const updatePromises = updates.map(({ TeamID, DisplayOrder }) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE mst_teamdata SET DisplayOrder = ? WHERE TeamID = ?';
            db.query(sql, [DisplayOrder, TeamID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
    Promise.all(updatePromises)
        .then(() => res.json({ success: true, message: 'Display order updated successfully' }))
        .catch(err => {
            console.error('Error updating display order:', err);
            res.status(500).json({ success: false, message: 'Database error', error: err.message });
        });
};


// GET max display order for team members
exports.getMaxDisplayOrder = (req, res) => {
    const sql = 'SELECT MAX(DisplayOrder) AS maxOrder FROM mst_teamdata';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        const maxOrder = results[0]?.maxOrder || 0;
        res.json({ success: true, maxOrder });
    });
};

