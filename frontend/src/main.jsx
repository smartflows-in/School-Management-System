import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>  // COMMENT: Disable for dev to fix double-render/navigate
    <App />
  // </React.StrictMode>
);