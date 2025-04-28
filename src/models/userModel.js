const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        interestedVehicles: [
            {
                vehicleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehicle',
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        contactHistory: [
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                employeeId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Employee',
                },
                notes: String,
                status: String,
            },
        ],
        purchasedVehicles: [
            {
                vehicleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehicle',
                },
                saleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Sale',
                },
                purchaseDate: Date,
                registrationNumber: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create indexes for frequently queried fields
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;