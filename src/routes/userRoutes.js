const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addVehicleInterest,
    addContactHistory
} = require('../controllers/userController');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create a new user
router.post('/', validate(schemas.createUser), createUser);

// PUT /api/users/:id - Update a user
router.put('/:id', validate(schemas.updateUser), updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', deleteUser);

// POST /api/users/:id/interest - Add vehicle interest
router.post('/:id/interest', addVehicleInterest);

// POST /api/users/:id/contact - Add contact history
router.post('/:id/contact', addContactHistory);

module.exports = router;