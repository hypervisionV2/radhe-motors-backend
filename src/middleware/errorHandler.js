const mongoose = require('mongoose');
const { ERROR_MESSAGES } = require('../config/app');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = 500;
    let message = ERROR_MESSAGES.SERVER_ERROR;
    let errors = [];

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = ERROR_MESSAGES.VALIDATION_ERROR;
        errors = Object.values(err.errors).map((val) => val.message);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please use another value`;
    }

    // Mongoose cast error (invalid ID)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = ERROR_MESSAGES.INVALID_ID;
    }

    // Custom defined errors
    if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
        if (err.errors && Array.isArray(err.errors)) {
            errors = err.errors;
        }
    }

    res.status(statusCode).json({
        status: 'error',
        message,
        errors: errors.length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
    errorHandler,
    ApiError,
    asyncHandler,
};