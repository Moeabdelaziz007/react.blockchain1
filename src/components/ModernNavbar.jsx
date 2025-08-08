import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ModernNavbar = () => {
  const cart = useSelector((state) => state.handleCart);
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3 sticky-top">
      <div className="container">
        <RouterLink className="navbar-brand fw-bold fs-4" to="/">
          React Ecommerce
        </RouterLink>
        
        <div className="navbar-nav ms-auto">
          <RouterLink className="nav-link" to="/">Home</RouterLink>
          <RouterLink className="nav-link" to="/product">Products</RouterLink>
          <RouterLink className="nav-link" to="/ai">AI Catalog</RouterLink>
          <RouterLink className="nav-link" to="/blockchain">Blockchain</RouterLink>
          <RouterLink className="nav-link" to="/about">About</RouterLink>
          <RouterLink className="nav-link" to="/contact">Contact</RouterLink>
          <RouterLink className="nav-link" to="/cart">
            Cart ({cartItemCount})
          </RouterLink>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
