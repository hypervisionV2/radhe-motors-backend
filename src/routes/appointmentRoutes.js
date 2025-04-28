const express = require('express');
const {
    createAppointment
} = require('../controllers/appointmentController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// POST /api/appointments - Create new appointment
router.post('/', validate(schemas.createAppointment), createAppointment);

module.exports = router;