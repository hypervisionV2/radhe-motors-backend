const Carousel = require('../models/carouselModel');

/**
 * Get all active carousel items
 * @returns {Promise<Array>} List of active carousel items
 */
const getActiveCarouselItems = async () => {
    const now = new Date();

    const items = await Carousel.find({
        isActive: true,
        $and: [
            {
                $or: [
                    { startDate: { $exists: false } },
                    { startDate: null },
                    { startDate: { $lte: now } }
                ]
            },
            {
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: null },
                    { endDate: { $gte: now } }
                ]
            }
        ]
    })
        .select('title description imageUrl linkUrl altText')
        .sort({ displayOrder: 1 });

    return items;
};

module.exports = {
    getActiveCarouselItems
};