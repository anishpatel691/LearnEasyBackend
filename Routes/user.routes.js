import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../Midellwere/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/', verifyToken, getAllUsers); // Get all users

export default router;
