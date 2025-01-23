import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/home"
import Login from "./components/login_Singup"
import ProtectedRoute from './components/ProtectedRoute';
import ViewProfile from './components/viewProfile';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/viewProfile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />
      </Routes>
  </div>
  );
}

export default App;
