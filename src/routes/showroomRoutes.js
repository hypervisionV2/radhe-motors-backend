const express = require('express');
const {
    getAllShowrooms,
    getShowroomById,
    createShowroom,
    updateShowroom,
    deleteShowroom
} = require('../controllers/showroomController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/showrooms - Get all active showrooms
router.get('/', getAllShowrooms);

// GET /api/showrooms/:id - Get showroom by ID
router.get('/:id', getShowroomById);

// POST /api/showrooms - Create a new showroom
router.post('/', validate(schemas.createShowroom), createShowroom);

// PUT /api/showrooms/:id - Update a showroom
router.put('/:id', validate(schemas.updateShowroom), updateShowroom);

// DELETE /api/showrooms/:id - Delete a showroom
router.delete('/:id', deleteShowroom);

module.exports = router;