import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Track login/signup state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  // Toggle between login and signup form
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Handle form submission (login/signup)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {};
    let apiUrl = '';

    setLoading(true); // Start the loader

    if (isLogin) {
      payload = { email, password };
      apiUrl = 'http://localhost:8000/user/login';
      try {
        const response = await axios.post(apiUrl, payload);
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('email', response.data.email.email);
        console.log('Success:', response.data);
        navigate('/');
      } catch (error) {
        alert(error.response.data);
        console.error(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // Stop loader
      }
    } else {
      payload = { fname, lname, email, password };
      apiUrl = 'http://localhost:8000/user/adduser';
      try {
        const response = await axios.post(apiUrl, payload);
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('email', response.data.email);
        console.log('Success:', response.data);
        navigate('/');
      } catch (error) {
        alert(error.response.data);
        console.error(error.response ? error.response.data : error.message);
        setEmail('');
        setFname('');
        setLname('');
        setPassword('');
        navigate("/login");
      } finally {
        setLoading(false); // Stop loader
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <div className="flex justify-center items-center">
          {loading ? (
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="fname" className="block text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="fname"
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lname" className="block text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lname"
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={toggleForm}
            className="text-indigo-600 font-semibold ml-2"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
