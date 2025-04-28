
const express = require('express');
const {
    getAllVehicles,
    getVehicleById
} = require('../controllers/vehicleController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/vehicles - Get all vehicles with optional filters
router.get('/', getAllVehicles);

// GET /api/vehicles/:id - Get vehicle by ID
router.get('/:id', validate(schemas.vehicleId, 'params'), getVehicleById);

module.exports = router;