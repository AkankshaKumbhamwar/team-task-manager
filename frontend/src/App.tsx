import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProjectBoard from './components/ProjectBoard';
import './App.css';

const PrivateRoute: React.FC<{ children:any }> = ({ children }) => {
  const authContext = React.useContext(AuthContext);
  if (authContext?.loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  return authContext?.user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100"> 
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <PrivateRoute>
                  <ProjectBoard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;