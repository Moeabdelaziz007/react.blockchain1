import React from 'react';
import { NavLink } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <NavLink 
      className="logo-container" 
      to="/"
      aria-label="Home"
    >
      <div className="logo-icon">
        <div className="logo-shape">
          <i className="fas fa-shopping-bag" aria-hidden="true"></i>
        </div>
        <div className="logo-pulse"></div>
      </div>
      <div className="logo-text">
        <span className="logo-brand">React</span>
        <span className="logo-type">Ecommerce</span>
      </div>
    </NavLink>
  );
};

export default Logo;
