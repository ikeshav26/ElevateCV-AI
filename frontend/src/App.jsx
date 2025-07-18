import React, { useContext } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AppContext } from './context/ContextProvider';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import GenerateResume from './pages/GenerateResume';
import Resume from './pages/Resume';
import GenerateLetter from './pages/GenerateLetter';
import Letter from './pages/Letter';
import GetQNA from './pages/GetQNA';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    toast.error("Please login first");
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const { user } = useContext(AppContext);

  const hideHeaderFooter = ['/login', '/signup', '/reset-password'].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/profile" element={
          <ProtectedRoute user={user}><Profile /></ProtectedRoute>
        } />

        <Route path="/explore" element={
          <ProtectedRoute user={user}><Explore /></ProtectedRoute>
        } />

        <Route path="/generate-resume" element={
          <ProtectedRoute user={user}><GenerateResume /></ProtectedRoute>
        } />

        <Route path="/resume/:id" element={
          <ProtectedRoute user={user}><Resume /></ProtectedRoute>
        } />

        <Route path="/generate-letter" element={
          <ProtectedRoute user={user}><GenerateLetter /></ProtectedRoute>
        } />

        <Route path='/interview-prep' element={
          <ProtectedRoute user={user}><GetQNA/></ProtectedRoute>
        } />

        <Route path="/letter/:id" element={
          <ProtectedRoute user={user}><Letter /></ProtectedRoute>
        } />
      </Routes>

      {!hideHeaderFooter && <Footer />}
      <Toaster />
    </>
  );
};

export default App;