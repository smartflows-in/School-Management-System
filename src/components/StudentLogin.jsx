import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentLogin.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Student login:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="student-login">
      <div className="login-container">
        <div className="login-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Portal
          </button>
          <div className="login-brand">
            <div className="brand-logo">BF</div>
            <div>
              <h1>Student Portal</h1>
              <p>Bright Future Academy</p>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Student Login</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your student ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Sign In to Portal
            </button>
          </form>

          <div className="login-help">
            <p>Need help accessing your account?</p>
            <a href="#help">Contact Student Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;