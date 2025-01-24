import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // Loading state
  const [menuOpen, setMenuOpen] = useState(null); // Tracks which card menu is open
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentPost, setCurrentPost] = useState(null); // State to store the post being updated
  const [title, setTitle] = useState(''); // State to store title input
  const [description, setDescription] = useState(''); // State to store description input
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

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
    data.append('email',localStorage.getItem("email"));

    try {
      const response = await axios.post('https://up-social-backend.onrender.com/posts/userpost', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post created successfully:', response.data);
      togglePopup(); // Close the popup after successful submission
      navigate("/login")

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };


  const navigate = useNavigate(); // For navigation

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://up-social-backend.onrender.com/posts/getpost');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts from the API
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Delete
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.post('https://up-social-backend.onrender.com/posts/delete', { public_id: postId });
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post.');
    }
  };



  // Handle Update (open modal)
  const handleUpdate = (post) => {
    setCurrentPost(post); // Set the post being updated
    setTitle(''); // Reset title field
    setDescription(''); // Reset description field
    setShowModal(true); // Show the modal
  };

  // Handle Update Submit
  const handleSubmitUpdate = async (e) => {

    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      const response = await axios.post('https://up-social-backend.onrender.com/posts/update', {
        postId: currentPost,
        title,
        description,
      });

      if (response.data.success) {
        alert('Post updated successfully!');
        setShowModal(false); // Close modal
        fetchPosts(); // Refresh the posts
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update the post.');
    }
  };

  if (loading) {
    return <p>Loading posts...</p>; // Show loading state
  }

  return (
    <div className="p-4 overflow-y-auto h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 relative"
          >
            {/* Card Image */}
            <div className="relative pb-56">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>

            {/* Hamburger Menu */}
            {/* <div className="absolute top-2 right-2">
              <button
                className="text-gray-700 bg-white p-2 rounded-full shadow-lg hover:text-indigo-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12h.01M12 12h.01M18 12h.01"
                  />
                </svg>
              </button>
              {menuOpen === post._id && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-10">
                  <button
                    onClick={() => handleUpdate(post)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div> */}

            {/* Card Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for updating post */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center">Update Post</h2>

            {/* Modal Form */}
            <form >
              <div className="mt-4">
                <label htmlFor="imageName" className="block text-sm font-medium text-gray-700">
                  Image Name:
                </label>
                <input
                  type="text"
                  id="imageName"
                  value={currentPost?.imageName || ''}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button onClick={()=>{handleSubmitUpdate()}}
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Posts;
