const Showroom = require('../models/showroomModel');
const { ApiError } = require('../middleware/errorHandler');
const { ERROR_MESSAGES } = require('../config/app');

/**
 * Get all active showrooms
 * @returns {Promise<Array>} List of active showrooms
 */
const getAllShowrooms = async () => {
    return Showroom.find({isActive: true})
        .select('name address contact operatingHours imageUrls')
        .sort({name: 1});
};

/**
 * Get showroom by ID
 * @param {String} id - Showroom ID
 * @returns {Promise<Object>} Showroom data
 */
const getShowroomById = async (id) => {
    const showroom = await Showroom.findOne({ _id: id, isActive: true });

    if (!showroom) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return showroom;
};

/**
 * Create a new showroom
 * @param {Object} showroomData - Showroom data
 * @returns {Promise<Object>} Created showroom
 */
const createShowroom = async (showroomData) => {
    const showroom = await Showroom.create(showroomData);
    return showroom;
};

/**
 * Update a showroom
 * @param {String} id - Showroom ID
 * @param {Object} showroomData - Updated showroom data
 * @returns {Promise<Object>} Updated showroom
 */
const updateShowroom = async (id, showroomData) => {
    const showroom = await Showroom.findByIdAndUpdate(
        id,
        showroomData,
        { new: true, runValidators: true }
    );

    if (!showroom) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return showroom;
};

/**
 * Delete a showroom (soft delete)
 * @param {String} id - Showroom ID
 * @returns {Promise<Boolean>} True if deleted successfully
 */
const deleteShowroom = async (id) => {
    const showroom = await Showroom.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!showroom) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return true;
};

module.exports = {
    getAllShowrooms,
    getShowroomById,
    createShowroom,
    updateShowroom,
    deleteShowroom
};