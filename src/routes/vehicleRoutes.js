const express = require('express');
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/vehicles - Get all vehicles with optional filters
router.get('/', getAllVehicles);

// GET /api/vehicles/:id - Get vehicle by ID
router.get('/:id', validate(schemas.vehicleId, 'params'), getVehicleById);

// POST /api/vehicles - Create new vehicle
router.post('/', validate(schemas.createVehicle), createVehicle);

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', validate(schemas.vehicleId, 'params'), validate(schemas.updateVehicle), updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', validate(schemas.vehicleId, 'params'), deleteVehicle);

module.exports = router;