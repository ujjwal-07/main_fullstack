import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [loading, setLoading] = useState(false); // Loader state for posting content
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', formData.file);
    data.append('email', localStorage.getItem("email"));

    setLoading(true); // Start loader

    try {
      const response = await axios.post('https://up-social-backend.onrender.com/posts/userpost', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post created successfully:', response.data);
      togglePopup(); // Close the popup after successful submission
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleLogout = () => {
    // Show loading while logging out
    setLoading(true);

    // Remove token and user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');

    // Navigate to login page after logout
    navigate('/login');
    setLoading(false); // Stop loader after navigating
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">LD_SOCIAL</h1>
        <div className="flex items-center space-x-4">
          {/* Upload Button */}
          <button
            className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
            onClick={togglePopup}
          >
            <FaUpload className="mr-2" />
            Upload
          </button>

          {/* Logout Button */}
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
            onClick={handleLogout}
          >
            {loading ? 'Logging Out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Loader when submitting a post or logging out */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter description"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* File Input */}
              <div>
                <label htmlFor="file" className="block text-gray-700 font-medium mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                  accept="image/*"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  onClick={togglePopup}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
