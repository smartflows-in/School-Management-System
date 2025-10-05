import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherLogin.css';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle teacher login logic here
    console.log('Teacher login:', formData);
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
    <div className="teacher-login">
      <div className="login-container">
        <div className="login-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Portal
          </button>
          <div className="login-brand">
            <div className="brand-logo">BF</div>
            <div>
              <h1>Faculty Portal</h1>
              <p>Bright Future Academy</p>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Faculty Login</h2>
            <p>Access your teaching dashboard and resources</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter your employee ID"
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
                <span>Remember this device</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Access Faculty Portal
            </button>
          </form>

          <div className="portal-features">
            <h4>Faculty Portal Features:</h4>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Grade Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <span>Assignment Creation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Student Progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Course Materials</span>
              </div>
            </div>
          </div>

          <div className="login-help">
            <p>Technical support for faculty members</p>
            <a href="mailto:faculty-support@bfacademy.edu">faculty-support@bfacademy.edu</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;