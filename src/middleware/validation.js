const Joi = require('joi');
const { ApiError } = require('./errorHandler');
const { ERROR_MESSAGES } = require('../config/app');

/**
 * Middleware to validate request data against Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (!error) {
            next();
        } else {
            const errors = error.details.map((detail) => detail.message);
            next(new ApiError(ERROR_MESSAGES.VALIDATION_ERROR, 400, errors));
        }
    };
};

/**
 * Common validation schemas
 */
const schemas = {
    // Vehicle ID validation
    vehicleId: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.INVALID_ID,
                'any.required': 'Vehicle ID is required',
            }),
    }),

    // Pagination params validation
    pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    }),

    // Appointment creation validation
    createAppointment: Joi.object({
        vehicleId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.INVALID_ID,
                'any.required': 'Vehicle ID is required',
            }),
        showroomId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.INVALID_ID,
                'any.required': 'Showroom ID is required',
            }),
        date: Joi.date().greater('now').required().messages({
            'date.greater': 'Appointment date must be in the future',
            'any.required': 'Appointment date is required',
        }),
        time: Joi.string().required().messages({
            'any.required': 'Appointment time is required',
        }),
        purpose: Joi.string(),
        // User details
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        phone: Joi.string().required().messages({
            'any.required': 'Phone number is required',
        }),
        email: Joi.string().email(),
        vehicleColor: Joi.string(),
    }),

    // Update appointment validation
    updateAppointment: Joi.object({
        date: Joi.date().greater('now'),
        time: Joi.string(),
        purpose: Joi.string(),
        status: Joi.string().valid(
            'Pending',
            'Confirmed',
            'Completed',
            'Cancelled'
        ),
        notes: Joi.string(),
        attendedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    }),

    // Create vehicle validation
    createVehicle: Joi.object({
        model: Joi.string().required().messages({
            'any.required': 'Model is required',
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        type: Joi.string().valid('Scooter', 'Motorcycle', '3-Wheeler').required().messages({
            'any.required': 'Type is required',
            'any.only': 'Type must be one of: Scooter, Motorcycle, 3-Wheeler',
        }),
        price: Joi.object({
            base: Joi.number().required().messages({
                'any.required': 'Base price is required',
            }),
            onRoad: Joi.number().required().messages({
                'any.required': 'On road price is required',
            }),
            variants: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required(),
                })
            ),
        }).required(),
        colors: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                hexCode: Joi.string().required(),
                imageUrls: Joi.array().items(Joi.string()),
            })
        ),
        specifications: Joi.object({
            engine: Joi.string(),
            displacement: Joi.string(),
            mileage: Joi.string(),
            power: Joi.string(),
            torque: Joi.string(),
            brakes: Joi.string(),
            suspension: Joi.string(),
        }),
        features: Joi.array().items(Joi.string()),
        imageUrls: Joi.array().items(Joi.string()),
        thumbnailUrl: Joi.string(),
        brochureUrl: Joi.string(),
        isActive: Joi.boolean().default(true),
        isPopular: Joi.boolean().default(false),
    }),

    // Update vehicle validation
    updateVehicle: Joi.object({
        model: Joi.string(),
        name: Joi.string(),
        type: Joi.string().valid('Scooter', 'Motorcycle', '3-Wheeler'),
        price: Joi.object({
            base: Joi.number(),
            onRoad: Joi.number(),
            variants: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required(),
                })
            ),
        }),
        colors: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                hexCode: Joi.string().required(),
                imageUrls: Joi.array().items(Joi.string()),
            })
        ),
        specifications: Joi.object({
            engine: Joi.string(),
            displacement: Joi.string(),
            mileage: Joi.string(),
            power: Joi.string(),
            torque: Joi.string(),
            brakes: Joi.string(),
            suspension: Joi.string(),
        }),
        features: Joi.array().items(Joi.string()),
        imageUrls: Joi.array().items(Joi.string()),
        thumbnailUrl: Joi.string(),
        brochureUrl: Joi.string(),
        isActive: Joi.boolean(),
        isPopular: Joi.boolean(),
    }),

    // Create showroom validation
    createShowroom: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        address: Joi.object({
            street: Joi.string().required().messages({
                'any.required': 'Street is required',
            }),
            city: Joi.string().required().messages({
                'any.required': 'City is required',
            }),
            state: Joi.string().required().messages({
                'any.required': 'State is required',
            }),
            pincode: Joi.string().required().messages({
                'any.required': 'Pincode is required',
            }),
            landmark: Joi.string(),
        }).required(),
        contact: Joi.object({
            phone: Joi.string().required().messages({
                'any.required': 'Phone number is required',
            }),
            email: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Must be a valid email',
            }),
            alternatePhone: Joi.string(),
        }).required(),
        geoLocation: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number(),
        }),
        operatingHours: Joi.object({
            monday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            tuesday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            wednesday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            thursday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            friday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            saturday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            sunday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
        }),
        imageUrls: Joi.array().items(Joi.string()),
        isActive: Joi.boolean().default(true),
    }),

    // Update showroom validation
    updateShowroom: Joi.object({
        name: Joi.string(),
        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string(),
            landmark: Joi.string(),
        }),
        contact: Joi.object({
            phone: Joi.string(),
            email: Joi.string().email(),
            alternatePhone: Joi.string(),
        }),
        geoLocation: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number(),
        }),
        operatingHours: Joi.object({
            monday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            tuesday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            wednesday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            thursday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            friday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            saturday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
            sunday: Joi.object({
                open: Joi.string().required(),
                close: Joi.string().required(),
            }),
        }),
        imageUrls: Joi.array().items(Joi.string()),
        isActive: Joi.boolean(),
    }),

    // Create user validation
    createUser: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        email: Joi.string().email(),
        phone: Joi.string().required().messages({
            'any.required': 'Phone number is required',
        }),
        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string(),
        }),
    }),

    // Update user validation
    updateUser: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string(),
        }),
    }),

    // Carousel item creation validation
    createCarouselItem: Joi.object({
        title: Joi.string().required().messages({
            'any.required': 'Title is required',
        }),
        description: Joi.string(),
        imageUrl: Joi.string().required().uri().messages({
            'any.required': 'Image URL is required',
            'string.uri': 'Image URL must be a valid URI',
        }),
        linkUrl: Joi.string(),
        altText: Joi.string().required().messages({
            'any.required': 'Alt text is required for accessibility',
        }),
        isActive: Joi.boolean().default(true),
        displayOrder: Joi.number().integer().min(0).default(0),
        startDate: Joi.date(),
        endDate: Joi.date().min(Joi.ref('startDate')).messages({
            'date.min': 'End date must be after start date',
        }),
    }),

    // Carousel item update validation
    updateCarouselItem: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        imageUrl: Joi.string().uri().messages({
            'string.uri': 'Image URL must be a valid URI',
        }),
        linkUrl: Joi.string(),
        altText: Joi.string(),
        isActive: Joi.boolean(),
        displayOrder: Joi.number().integer().min(0),
        startDate: Joi.date(),
        endDate: Joi.date().min(Joi.ref('startDate')).messages({
            'date.min': 'End date must be after start date',
        }),
    }),
};

module.exports = {
    validate,
    schemas,
};