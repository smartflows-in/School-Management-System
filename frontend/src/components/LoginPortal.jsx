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
      icon: '🎓',
      color: '#4f46e5',
      path: '/student-login'
    },
    {
      id: 'teacher',
      title: 'Faculty',
      description: 'Manage courses, assignments, and student progress',
      icon: '👨‍🏫',
      color: '#7c3aed',
      path: '/teacher-login'
    },
    {
      id: 'admin',
      title: 'Administration',
      description: 'School management system and administrative tools',
      icon: '⚙️',
      color: '#10b981',
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
            <div className="school-logo">
              <div className="logo-icon">🏫</div>
            </div>
            <div className="school-info">
              <h1>SmartFlows Academy</h1>
              {/* <p>Empowering Future Leaders • Established 1985</p> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        <div className="container">
          <div className="welcome-section">
            <div className="welcome-badge">Academic Portal 2024</div>
            <h2>Welcome to SmartFlows Academy</h2>
            <p>Select your role to access the educational platform</p>
          </div>

          <div className="login-grid">
            {loginOptions.map((option) => (
              <div 
                key={option.id}
                className="login-card"
                onClick={() => handleNavigate(option.path)}
                style={{ '--accent-color': option.color }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ backgroundColor: `${option.color}15` }}>
                    <span style={{ color: option.color }}>{option.icon}</span>
                  </div>
                  <div className="card-badge" style={{ backgroundColor: option.color }}>
                    {option.title}
                  </div>
                </div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <div className="access-btn">
                  <span>Access Portal</span>
                  <div className="arrow-icon">→</div>
                </div>
                <div className="card-glow" style={{ background: `radial-gradient(circle, ${option.color}20 0%, transparent 70%)` }}></div>
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
              <div className="banner-badge">🎓 Admissions 2024</div>
              <h3>Admissions Open for Academic Year 2024-25</h3>
              <p>Limited seats available. Secure your child's future with quality education and modern learning facilities.</p>
              <div className="banner-actions">
                <button className="btn btn-primary" onClick={handleAdmissions}>
                  Apply Now
                </button>
                <button className="btn btn-secondary">
                  📄 Download Brochure
                </button>
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
              <div className="footer-logo">
                <div className="logo-icon">🏫</div>
                <span>SmartFlows Academy</span>
              </div>
              <p>123 Education Street, Knowledge City, State 560001</p>
              <div className="contact-info">
                <span>📞 +91 98765 43210</span>
                <span>✉️ info@smartflows.edu</span>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <a href="#about">About Us</a>
              <a href="#academics">Academics</a>
              <a href="#facilities">Facilities</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-social">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📷</a>
                <a href="#" className="social-link">📹</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SmartFlows Academy. All rights reserved. | Designed for Excellence in Education</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPortal;