const express = require('express');
const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/appointments - Get all appointments with filtering
router.get('/', getAllAppointments);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', validate(schemas.createAppointment), createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', validate(schemas.updateAppointment), updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', deleteAppointment);

module.exports = router;