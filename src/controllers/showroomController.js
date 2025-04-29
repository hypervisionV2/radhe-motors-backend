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

/**
 * @desc    Create a new showroom
 * @route   POST /api/showrooms
 * @access  Private (Admin)
 */
const createShowroom = asyncHandler(async (req, res) => {
    const showroom = await showroomService.createShowroom(req.body);
    return successResponse(res, 201, 'Showroom created successfully', showroom);
});

/**
 * @desc    Update a showroom
 * @route   PUT /api/showrooms/:id
 * @access  Private (Admin)
 */
const updateShowroom = asyncHandler(async (req, res) => {
    const showroom = await showroomService.updateShowroom(req.params.id, req.body);
    return successResponse(res, 200, 'Showroom updated successfully', showroom);
});

/**
 * @desc    Delete a showroom
 * @route   DELETE /api/showrooms/:id
 * @access  Private (Admin)
 */
const deleteShowroom = asyncHandler(async (req, res) => {
    await showroomService.deleteShowroom(req.params.id);
    return successResponse(res, 200, 'Showroom deleted successfully');
});

module.exports = {
    getAllShowrooms,
    getShowroomById,
    createShowroom,
    updateShowroom,
    deleteShowroom
};