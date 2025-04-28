const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema(
    {
        open: {
            type: String,
            required: true,
        },
        close: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const showroomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Showroom name is required'],
            trim: true,
        },
        address: {
            street: {
                type: String,
                required: [true, 'Street address is required'],
            },
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            state: {
                type: String,
                required: [true, 'State is required'],
            },
            pincode: {
                type: String,
                required: [true, 'Pincode is required'],
            },
            landmark: String,
        },
        contact: {
            phone: {
                type: String,
                required: [true, 'Phone number is required'],
            },
            email: {
                type: String,
                required: [true, 'Email is required'],
            },
            alternatePhone: String,
        },
        geoLocation: {
            latitude: Number,
            longitude: Number,
        },
        operatingHours: {
            monday: operatingHoursSchema,
            tuesday: operatingHoursSchema,
            wednesday: operatingHoursSchema,
            thursday: operatingHoursSchema,
            friday: operatingHoursSchema,
            saturday: operatingHoursSchema,
            sunday: operatingHoursSchema,
        },
        imageUrls: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for frequently queried fields
showroomSchema.index({ 'address.city': 1 });
showroomSchema.index({ 'address.state': 1 });
showroomSchema.index({ isActive: 1 });

const Showroom = mongoose.model('Showroom', showroomSchema);

module.exports = Showroom;