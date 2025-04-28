const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running'
    });
});

// API Routes
app.use('/api', routes);

// Error Handler (should be the last middleware)
app.use(errorHandler);

// 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Resource not found - ${req.originalUrl}`
    });
});

module.exports = app;