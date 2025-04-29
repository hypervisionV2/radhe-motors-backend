const userService = require('../services/userService');
const { successResponse, paginationMeta } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');
const { PAGINATION } = require('../config/app');

/**
 * @desc    Get all users with filtering and pagination
 * @route   GET /api/users
 * @access  Private (Admin/Employee)
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const {
        search,
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT
    } = req.query;

    // Build filters object
    const filters = {};
    if (search) filters.search = search;

    const result = await userService.getAllUsers(
        filters,
        parseInt(page, 10),
        parseInt(limit, 10)
    );

    return successResponse(
        res,
        200,
        'Users retrieved successfully',
        result.users,
        paginationMeta(result.pagination.total, parseInt(page, 10), parseInt(limit, 10))
    );
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin/Employee)
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, 'User retrieved successfully', user);
});

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private (Admin/Employee)
 */
const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    return successResponse(res, 201, 'User created successfully', user);
});

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Private (Admin/Employee)
 */
const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, 200, 'User updated successfully', user);
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
});

/**
 * @desc    Add a vehicle to user's interested vehicles
 * @route   POST /api/users/:id/interest
 * @access  Private (Admin/Employee)
 */
const addVehicleInterest = asyncHandler(async (req, res) => {
    const { vehicleId } = req.body;

    if (!vehicleId) {
        return res.status(400).json({
            status: 'error',
            message: 'Vehicle ID is required'
        });
    }

    const user = await userService.addVehicleInterest(req.params.id, vehicleId);
    return successResponse(res, 200, 'Vehicle interest added successfully', user);
});

/**
 * @desc    Add contact history to a user
 * @route   POST /api/users/:id/contact
 * @access  Private (Admin/Employee)
 */
const addContactHistory = asyncHandler(async (req, res) => {
    const { notes, status, employeeId } = req.body;

    if (!notes || !status) {
        return res.status(400).json({
            status: 'error',
            message: 'Notes and status are required'
        });
    }

    const user = await userService.addContactHistory(req.params.id, employeeId, notes, status);
    return successResponse(res, 200, 'Contact history added successfully', user);
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addVehicleInterest,
    addContactHistory
};