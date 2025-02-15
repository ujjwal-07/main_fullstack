import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/home"
import Login from "./components/login_Singup"
import ProtectedRoute from './components/ProtectedRoute';
import ViewProfile from './components/viewProfile';
import LikedPosts from "../src/components/LikedPosts"
import ChatApp from './components/chat';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/viewProfile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/viewPost" element={<LikedPosts />} />
        <Route path="/login" element={<Login />} />
        <Route path='/chat' element={<ChatApp />} />
      </Routes>
  </div>
  );
}

export default App;
