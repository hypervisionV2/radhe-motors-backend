const express = require('express');
const {
    getActiveCarouselItems
} = require('../controllers/carouselController');

const router = express.Router();

// GET /api/carousel - Get all active carousel items
router.get('/', getActiveCarouselItems);

module.exports = router;