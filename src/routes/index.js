const express = require('express');
const vehicleRoutes = require('./vehicleRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const showroomRoutes = require('./showroomRoutes');
const carouselRoutes = require('./carouselRoutes');

const router = express.Router();

// Mount route groups
router.use('/vehicles', vehicleRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/showrooms', showroomRoutes);
router.use('/carousel', carouselRoutes);

module.exports = router;