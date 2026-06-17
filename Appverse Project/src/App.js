import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
 
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';
import AppList from './pages/AppList';
import Dashboard from './pages/Dashboard';
import DeveloperConsole from './pages/DeveloperConsole';
import AdminPanel from './pages/AdminPanel';
import MyDownloads from './pages/MyDownloads';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
 
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{textAlign:'center',padding:'50px'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};
 
const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/apps" element={<AppList />} />
        <Route path="/apps/:id" element={<AppDetails />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/developer" element={
          <ProtectedRoute roles={['DEVELOPER','ADMIN']}><DeveloperConsole /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['ADMIN']}><AdminPanel /></ProtectedRoute>
        } />
        <Route path="/my-downloads" element={
          <ProtectedRoute><MyDownloads /></ProtectedRoute>
        } />
        <Route path="/recommendations" element={
          <ProtectedRoute><Recommendations /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
       <ProtectedRoute><Analytics /></ProtectedRoute>
        } />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};
 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
 
export default App;
