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
            throw new ApiError(ERROR_MESSAGES.VALIDATION_ERROR, 400, errors);
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
        linkUrl: Joi.string().uri().messages({
            'string.uri': 'Link URL must be a valid URI',
        }),
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
        linkUrl: Joi.string().uri().messages({
            'string.uri': 'Link URL must be a valid URI',
        }),
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