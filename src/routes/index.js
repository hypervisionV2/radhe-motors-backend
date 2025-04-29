const express = require('express');
const vehicleRoutes = require('./vehicleRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const showroomRoutes = require('./showroomRoutes');
const carouselRoutes = require('./carouselRoutes');
const uploadRoutes = require('./uploadRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Mount route groups
router.use('/vehicles', vehicleRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/showrooms', showroomRoutes);
router.use('/carousel', carouselRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);

module.exports = router;