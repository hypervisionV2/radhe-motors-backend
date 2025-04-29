const User = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');
const { PAGINATION, ERROR_MESSAGES } = require('../config/app');

/**
 * Get all users with filtering and pagination
 * @param {Object} filters - Filter criteria
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<Object>} Users and pagination data
 */
const getAllUsers = async (filters = {}, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
    // Build query
    const query = {};

    // Apply search filter
    if (filters.search) {
        const searchRegex = new RegExp(filters.search, 'i');
        query.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex }
        ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select('name email phone interestedVehicles')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(query)
    ]);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
};

/**
 * Get user by ID
 * @param {String} id - User ID
 * @returns {Promise<Object>} User data
 */
const getUserById = async (id) => {
    const user = await User.findById(id)
        .populate('interestedVehicles.vehicleId', 'name model thumbnailUrl')
        .populate('contactHistory.employeeId', 'name');

    if (!user) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return user;
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
    // Check if user with this phone already exists
    const existingUser = await User.findOne({ phone: userData.phone });
    if (existingUser) {
        throw new ApiError('User with this phone number already exists', 400);
    }

    const user = await User.create(userData);
    return user;
};

/**
 * Update a user
 * @param {String} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (id, userData) => {
    // If changing phone number, check if it already exists
    if (userData.phone) {
        const existingUser = await User.findOne({
            phone: userData.phone,
            _id: { $ne: id }
        });

        if (existingUser) {
            throw new ApiError('User with this phone number already exists', 400);
        }
    }

    const user = await User.findByIdAndUpdate(
        id,
        userData,
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return user;
};

/**
 * Delete a user
 * @param {String} id - User ID
 * @returns {Promise<Boolean>} True if deleted successfully
 */
const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return true;
};

/**
 * Add a vehicle to user's interested vehicles
 * @param {String} userId - User ID
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Updated user
 */
const addVehicleInterest = async (userId, vehicleId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // Check if already interested
    const alreadyInterested = user.interestedVehicles.some(
        (item) => item.vehicleId.toString() === vehicleId
    );

    if (alreadyInterested) {
        return user; // Already interested, no need to update
    }

    // Add to interested vehicles
    user.interestedVehicles.push({
        vehicleId,
        date: new Date()
    });

    await user.save();

    return user;
};

/**
 * Add contact history to a user
 * @param {String} userId - User ID
 * @param {String} employeeId - Employee ID
 * @param {String} notes - Contact notes
 * @param {String} status - Contact status
 * @returns {Promise<Object>} Updated user
 */
const addContactHistory = async (userId, employeeId, notes, status) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // Add to contact history
    user.contactHistory.push({
        date: new Date(),
        employeeId,
        notes,
        status
    });

    await user.save();

    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addVehicleInterest,
    addContactHistory
};