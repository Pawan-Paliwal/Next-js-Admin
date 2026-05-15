const db = require('../db');
const path = require('path');
const fs = require('fs');

const deleteOldFile = (folder, filePath) => {
    if (!filePath) return;
    const fullPath = path.join(__dirname, '../uploads/OnlineImages', folder, filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// Main Gallery Album / Video
exports.getAllGallery = (req, res) => {
    const sql = `SELECT * FROM mst_webgallerydatab ORDER BY galleryID DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
};

exports.getGalleryById = (req, res) => {
    const { galleryID } = req.query;
    if (!galleryID) return res.status(400).json({ success: false, message: 'Missing ID' });
    const sql = 'SELECT * FROM mst_webgallerydatab WHERE galleryID = ?';
    db.query(sql, [galleryID], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB Error' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: results[0] });
    });
};

exports.saveOrUpdateGallery = (req, res) => {
    const { galleryID, galleryType, galleryTitle, galleryVideoURL, activeStatus, updatedBy } = req.body;
    const galleryImage = req.files?.galleryImage?.[0]?.filename || null;

    const currentTime = new Date();

    if (galleryID) {
        const getOldSql = 'SELECT galleryImage FROM mst_webgallerydatab WHERE galleryID = ?';
        db.query(getOldSql, [galleryID], (err, oldResults) => {
            if (err || oldResults.length === 0) return res.status(400).json({ success: false, message: 'Invalid ID' });

            const finalImage = galleryImage || oldResults[0].galleryImage;
            if (galleryImage && oldResults[0].galleryImage && galleryImage !== oldResults[0].galleryImage) {
                deleteOldFile('GalleryImages', oldResults[0].galleryImage);
            }

            const updateSql = `UPDATE mst_webgallerydatab SET galleryType=?, galleryTitle=?, galleryImage=?, galleryVideoURL=?, activeStatus=?, updatedBy=?, updatedOn=? WHERE galleryID=?`;
            db.query(updateSql, [galleryType, galleryTitle, finalImage, galleryVideoURL, activeStatus, updatedBy, currentTime, galleryID], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Update failed', error: err });
                res.json({ success: true, message: 'Gallery updated successfully' });
            });
        });
    } else {
        const insertSql = `INSERT INTO mst_webgallerydatab (galleryType, galleryTitle, galleryImage, galleryVideoURL, activeStatus, updatedBy, postedDate, updatedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertSql, [galleryType, galleryTitle, galleryImage, galleryVideoURL, activeStatus, updatedBy, currentTime, currentTime], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Insert failed', error: err });
            res.json({ success: true, message: 'Gallery created successfully' });
        });
    }
};

exports.deleteGallery = (req, res) => {
    const { galleryID } = req.params;
    const getFilesSql = `SELECT galleryImage FROM mst_webgallerydatab WHERE galleryID = ?`;
    db.query(getFilesSql, [galleryID], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ success: false, message: 'ID not found' });
        const { galleryImage } = results[0];

        // Also get all photos in album to delete files
        const getPhotosSql = `SELECT photoImage FROM mst_webgalleryphotos WHERE galleryID = ?`;
        db.query(getPhotosSql, [galleryID], (err, photoResults) => {
            db.query('DELETE FROM mst_webgallerydatab WHERE galleryID = ?', [galleryID], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Delete failed' });

                if (galleryImage) deleteOldFile('GalleryImages', galleryImage);
                if (photoResults && photoResults.length > 0) {
                    photoResults.forEach(p => deleteOldFile('GalleryImages', p.photoImage));
                }

                res.json({ success: true, message: 'Gallery deleted successfully' });
            });
        });
    });
};

exports.updateGalleryStatus = (req, res) => {
    const { galleryID, activeStatus } = req.body;
    const sql = `UPDATE mst_webgallerydatab SET activeStatus = ?, updatedOn = NOW() WHERE galleryID = ?`;
    db.query(sql, [activeStatus, galleryID], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Status update failed' });
        res.json({ success: true, message: 'Status updated successfully' });
    });
};

// ALBUM PHOTOS
exports.getPhotosByGalleryId = (req, res) => {
    const { galleryID } = req.query;
    if (!galleryID) return res.status(400).json({ success: false, message: 'Missing Gallery ID' });
    const sql = `SELECT * FROM mst_webgalleryphotos WHERE galleryID = ? ORDER BY photoID DESC`;
    db.query(sql, [galleryID], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
};

exports.saveGalleryPhotos = (req, res) => {
    const { galleryID, updatedBy } = req.body;
    const photos = req.files?.photoImages;

    if (!photos || (Array.isArray(photos) && photos.length === 0)) {
        return res.status(400).json({ success: false, message: 'No photos uploaded' });
    }

    const values = photos.map(p => [galleryID, p.filename, updatedBy, new Date()]);
    const sql = `INSERT INTO mst_webgalleryphotos (galleryID, photoImage, updatedBy, updatedOn) VALUES ?`;
    db.query(sql, [values], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Photo upload failed', error: err });
        res.json({ success: true, message: 'Photos uploaded successfully' });
    });
};

exports.deleteGalleryPhoto = (req, res) => {
    const { photoID } = req.params;
    const sqlGet = `SELECT photoImage FROM mst_webgalleryphotos WHERE photoID = ?`;
    db.query(sqlGet, [photoID], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ success: false, message: 'Photo not found' });
        const { photoImage } = results[0];

        db.query('DELETE FROM mst_webgalleryphotos WHERE photoID = ?', [photoID], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Delete failed' });
            deleteOldFile('GalleryImages', photoImage);
            res.json({ success: true, message: 'Photo deleted successfully' });
        });
    });
};
