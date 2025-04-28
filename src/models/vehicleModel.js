const mongoose = require('mongoose');
const { VEHICLE_TYPES } = require('../config/app');

const vehicleSchema = new mongoose.Schema(
    {
        model: {
            type: String,
            required: [true, 'Vehicle model is required'],
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Vehicle name is required'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Vehicle type is required'],
            enum: Object.values(VEHICLE_TYPES),
        },
        price: {
            base: {
                type: Number,
                required: [true, 'Base price is required'],
            },
            onRoad: {
                type: Number,
                required: [true, 'On road price is required'],
            },
            variants: [
                {
                    name: String,
                    price: Number,
                },
            ],
        },
        colors: [
            {
                name: {
                    type: String,
                    required: true,
                },
                hexCode: {
                    type: String,
                    required: true,
                },
                imageUrls: [String],
            },
        ],
        specifications: {
            engine: String,
            displacement: String,
            mileage: String,
            power: String,
            torque: String,
            brakes: String,
            suspension: String,
        },
        features: [String],
        imageUrls: [String],
        thumbnailUrl: String,
        brochureUrl: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for frequently queried fields
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ isActive: 1 });
vehicleSchema.index({ isPopular: 1 });
vehicleSchema.index({ 'price.base': 1 });

// Add full text search index
vehicleSchema.index({
    name: 'text',
    model: 'text',
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;