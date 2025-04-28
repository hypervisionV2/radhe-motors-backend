const Carousel = require('../models/carouselModel');
const { ApiError } = require('../middleware/errorHandler');
const { ERROR_MESSAGES } = require('../config/app');

/**
 * Get all active carousel items
 * @returns {Promise<Array>} List of active carousel items
 */
const getActiveCarouselItems = async () => {
    const now = new Date();

    const items = await Carousel.find({
        isActive: true,
        $and: [
            {
                $or: [
                    { startDate: { $exists: false } },
                    { startDate: null },
                    { startDate: { $lte: now } }
                ]
            },
            {
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: null },
                    { endDate: { $gte: now } }
                ]
            }
        ]
    })
        .select('title description imageUrl linkUrl altText')
        .sort({ displayOrder: 1 });

    return items;
};

/**
 * Create a new carousel item
 * @param {Object} carouselData - Carousel item data
 * @returns {Promise<Object>} Created carousel item
 */
const createCarouselItem = async (carouselData) => {
    const carouselItem = await Carousel.create(carouselData);
    return carouselItem;
};

/**
 * Update a carousel item
 * @param {String} id - Carousel item ID
 * @param {Object} carouselData - Updated carousel item data
 * @returns {Promise<Object>} Updated carousel item
 */
const updateCarouselItem = async (id, carouselData) => {
    const carouselItem = await Carousel.findByIdAndUpdate(
        id,
        carouselData,
        { new: true, runValidators: true }
    );

    if (!carouselItem) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return carouselItem;
};

/**
 * Delete a carousel item
 * @param {String} id - Carousel item ID
 * @returns {Promise<Boolean>} True if deleted successfully
 */
const deleteCarouselItem = async (id) => {
    const result = await Carousel.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return true;
};

module.exports = {
    getActiveCarouselItems,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem
};