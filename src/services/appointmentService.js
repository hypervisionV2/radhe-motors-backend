const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Showroom = require('../models/showroomModel');
const { ApiError } = require('../middleware/errorHandler');
const { APPOINTMENT_STATUS, ERROR_MESSAGES } = require('../config/app');

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

module.exports = {
    createAppointment
};