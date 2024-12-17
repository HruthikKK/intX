import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu for small screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white">
      {/* Top: Logo and Sign In / Sign Up */}
      <div className="flex justify-between items-center p-4">

      {/* Center: Navigation Links (Below the navbar on small screens) */}
      <div className="sm:hidden p-4">
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="text-2xl text-white focus:outline-none hover:text-gray-400"
        >
          {isMenuOpen ? 'X' : '☰'}
        </button>

        
      </div>
        {/* Left: Logo */}
        <div>
          <Link to="/" className="text-2xl sm:text-3xl font-semibold hover:text-gray-400">
            intX
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden sm:flex space-x-8 flex-1 justify-center">
          <Link to="/" className="text-lg sm:text-xl hover:text-gray-400">
            Home
          </Link>
          <Link to="/message" className="text-lg sm:text-xl hover:text-gray-400">
            Message
          </Link>
          <Link to="/about" className="text-lg sm:text-xl hover:text-gray-400">
            About
          </Link>
        </div>

        {/* Right: SignIn and SignUp Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/signin"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm sm:text-base"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
          <div className="flex flex-col items-center  p-2 space-y-4  bg-gray-700">
            <Link to="/" className="text-lg sm:text-xl hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/message" className="text-lg sm:text-xl hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
              Message
            </Link>
            <Link to="/about" className="text-lg sm:text-xl hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
          </div>
        )}
    </header>
  );
}

export default Header;