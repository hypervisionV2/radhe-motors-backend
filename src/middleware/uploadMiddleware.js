const multer = require('multer');
const { ApiError } = require('./errorHandler');

// Configure storage to use memory storage (files will be in buffer)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ApiError('Only image files are allowed!', 400), false);
    }
};

// Upload middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter,
});

module.exports = {
    upload,
};