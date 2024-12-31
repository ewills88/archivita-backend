const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// POST endpoint to save user data
router.post('/data', async (req, res) => {
    try {
        const { name, age } = req.body;

        // Validate input
        if (!name || !age) {
            return res.status(400).json({ message: 'Name and age are required.' });
        }

        // Save data to MongoDB
        const newUser = new User({ name, age });
        await newUser.save();

        res.json({
            message: `User ${name} added successfully!`,
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving user to the database',
            error: error.message
        });
    }
});

// GET endpoint to retrieve all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from MongoDB
        res.json(users); // Respond with the list of users
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users from the database',
            error: error.message
        });
    }
});

// PUT endpoint to update user data
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        // Validate input
        if (!name && !age) {
            return res.status(400).json({ message: 'At least one field (name or age) is required to update.' });
        }

        // Find the user by ID and update their details
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, age },
            { new: true, runValidators: true } // Return the updated user and validate input
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: `User ${id} updated successfully!`,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
});

// DELETE endpoint to remove a user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: `User ${id} deleted successfully!`,
            user: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
});

module.exports = router;