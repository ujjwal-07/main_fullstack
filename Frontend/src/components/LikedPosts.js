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
       <button
        onClick={() => navigate('/')} // Go back to the previous page
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Back
      </button>
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
 if(post.email_liked.includes(userEmail)){
 
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
}else{
  <h1>No Posts Liked</h1>
}
})}

      </div>

    


    </div>
  );
};
export default Posts;
