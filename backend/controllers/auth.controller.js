import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const signup = async (req, res, next) => {
    const { username, email, password, role } = req.body;
  
    if (
      !username ||
      !email ||
      !password ||
      username === '' ||
      email === '' ||
      password === ''
    ) {
      next(errorHandler(400, 'All fields are required'));
    }
  
    const hashedPassword = bcryptjs.hashSync(password, 10);
  
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });
  
    try {
      await newUser.save();
      res.json('Signup successfull');
    } catch (error) {
      console.log((error.message));
      next(error);
    }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET,);

    // Set JWT as cookie
    res.cookie("token", token, { httpOnly: true });

    // Send user details to the frontend
    res.status(200).json({ user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: error.message });
  }
};

export {signin, signup}