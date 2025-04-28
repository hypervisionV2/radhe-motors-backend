const Showroom = require('../models/showroomModel');
const { ApiError } = require('../middleware/errorHandler');
const { ERROR_MESSAGES } = require('../config/app');

/**
 * Get all active showrooms
 * @returns {Promise<Array>} List of active showrooms
 */
const getAllShowrooms = async () => {
    const showrooms = await Showroom.find({ isActive: true })
        .select('name address contact operatingHours imageUrls')
        .sort({ name: 1 });

    return showrooms;
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

module.exports = {
    getAllShowrooms,
    getShowroomById
};