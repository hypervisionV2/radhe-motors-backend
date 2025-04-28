const express = require('express');
const {
    getAllShowrooms,
    getShowroomById
} = require('../controllers/showroomController');

const router = express.Router();

// GET /api/showrooms - Get all active showrooms
router.get('/', getAllShowrooms);

// GET /api/showrooms/:id - Get showroom by ID
router.get('/:id', getShowroomById);

module.exports = router;