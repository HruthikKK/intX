import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from "../app/features/userSlice"; 
import { apiClient } from "./Api.jsx";
import { apiFetch } from "./Api.jsx";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL || "https://intx.onrender.com"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("https://intx.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to sign in");
      }

      const result = await response.json();
      console.log("User Details:", result.user); // For debugging, remove in production

      setError(null);
      setFormData({ email: "", password: "" });
      setSuccess("SignIn Sucessfull")
      setLoading(false);
      dispatch(signInSuccess(result));

      // Redirect or do something with user data
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-screen">
        <div className="w-full md:w-2/3 flex items-center justify-center p-6 bg-gray-300">
          <div className="max-w-md w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm md:text-base">
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm md:text-base"
                />
              </div>
              {error && <p className="text-red-700 text-sm font-bold">{error}</p>}
              {success && <p className="text-green-700 text-sm font-bold">{success}</p>}
              <button
                type="submit"
                className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm md:text-base"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <div className="mt-6 text-center text-sm md:text-base">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 m-auto items-center justify-center p-10">
          <Link to="/" className="text-2xl sm:text-6xl font-semibold hover:text-gray-400">
            intX
          </Link>
          <p className="text-xl sm:text-3xl mt-5">Share your interview Experience</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
