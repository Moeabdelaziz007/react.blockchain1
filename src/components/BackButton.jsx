import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ text = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button 
      className={`back-btn ${className}`}
      onClick={handleGoBack}
      aria-label="Go back to previous page"
    >
      <i className="fas fa-arrow-left"></i>
      <span>{text}</span>
    </button>
  );
};

export default BackButton;
