import React, { useState } from 'react';

const Profile = () => {
  const [showOptions, setShowOptions] = useState(false); // Track whether options are shown

  const toggleOptions = () => {
    setShowOptions((prev) => !prev); // Toggle the visibility of options
  };

  return (
    <div className="relative">
      {/* Profile Picture */}
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        className="w-16 h-16 rounded-full cursor-pointer border-2 border-blue-600"
        onClick={toggleOptions} // Show options when clicked
      />

      {/* Options */}
      {showOptions && (
        <div className="absolute top-20 left-0 bg-white shadow-lg rounded-md p-2 z-10">
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => alert('View Profile clicked')}
            >
              View Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => alert('Settings clicked')}
            >
              Settings
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => alert('Logout clicked')}
            >
              Logout
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
