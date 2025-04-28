const vehicleService = require('../services/vehicleService');
const { successResponse, paginationMeta } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');
const { PAGINATION } = require('../config/app');

/**
 * @desc    Get all vehicles with filtering and pagination
 * @route   GET /api/vehicles
 * @access  Public
 */
const getAllVehicles = asyncHandler(async (req, res) => {
    const {
        type,
        minPrice,
        maxPrice,
        isPopular,
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT
    } = req.query;

    // Build filters object
    const filters = {};
    if (type) filters.type = type;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (isPopular) filters.isPopular = isPopular;

    const result = await vehicleService.getAllVehicles(
        filters,
        parseInt(page, 10),
        parseInt(limit, 10)
    );

    return successResponse(
        res,
        200,
        'Vehicles retrieved successfully',
        result.vehicles,
        paginationMeta(result.pagination.total, parseInt(page, 10), parseInt(limit, 10))
    );
});

/**
 * @desc    Get vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
const getVehicleById = asyncHandler(async (req, res) => {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return successResponse(res, 200, 'Vehicle retrieved successfully', vehicle);
});

module.exports = {
    getAllVehicles,
    getVehicleById
};