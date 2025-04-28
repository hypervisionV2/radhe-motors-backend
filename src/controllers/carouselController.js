const carouselService = require('../services/carouselService');
const { successResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all active carousel items
 * @route   GET /api/carousel
 * @access  Public
 */
const getActiveCarouselItems = asyncHandler(async (req, res) => {
    const items = await carouselService.getActiveCarouselItems();
    return successResponse(res, 200, 'Carousel items retrieved successfully', items);
});

module.exports = {
    getActiveCarouselItems
};