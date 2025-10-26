import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPortal from './components/LoginPortal';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Admissions from './components/Admissions';
import NotFound from './components/NotFound';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  // Guard log for debug
  const AdminGuard = () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('Admin guard check:', { hasToken });
    if (hasToken) {
      console.log('Guard pass: Rendering admin dashboard');
      return <AdminDashboard />;
    } else {
      console.log('Guard fail: No token, redirecting to login');
      return <Navigate to="/admin-login" replace />;
    }
  };

  const StudentGuard = () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('Student guard check:', { hasToken });
    if (hasToken) {
      console.log('Guard pass: Rendering student dashboard');
      return <StudentDashboard />;
    } else {
      console.log('Guard fail: No token, redirecting to login');
      return <Navigate to="/student-login" replace />;
    }
  };

  const TeacherGuard = () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('Teacher guard check:', { hasToken });
    if (hasToken) {
      console.log('Guard pass: Rendering teacher dashboard');
      return <TeacherDashboard />;
    } else {
      console.log('Guard fail: No token, redirecting to login');
      return <Navigate to="/teacher-login" replace />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPortal />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminGuard />} />
          <Route path="/student-dashboard" element={<StudentGuard />} />
          <Route path="/teacher-dashboard" element={<TeacherGuard />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 