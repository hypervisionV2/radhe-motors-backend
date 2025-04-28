const { successResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');
const uploadService = require('../services/uploadService');

/**
 * @desc    Upload an image to Cloudinary
 * @route   POST /api/uploads/:entityType
 * @access  Public (will be secured in future phases)
 */
const uploadImage = asyncHandler(async (req, res) => {
    // Check if file exists
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'No file uploaded',
        });
    }

    const entityType = req.params.entityType || 'general';
    const folder = uploadService.getFolderName(entityType);

    const result = await uploadService.uploadToCloudinary(req.file.buffer, folder);

    return successResponse(res, 201, 'Image uploaded successfully', {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
    });
});

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/uploads/:entityType/multiple
 * @access  Public (will be secured in future phases)
 */
const uploadMultipleImages = asyncHandler(async (req, res) => {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No files uploaded',
        });
    }

    const entityType = req.params.entityType || 'general';
    const folder = uploadService.getFolderName(entityType);

    const uploadPromises = req.files.map(file =>
        uploadService.uploadToCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
    }));

    return successResponse(res, 201, 'Images uploaded successfully', images);
});

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/uploads/:publicId
 * @access  Public (will be secured in future phases)
 */
const deleteImage = asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    if (!publicId) {
        return res.status(400).json({
            status: 'error',
            message: 'Public ID is required',
        });
    }

    await uploadService.deleteFromCloudinary(publicId);

    return successResponse(res, 200, 'Image deleted successfully');
});

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImage
};