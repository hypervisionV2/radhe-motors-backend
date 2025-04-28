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
};

module.exports = {
    validate,
    schemas,
};