const express = require('express');
const {
    getActiveCarouselItems,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem
} = require('../controllers/carouselController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/carousel - Get all active carousel items
router.get('/', getActiveCarouselItems);

// POST /api/carousel - Create a new carousel item
router.post('/', validate(schemas.createCarouselItem), createCarouselItem);

// PUT /api/carousel/:id - Update a carousel item
router.put('/:id', validate(schemas.updateCarouselItem), updateCarouselItem);

// DELETE /api/carousel/:id - Delete a carousel item
router.delete('/:id', deleteCarouselItem);

module.exports = router;