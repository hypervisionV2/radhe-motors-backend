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

/**
 * @desc    Create a new carousel item
 * @route   POST /api/carousel
 * @access  Private (Admin)
 */
const createCarouselItem = asyncHandler(async (req, res) => {
    const carouselItem = await carouselService.createCarouselItem(req.body);
    return successResponse(res, 201, 'Carousel item created successfully', carouselItem);
});

/**
 * @desc    Update a carousel item
 * @route   PUT /api/carousel/:id
 * @access  Private (Admin)
 */
const updateCarouselItem = asyncHandler(async (req, res) => {
    const carouselItem = await carouselService.updateCarouselItem(req.params.id, req.body);
    return successResponse(res, 200, 'Carousel item updated successfully', carouselItem);
});

/**
 * @desc    Delete a carousel item
 * @route   DELETE /api/carousel/:id
 * @access  Private (Admin)
 */
const deleteCarouselItem = asyncHandler(async (req, res) => {
    await carouselService.deleteCarouselItem(req.params.id);
    return successResponse(res, 200, 'Carousel item deleted successfully');
});

module.exports = {
    getActiveCarouselItems,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem
};