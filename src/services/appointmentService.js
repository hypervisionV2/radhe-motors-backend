const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Showroom = require('../models/showroomModel');
const { ApiError } = require('../middleware/errorHandler');
const { APPOINTMENT_STATUS, ERROR_MESSAGES, PAGINATION } = require('../config/app');

/**
 * Get all appointments with filters and pagination
 * @param {Object} filters - Filter criteria
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<Object>} Appointments and pagination data
 */
const getAllAppointments = async (filters = {}, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
    // Build query
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.date) {
        const startDate = new Date(filters.date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.date);
        endDate.setHours(23, 59, 59, 999);

        query.date = { $gte: startDate, $lte: endDate };
    }

    if (filters.showroomId) {
        query.showroomId = filters.showroomId;
    }

    if (filters.userId) {
        query.userId = filters.userId;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
        Appointment.find(query)
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name phone email')
            .populate('vehicleId', 'name model thumbnailUrl')
            .populate('showroomId', 'name address.city'),
        Appointment.countDocuments(query)
    ]);

    return {
        appointments,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
};

/**
 * Get appointment by ID
 * @param {String} id - Appointment ID
 * @returns {Promise<Object>} Appointment data
 */
const getAppointmentById = async (id) => {
    const appointment = await Appointment.findById(id)
        .populate('userId', 'name phone email')
        .populate('vehicleId', 'name model thumbnailUrl')
        .populate('showroomId', 'name address contact operatingHours');

    if (!appointment) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return appointment;
};

/**
 * Create appointment with user information
 * @param {Object} appointmentData - Appointment data including user info
 * @returns {Promise<Object>} Created appointment
 */
const createAppointment = async (appointmentData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract user data from appointment data
        const {
            name,
            phone,
            email,
            vehicleId,
            showroomId,
            vehicleColor
        } = appointmentData;

        // Verify vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            throw new ApiError('Vehicle not found', 404);
        }

        // Verify showroom exists
        const showroom = await Showroom.findById(showroomId);
        if (!showroom) {
            throw new ApiError('Showroom not found', 404);
        }

        // Check if user already exists
        let user = await User.findOne({ phone });

        // If user doesn't exist, create one
        if (!user) {
            user = await User.create({
                name,
                phone,
                email,
                interestedVehicles: [{
                    vehicleId,
                    date: new Date()
                }]
            });
        } else {
            // If user exists, update interested vehicles if not already interested
            const alreadyInterested = user.interestedVehicles.some(
                (item) => item.vehicleId.toString() === vehicleId
            );

            if (!alreadyInterested) {
                await User.findByIdAndUpdate(user._id, {
                    $push: {
                        interestedVehicles: {
                            vehicleId,
                            date: new Date()
                        }
                    }
                });
            }
        }

        // Create appointment
        const appointment = await Appointment.create({
            userId: user._id,
            vehicleId,
            showroomId,
            date: appointmentData.date,
            time: appointmentData.time,
            purpose: appointmentData.purpose || 'Test Ride',
            status: APPOINTMENT_STATUS.PENDING,
            notes: `Interested in ${vehicle.name} ${vehicleColor ? `(${vehicleColor})` : ''}`
        });

        await session.commitTransaction();

        return {
            appointment,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone
            }
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Update an appointment
 * @param {String} id - Appointment ID
 * @param {Object} appointmentData - Updated appointment data
 * @returns {Promise<Object>} Updated appointment
 */
const updateAppointment = async (id, appointmentData) => {
    const appointment = await Appointment.findByIdAndUpdate(
        id,
        appointmentData,
        { new: true, runValidators: true }
    );

    if (!appointment) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return appointment;
};

/**
 * Delete an appointment
 * @param {String} id - Appointment ID
 * @returns {Promise<Boolean>} True if deleted successfully
 */
const deleteAppointment = async (id) => {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
        throw new ApiError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return true;
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};