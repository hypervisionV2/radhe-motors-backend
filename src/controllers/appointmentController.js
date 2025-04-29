const appointmentService = require('../services/appointmentService');
const { successResponse, paginationMeta } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');
const { PAGINATION } = require('../config/app');

/**
 * @desc    Get all appointments with filtering and pagination
 * @route   GET /api/appointments
 * @access  Private
 */
const getAllAppointments = asyncHandler(async (req, res) => {
    const {
        status,
        date,
        showroomId,
        userId,
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT
    } = req.query;

    // Build filters object
    const filters = {};
    if (status) filters.status = status;
    if (date) filters.date = date;
    if (showroomId) filters.showroomId = showroomId;
    if (userId) filters.userId = userId;

    const result = await appointmentService.getAllAppointments(
        filters,
        parseInt(page, 10),
        parseInt(limit, 10)
    );

    return successResponse(
        res,
        200,
        'Appointments retrieved successfully',
        result.appointments,
        paginationMeta(result.pagination.total, parseInt(page, 10), parseInt(limit, 10))
    );
});

/**
 * @desc    Get appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    return successResponse(res, 200, 'Appointment retrieved successfully', appointment);
});

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

/**
 * @desc    Update appointment
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    return successResponse(res, 200, 'Appointment updated successfully', appointment);
});

/**
 * @desc    Delete appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
const deleteAppointment = asyncHandler(async (req, res) => {
    await appointmentService.deleteAppointment(req.params.id);
    return successResponse(res, 200, 'Appointment deleted successfully');
});

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};