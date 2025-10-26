import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGoBack}>
              Go Back
            </button>
            <button className="btn btn-secondary" onClick={handleGoHome}>
              Go to Homepage
            </button>
          </div>
        </div>
        <div className="not-found-graphic">
          <div className="book-stack">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;