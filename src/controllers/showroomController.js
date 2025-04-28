const showroomService = require('../services/showroomService');
const { successResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all active showrooms
 * @route   GET /api/showrooms
 * @access  Public
 */
const getAllShowrooms = asyncHandler(async (req, res) => {
    const showrooms = await showroomService.getAllShowrooms();
    return successResponse(res, 200, 'Showrooms retrieved successfully', showrooms);
});

/**
 * @desc    Get showroom by ID
 * @route   GET /api/showrooms/:id
 * @access  Public
 */
const getShowroomById = asyncHandler(async (req, res) => {
    const showroom = await showroomService.getShowroomById(req.params.id);
    return successResponse(res, 200, 'Showroom retrieved successfully', showroom);
});

module.exports = {
    getAllShowrooms,
    getShowroomById
};