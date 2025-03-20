import jwt from 'jsonwebtoken';

import User from '../Models/user.model.js';

// Register User
export const registerUser = async (req, res) => {
  try {

    const { name, email, password ,role } = req.body;
    console.log("Incoming Data:", req.body);
    console.log("Incoming Data:", req.name); // Debugging
     // Debugging

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password ,role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//LOGIN CONTROLLER
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user ) {
      return res.status(401).json({ message: 'Invalid Email address' });
    }
    if ( user.password !== password) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' } // Token validity: 1 day
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.json({ message: 'Login successful' ,user,LoginSataus:true});
    console.log('Generated JWT Token:', token);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
