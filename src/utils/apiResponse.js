/**
 * Standard response format for API success
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} meta - Additional metadata (pagination, etc.)
 * @returns {Object} Formatted response
 */
const successResponse = (
    res,
    statusCode = 200,
    message = 'Success',
    data = null,
    meta = null
) => {
    const response = {
        status: 'success',
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    if (meta !== null) {
        response.meta = meta;
    }

    return res.status(statusCode).json(response);
};

/**
 * Format pagination metadata
 * @param {Number} total - Total number of items
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const paginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

module.exports = {
    successResponse,
    paginationMeta,
};