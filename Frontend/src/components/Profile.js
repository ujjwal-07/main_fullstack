import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false); // Track whether options are shown

  const toggleOptions = () => {
    setShowOptions((prev) => !prev); // Toggle the visibility of options
  };



  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        onClick={toggleOptions} // Show options when clicked
        className="text-gray-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Options */}
      {showOptions && (
        <div className="absolute top-5 left-0 bg-white shadow-lg rounded-md p-2 z-10 w-60">
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate('/viewProfile')}
            >
              View Your Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate('/viewPost')}
            >
              View Your Liked Posts
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate('/chat')}
            >
              Chat
            </li>
          </ul>
        </div>
      )}

      {/* Close options if clicked outside */}
      {showOptions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowOptions(false)}
        ></div>
      )}
    </div>
  );
};

export default Profile;
