import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/TeacherLogin.css';

const TeacherLogin = () => {
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
    console.log('Teacher login attempt:', formData.email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const role = payload.role;
      if (!role || role !== 'teacher') {
        throw new Error('Invalid role for teacher login');
      }
      const userData = { 
        email: userCredential.user.email, 
        uid: userCredential.user.uid, 
        role: role
      };
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Teacher login success, decoded role:', role, 'navigating to dashboard');
      navigate('/teacher-dashboard', { replace: true });
    } catch (err) {
      console.error('Teacher auth error:', err.code, err.message);
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
    <div className="teacher-login">
      <div className="login-container">
        <div className="login-header">
          <button className="back-btn" onClick={handleBack}>← Back to Portal</button>
          <div className="login-brand">
            <div className="brand-logo">BF</div>
            <div><h1>Faculty Portal</h1><p>Bright Future Academy</p></div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Faculty Login</h2>
            <p>Access your teaching dashboard and resources</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Faculty Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your faculty email"
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
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember this device</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Accessing...' : 'Access Faculty Portal'}
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