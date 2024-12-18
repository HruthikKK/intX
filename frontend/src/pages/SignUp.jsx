import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

function SignUp() {
  // Step 1: State for form data

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();

    const { username, email, password } = formData;

    // Validate input (simple validation)
    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      
      if (!response.ok) {
        console.log("not successful");
        const result = await response.json();
        throw new Error(result.message || "Failed to sign up");
      }
      
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      
      setError("");
      setSuccess("Signup successful!");
      setLoading(false)

      setTimeout(() => {
        navigate("/signin");
      }, 500);

    } catch (error) {
      console.error(error);
      setLoading(false)
      setError(error.message || "something worng");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header is already preloaded */}
      {/* Page Content */}
      <div className="flex h-screen">
        {/* Left Section - Form */}
        <div className="w-full md:w-2/3 flex items-center justify-center p-6 bg-gray-300">
          <div className="max-w-md w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Sign Up
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm md:text-base">
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm md:text-base"
                />
              </div>

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

              {/* Error message */}
              {error && <p className="text-red-700 text-sm font-bold">{error}</p>}
              {success && <p className="text-green-700 text-sm font-bold">{success}</p>}

              <button
                type="submit"
                className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm md:text-base"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Google Auth */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-200 text-sm md:text-base"
                >
                  <FaGoogle className="h-5 w-5 mr-2 text-gray-500" />
                  Sign Up with Google
                </button>
              </div>
            </form>

            {/* Already Have an Account */}
            <div className="mt-6 text-center text-sm md:text-base">
              <p>
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-600 hover:text-blue-800">
                  SignIn
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Image or Content */}
        <div className="flex-1 m-auto items-center justify-center p-10">
          <Link to="/" className="text-2xl sm:text-6xl font-semibold hover:text-gray-400">intX</Link>
          <p className="text-xl sm:text-3xl mt-5">
            Share your interview Experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
