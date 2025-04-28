const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        linkUrl: {
            type: String,
        },
        altText: {
            type: String,
            required: [true, 'Alt text is required for accessibility'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for frequently queried fields
carouselSchema.index({ isActive: 1 });
carouselSchema.index({ displayOrder: 1 });

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;