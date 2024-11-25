import React, { useState, useEffect, useRef } from 'react';
import {  FaChevronDown, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate  } from 'react-router-dom';
import LogoSvg from '../assets/svg/LogoSvg';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function Navbar() {

  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout()); 
  };


  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/my-profile');
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Practice", path: "/practice" },
    { name: "My Trades", path: "/my-trades" },
    
  ];

  // Close dropdown if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-10 py-4 border-b-2 bg-transparent text-black relative">
      {/* Left side: Logo */}
      <div className="flex items-center space-x-10">
        {/* Logo */}
        <LogoSvg />

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-lg">
          {navLinks.map((nav) => (
            <li key={nav.name}>
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  `hover:text-gray-600 ${
                    isActive
                      ? "text-black font-bold after:block after:border-b-4 after:border-[#0E8190] after:mt-1 after:translate-y-5"
                      : "text-[#9C9C9C]"
                  }`
                }
              >
                {nav.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Settings icon and user profile section for desktop */}
      <div className="hidden md:flex items-center space-x-4">
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-black">Username</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <FaChevronDown className="text-sm text-gray-700" />
          </div>

          {/* Dropdown Menu for Desktop */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 text-gray-800">
              <button    onClick={handleRedirect} className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                <FaUser className="mr-2" /> My Profile
              </button>
              <button  onClick={handleSignOut} className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-100 border-t">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-end">
          <div className="w-64 h-full bg-white p-6 flex flex-col relative">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-2xl text-gray-700 focus:outline-none"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            {/* User Profile Section */}
            <div className="flex items-center space-x-2 mb-6 mt-10">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-black">Username</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-col flex-grow space-y-4 text-sm mt-6">
              {navLinks.map((nav) => (
                <li key={nav.name}>
                  <NavLink
                    to={nav.path}
                    onClick={() => setMenuOpen(false)} // Close menu on link click
                    className={({ isActive }) =>
                      `block hover:text-gray-600 ${
                        isActive
                          ? "text-black border-b-2 border-black pb-1"
                          : "text-gray-700"
                      }`
                    }
                  >
                    {nav.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Sign Out Button at the Bottom */}
            <button className="mt-auto w-full flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 border-t">
              <span className="text-left">Sign Out</span>
              <FaSignOutAlt className="text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
