const express = require('express');
const { upload } = require('../middleware/uploadMiddleware');
const {
    uploadImage,
    uploadMultipleImages,
    deleteImage
} = require('../controllers/uploadController');

const router = express.Router();

// POST /api/uploads/:entityType - Upload single image
router.post('/:entityType', upload.single('image'), uploadImage);

// POST /api/uploads/:entityType/multiple - Upload multiple images
router.post('/:entityType/multiple', upload.array('images', 10), uploadMultipleImages);

// DELETE /api/uploads/:publicId - Delete an image
router.delete('/:publicId', deleteImage);

module.exports = router;