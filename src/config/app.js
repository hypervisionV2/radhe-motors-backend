
/**
 * Application configuration settings
 */
module.exports = {
    /**
     * Common error messages
     */
    ERROR_MESSAGES: {
        INVALID_ID: 'Invalid ID format',
        NOT_FOUND: 'Resource not found',
        SERVER_ERROR: 'Server error occurred',
        VALIDATION_ERROR: 'Validation error',
    },

    /**
     * Pagination defaults
     */
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },

    /**
     * Status values for appointments
     */
    APPOINTMENT_STATUS: {
        PENDING: 'Pending',
        CONFIRMED: 'Confirmed',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
    },

    /**
     * Vehicle types
     */
    VEHICLE_TYPES: {
        SCOOTER: 'Scooter',
        MOTORCYCLE: 'Motorcycle',
        THREEWHEELER: '3-Wheeler',
    },
};