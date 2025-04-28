require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

// Set port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB()
    .then(() => {
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});