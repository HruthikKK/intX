import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract userId from request parameters
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Assuming you're using Mongoose or similar ORM/ODM
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser, // Optional: Return the deleted user details if needed
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error deleting user:", error);

    // Send an error response
    res
      .status(500)
      .clearCookie('token')
      .json({
      message: "An error occurred while deleting the user",
      error: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  const { userId, username, email } = req.body;

  if (!userId || !username || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check for unique username
    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists._id.toString() !== userId) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Check for unique email
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({ message: "Email is already taken." });
    }

    // Update user details
    user.username = username;
    user.email = email;

    await user.save();

    // Clear the authentication cookie (assuming it's named 'authToken')
    res.clearCookie("token", { httpOnly: true});

    res.status(200).json({
      message: "User updated successfully. Please sign in again.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

