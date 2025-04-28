const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../config/app');

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: [true, 'Vehicle ID is required'],
        },
        showroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showroom',
            required: [true, 'Showroom ID is required'],
        },
        date: {
            type: Date,
            required: [true, 'Appointment date is required'],
        },
        time: {
            type: String,
            required: [true, 'Appointment time is required'],
        },
        purpose: {
            type: String,
            default: 'Test Ride',
        },
        status: {
            type: String,
            enum: Object.values(APPOINTMENT_STATUS),
            default: APPOINTMENT_STATUS.PENDING,
        },
        notes: {
            type: String,
        },
        attendedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for frequently queried fields
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ showroomId: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;