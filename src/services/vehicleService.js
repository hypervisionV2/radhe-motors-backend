const Vehicle = require('../models/vehicleModel');
const { ApiError } = require('../middleware/errorHandler');
const { PAGINATION, ERROR_MESSAGES } = require('../config/app');

/**
 * Get all vehicles with filtering and pagination
 * @param {Object} filters - Filter criteria
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<Object>} Vehicles and pagination data
 */
const getAllVehicles = async (filters = {}, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
    // Build query
    const query = { isActive: true };

    // Apply type filter
    if (filters.type) {
        query.type = filters.type;
    }

    // Apply price range filter
    if (filters.minPrice || filters.maxPrice) {
        query['price.base'] = {};
        if (filters.minPrice) {
            query['price.base'].$gte = Number(filters.minPrice);
        }
        if (filters.maxPrice) {
            query['price.base'].$lte = Number(filters.maxPrice);
        }
    }

    // Apply popularity filter
    if (filters.isPopular) {
        query.isPopular = filters.isPopular === 'true';
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
        Vehicle.find(query)
            .select('model name type price thumbnailUrl isPopular')
            .sort({ isPopular: -1, 'price.base': 1 })
            .skip(skip)
            .limit(limit),
        Vehicle.countDocuments(query)
    ]);

    return {
        vehicles,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
};

/**
 * Get vehicle by ID
 * @param {String} id - Vehicle ID
 * @returns {Promise<Object>} Vehicle data
 */
const getVehicleById = async (id) => {
    const vehicle = await Vehicle.findOne({ _id: id, isActive: true });

    if (!vehicle) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return vehicle;
};

/**
 * Create a new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise<Object>} Created vehicle
 */
const createVehicle = async (vehicleData) => {
    const vehicle = await Vehicle.create(vehicleData);
    return vehicle;
};

/**
 * Update a vehicle
 * @param {String} id - Vehicle ID
 * @param {Object} vehicleData - Updated vehicle data
 * @returns {Promise<Object>} Updated vehicle
 */
const updateVehicle = async (id, vehicleData) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        vehicleData,
        { new: true, runValidators: true }
    );

    if (!vehicle) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return vehicle;
};

/**
 * Delete a vehicle (soft delete)
 * @param {String} id - Vehicle ID
 * @returns {Promise<Boolean>} True if deleted successfully
 */
const deleteVehicle = async (id) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!vehicle) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return true;
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};