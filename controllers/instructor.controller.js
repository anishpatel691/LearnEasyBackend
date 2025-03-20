import Instructor from '../Models/Instructor.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register a new instructor
export const registerInstructor = async (req, res) => {
  const { name, email, password, bio, skills, profilePicture } = req.body;

  if (!name || !email || !password || !skills) {
    return res.status(400).json({ error: 'DB Call All required fields must be filled' });
  }

  try {
    // Check if the instructor already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ error: 'Instructor with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new instructor
    const instructor = new Instructor({
      name,
      email,
      password: hashedPassword,
      bio,
      skills,
      profilePicture,
    });

    const savedInstructor = await instructor.save();

    // Generate a token
    const token = jwt.sign({ id: savedInstructor._id, role: 'instructor' }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'Instructor registered successfully',
      instructor: savedInstructor,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};



export const loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(400).json({ error: ' Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password is Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: instructor._id, email: instructor.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000,    // 1 hour in milliseconds
    });

    res.json({ 
      message: 'Instructor logged in successfully',
      instructor,
      LoginSataus:true
     
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};


//getInstructorProfile 
export const getInstructorProfile = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id).select('-password');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};




