import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPortal.css';

const LoginPortal = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      id: 'student',
      title: 'Students',
      description: 'Access your academic portal, courses, and learning resources',
      icon: '📚',
      color: 'var(--primary-blue)',
      path: '/student-login'
    },
    {
      id: 'teacher',
      title: 'Faculty',
      description: 'Manage courses, assignments, and student progress',
      icon: '👨‍🏫',
      color: 'var(--accent-gold)',
      path: '/teacher-login'
    },
    {
      id: 'admin',
      title: 'Administration',
      description: 'School management system and administrative tools',
      icon: '⚙️',
      color: 'var(--text-dark)',
      path: '/admin-login'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAdmissions = () => {
    navigate('/admissions');
  };

  return (
    <div className="login-portal">
      {/* Header */}
      <header className="portal-header">
        <div className="container">
          <div className="school-brand">
            <div className="school-logo">BF</div>
            <div className="school-info">
              <h1>Bright Future Academy</h1>
              <p>Established 1985 • CBSE Affiliated</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        <div className="container">
          <div className="welcome-section">
            <h2>Academic Portal</h2>
            <p>Select your role to access the system</p>
          </div>

          <div className="login-grid">
            {loginOptions.map((option) => (
              <div 
                key={option.id}
                className="login-card"
                onClick={() => handleNavigate(option.path)}
                style={{ '--accent-color': option.color }}
              >
                <div className="card-icon" style={{ backgroundColor: `${option.color}15` }}>
                  <span style={{ color: option.color }}>{option.icon}</span>
                </div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <div className="access-btn">
                  Access Portal →
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Admissions Banner */}
      <section className="admissions-section">
        <div className="container">
          <div className="admissions-banner">
            <div className="banner-content">
              <div className="banner-badge">Admissions 2024</div>
              <h3>Admissions Open for Academic Year 2024-25</h3>
              <p>Limited seats available. Secure your child's future with quality education.</p>
              <div className="banner-actions">
                <button className="btn btn-primary" onClick={handleAdmissions}>
                  Apply Now
                </button>
                <button className="btn btn-secondary">Download Brochure</button>
              </div>
            </div>
            <div className="banner-stats">
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Board Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">25+</div>
                <div className="stat-label">Years Excellence</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Expert Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h4>Bright Future Academy</h4>
              <p>123 Education Street, Knowledge City</p>
              <p>Phone: +91 98765 43210 • Email: info@bfacademy.edu</p>
            </div>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#academics">Academics</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Bright Future Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPortal;