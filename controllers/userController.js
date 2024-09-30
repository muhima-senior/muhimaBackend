const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Assuming your user model is defined in this path

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' to use Gmail's service directly
    auth: {
        user: 'deemarabiah@gmail.com', 
        pass: 'jqxdheszvlvkpdum', 
    },
});

// Forget Password Route
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate a reset password code
        const resetPasswordCode = crypto.randomBytes(3).toString('hex');
        const resetPasswordExpiry = Date.now() + 6 * 60 * 60 * 1000; // Code expires in 6 hours

        // Update user with reset code and expiry
        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordExpiry = resetPasswordExpiry;
        await user.save();

        // Email options
        const mailOptions = {
            from: 'deemarabiah@gmail.com',
            to: email, // Send to user's email
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetPasswordCode}. It expires in 6 hours.`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error: error.message });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Reset code sent to your email' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending reset code', error: error.message });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            username,
            email,
            password: hashedPassword,
            userType,
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetCode } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        console.log(user);
        console.log(user.resetPasswordCode, resetCode);

        if (user.resetPasswordCode !== resetCode || user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
