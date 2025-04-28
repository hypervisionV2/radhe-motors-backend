const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Upload a file to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {String} folder - Destination folder in Cloudinary
 * @returns {Promise<Object>} Upload result
 */
const uploadToCloudinary = async (buffer, folder) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new ApiError('Error uploading file to Cloudinary', 500);
    }
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - Public ID of the file
 * @returns {Promise<Object>} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new ApiError('Error deleting file from Cloudinary', 500);
    }
};

/**
 * Get the folder name based on entity type
 * @param {String} entityType - Type of entity (vehicle, carousel, showroom)
 * @returns {String} Folder name
 */
const getFolderName = (entityType) => {
    const validTypes = ['vehicles', 'carousel', 'showrooms', 'general'];

    if (!validTypes.includes(entityType)) {
        return 'general';
    }

    return `tvs-rs-automotive/${entityType}`;
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getFolderName
};