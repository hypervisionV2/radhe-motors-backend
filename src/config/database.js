const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection promise
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise} MongoDB disconnection promise
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    } catch (error) {
        console.error(`Error disconnecting from MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = {
    connectDB,
    disconnectDB
};