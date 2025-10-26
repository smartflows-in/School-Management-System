import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Admin login attempt:', formData.email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();
      let payload;
      try {
        payload = JSON.parse(atob(idToken.split('.')[1]));
      } catch (decodeErr) {
        console.error('Token decode error:', decodeErr);
        throw new Error('Token decode failed—try again');
      }
      let role = payload.role;
      if (!role) {
        // FALLBACK for manual console user (admin@gmail.com)
        if (formData.email === 'admin@gmail.com') {
          role = 'admin';
          console.log('Fallback role: admin for manual user');
        } else {
          throw new Error('Role not set—contact admin');
        }
      }
      if (role !== 'admin') {
        throw new Error('Invalid role for admin login');
      }
      const userData = { 
        email: userCredential.user.email, 
        uid: userCredential.user.uid, 
        role: role
      };
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Admin login success, role:', role, 'navigating...');
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      console.error('Admin auth error:', err);
      setError(err.message || 'Login failed. Check credentials.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate('/');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <button className="back-btn" onClick={handleBack}>← Back to Portal</button>
          <div className="login-brand">
            <div className="brand-logo">BF</div>
            <div><h1>Administrative System</h1><p>Bright Future Academy</p></div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-header">
            <div className="security-badge"><span className="security-icon">🔒</span> Secure Access Required</div>
            <h2>Administrator Login</h2>
            <p>Restricted access to school management system</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Administrator ID (Email)</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={togglePassword} className="toggle-password-btn">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox"><input type="checkbox" /><span>This is a secure device</span></label>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Authenticate & Access System'}
            </button>
          </form>

          <div className="security-notice">
            <div className="notice-header"><span className="notice-icon">⚠️</span><h4>Security Notice</h4></div>
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