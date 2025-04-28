const appointmentService = require('../services/appointmentService');
const { successResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Create new appointment
 * @route   POST /api/appointments
 * @access  Public
 */
const createAppointment = asyncHandler(async (req, res) => {
    const result = await appointmentService.createAppointment(req.body);

    return successResponse(
        res,
        201,
        'Appointment created successfully',
        {
            appointmentId: result.appointment._id,
            date: result.appointment.date,
            time: result.appointment.time,
            user: result.user
        }
    );
});

module.exports = {
    createAppointment
};