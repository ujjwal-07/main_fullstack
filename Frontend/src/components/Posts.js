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
  const [like, setLike] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  const [likedPosts, setLikedPosts] = useState({}); // To track liked posts

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

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', formData.file);
    data.append('email', localStorage.getItem('email'));

    try {
      const response = await axios.post(`http://localhost:8000/posts/userpost`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post created successfully:', response.data);
      togglePopup(); // Close the popup after successful submission
      navigate('/login');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/getpost`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.post(`http://localhost:8000/posts/delete`, { public_id: postId });
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post.');
    }
  };

  const handleUpdate = (post) => {
    setCurrentPost(post);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/posts/update`, {
        postId: currentPost,
        title,
        description,
      });

      if (response.data.success) {
        alert('Post updated successfully!');
        setShowModal(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update the post.');
    }
  };

  const toggleLike = async (postId) => {
    if(like === false){
      setLike(true)
    }else{
      setLike(false)
    }
    console.log(postId,like)

    setLikedPosts((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId],
    }));

    try {

      const response = await axios.post(`http://localhost:8000/posts/updateLike`, {
        postId: postId,
        email : localStorage.getItem("email")
      });

      
      if (response.data.Success) {
        if(console.log("Postssss",response.data.post.email == localStorage.getItem("email"))){
          alert(`${localStorage.getItem("email")} Some Liked your Post`)
        }
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update the post.');
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {posts.map((post) => {
  // Get the user's email (for example, from localStorage or state)
  const userEmail = localStorage.getItem('email'); // or use state if applicable
  // console.log(post)
  // Check if the email exists in the email_Liked array
  const like = post.email_liked && post.email_liked.includes(userEmail);
 console.log(like, "Like is this")
 const totalLike = post.email_liked.length
 console.log(totalLike)

  return (
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

      {/* Card Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mt-2">{post.description}</p>
      </div>

      {/* Like Button */}
      <div className="flex justify-center items-center p-4">
        <button
          onClick={() => toggleLike(post.imageName)}
          className={`text-2xl ${like ? 'text-red-500' : 'text-gray-600'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={like ? 'red' : 'none'}
            stroke={like ? 'none' : 'currentColor'}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>
        <span className="ml-2 text-gray-600">{totalLike}</span> {/* Show like count */}
      </div>
    </div>
  );
})}

      </div>

      {/* Modal for updating post */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center">Update Post</h2>

            <form>
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
                <button
                  onClick={() => {
                    handleSubmitUpdate();
                  }}
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
