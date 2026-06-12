const db = require("../db");

// GET all timelines
exports.getAllTimelines = (req, res) => {
    const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY DisplayOrder ASC) AS SerialNo,
      t.*
    FROM mst_ourtimelinedata t
    ORDER BY t.DisplayOrder ASC;
  `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({
            success: true,
            data: results
        });
    });
};


// GET timeline by ID
exports.getTimelineById = (req, res) => {
    const TimelineID = req.query.TimelineID;
    if (!TimelineID) {
        return res
            .status(400)
            .json({ success: false, message: "Missing Timeline ID" });
    }
    const timelineSql =
        "SELECT * FROM mst_ourtimelinedata WHERE TimelineID = ? LIMIT 1";
    db.query(timelineSql, [TimelineID], (err, timelineResults) => {
        if (err) {
            console.error("DB Error:", err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
        if (timelineResults.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Timeline not found" });
        }
        return res.json({
            success: true,
            data: timelineResults[0],
        });
    });
};
``;

// CREATE or UPDATE timeline
exports.saveOrUpdateTimeline = (req, res) => {
    const {
        TimelineID,
        TimelineName,
        TimelineNameURL,
        TimelineYear,
        Description,
        ActiveStatus,
        DisplayOrder,
        UpdatedBy,
    } = req.body;
    const currentTime = new Date();
    const TimelineImage = req.files?.TimelineImage?.[0]?.filename || null;

    const activeStatusVal = ActiveStatus === "1" || ActiveStatus === 1 ? 1 : 0;
    const displayOrderVal = parseInt(DisplayOrder, 10) || 0;

    const checkDuplicateSql = `
    SELECT TimelineID FROM mst_ourtimelinedata
    WHERE (TimelineName = ? OR TimelineNameURL = ?)
    ${TimelineID ? "AND TimelineID != ?" : ""}
  `;
    const checkParams = TimelineID
        ? [TimelineName, TimelineNameURL, TimelineID]
        : [TimelineName, TimelineNameURL];

    db.query(checkDuplicateSql, checkParams, (err, results) => {
        if (err)
            return res
                .status(500)
                .json({ success: false, message: "Database error" });
        if (results.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Timeline with the same name or URL already exists",
            });
        }

        let updatedByVal = Array.isArray(UpdatedBy) ? UpdatedBy[0] : UpdatedBy;
        if (!updatedByVal) updatedByVal = "Admin Panel";

        if (parseInt(TimelineID, 10) > 0) {
            const getOldSql =
                "SELECT TimelineImage FROM mst_ourtimelinedata WHERE TimelineID = ?";
            db.query(getOldSql, [TimelineID], (err, oldResults) => {
                if (err || oldResults.length === 0) {
                    return res
                        .status(400)
                        .json({ success: false, message: "Invalid TimelineID" });
                }

                const old = oldResults[0];
                const finalTimelineImage = TimelineImage || old.TimelineImage;

                const updateSql = `
          UPDATE mst_ourtimelinedata SET
            TimelineName = ?, TimelineNameURL = ?, TimelineImage = ?,
            TimelineYear = ?, Description = ?, ActiveStatus = ?, DisplayOrder = ?,
            UpdatedBy = ?, UpdatedOn = ?
          WHERE TimelineID = ?
        `;

                db.query(
                    updateSql,
                    [
                        TimelineName,
                        TimelineNameURL,
                        finalTimelineImage,
                        TimelineYear,
                        Description,
                        activeStatusVal,
                        displayOrderVal,
                        updatedByVal,
                        currentTime,
                        TimelineID,
                    ],
                    (err) => {
                        if (err)
                            return res
                                .status(500)
                                .json({ success: false, message: "Update failed" });
                        return res.json({
                            success: true,
                            message: "Timeline updated successfully",
                        });
                    }
                );
            });
        } else {
            const insertSql = `
        INSERT INTO mst_ourtimelinedata (
          TimelineName, TimelineNameURL, TimelineImage, TimelineYear,
          Description, ActiveStatus, DisplayOrder, PostedDate, UpdatedBy, UpdatedOn
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

            db.query(
                insertSql,
                [
                    TimelineName,
                    TimelineNameURL,
                    TimelineImage,
                    TimelineYear,
                    Description,
                    activeStatusVal,
                    displayOrderVal,
                    currentTime,
                    updatedByVal,
                    currentTime,
                ],
                (err) => {
                    if (err)
                        return res
                            .status(500)
                            .json({ success: false, message: err.message });
                    return res.json({
                        success: true,
                        message: "Timeline created successfully",
                    });
                }
            );
        }
    });
};

// DELETE timeline
exports.deleteTimeline = (req, res) => {
    const TimelineID = req.params.TimelineID;
    const sql = "DELETE FROM mst_ourtimelinedata WHERE TimelineID = ?";

    db.query(sql, [TimelineID], (err, result) => {
        if (err)
            return res
                .status(500)
                .json({ success: false, message: "Database error" });
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Timeline not found" });
        }
        res.json({ success: true, message: "Timeline deleted successfully" });
    });
};

exports.updateTimelineDisplayOrder = (req, res) => {
    const updates = req.body;
    if (!Array.isArray(updates)) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid data format" });
    }
    const updatePromises = updates.map(({ TimelineID, DisplayOrder }) => {
        return new Promise((resolve, reject) => {
            const sql =
                "UPDATE mst_ourtimelinedata SET DisplayOrder = ? WHERE TimelineID  = ?";
            db.query(sql, [DisplayOrder, TimelineID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
    Promise.all(updatePromises)
        .then(() =>
            res.json({
                success: true,
                message: "Timeline display order updated successfully",
            })
        )
        .catch((err) => {
            console.error("Error updating Timeline display order:", err);
            res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message,
            });
        });
};

//Update status
exports.updateActiveStatus = (req, res) => {
    let { TimelineID, ActiveStatus } = req.body;
    TimelineID = parseInt(TimelineID, 10);
    ActiveStatus = parseInt(ActiveStatus, 10);
    if (isNaN(TimelineID) || isNaN(ActiveStatus)) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid ID or ActiveStatus" });
    }
    const sql = `
    UPDATE mst_ourtimelinedata 
    SET ActiveStatus = ?, UpdatedOn = NOW() 
    WHERE TimelineID = ?
  `;
    db.query(sql, [ActiveStatus, TimelineID], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);
            return res
                .status(500)
                .json({ success: false, message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, message: "TimelineID not found" });
        }

        res.json({ success: true, message: "Status updated successfully" });
    });
};


// Max Display Order
exports.getMaxDisplayOrder = (req, res) => {
    const sql = `SELECT MAX(DisplayOrder) AS maxOrder FROM mst_ourtimelinedata`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        const maxOrder = results[0]?.maxOrder || 0;
        res.json({ maxOrder });
    });
};


// GET all active histories
exports.getAllTimelinesdata = (req, res) => {
    const sql = `SELECT * FROM mst_ourtimelinedata WHERE ActiveStatus = 1 ORDER BY DisplayOrder  ASC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message,
            });
        }
        res.json({ success: true, data: results });
    });
};
