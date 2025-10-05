import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log('Admin login:', formData);
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
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Portal
          </button>
          <div className="login-brand">
            <div className="brand-logo">BF</div>
            <div>
              <h1>Administrative System</h1>
              <p>Bright Future Academy</p>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-header">
            <div className="security-badge">
              <span className="security-icon">🔒</span>
              Secure Access Required
            </div>
            <h2>Administrator Login</h2>
            <p>Restricted access to school management system</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Administrator ID</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter administrator ID"
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

            <div className="form-group">
              <label htmlFor="securityCode">
                Security Code
                <span className="label-hint">(Provided by IT Department)</span>
              </label>
              <input
                type="text"
                id="securityCode"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                placeholder="Enter security code"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>This is a secure device</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Authenticate & Access System
            </button>
          </form>

          <div className="security-notice">
            <div className="notice-header">
              <span className="notice-icon">⚠️</span>
              <h4>Security Notice</h4>
            </div>
            <ul className="notice-list">
              <li>This system contains sensitive information</li>
              <li>All activities are logged and monitored</li>
              <li>Unauthorized access is prohibited</li>
              <li>Report suspicious activity immediately</li>
            </ul>
          </div>

          <div className="admin-support">
            <p>For administrative access issues:</p>
            <div className="support-contacts">
              <a href="tel:+911234567890">IT Helpdesk: +91 12345 67890</a>
              <a href="mailto:it-support@bfacademy.edu">it-support@bfacademy.edu</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;