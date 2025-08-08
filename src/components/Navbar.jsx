import React, { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from './Logo'
import './Navbar.css'

const Navbar = () => {
    const state = useSelector(state => state.handleCart)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    
    const linkClass = useCallback(({ isActive }) => 
        `nav-link ${isActive ? 'active' : ''}`, [])
    
    const handleMenuToggle = useCallback(() => {
        setIsMenuOpen(prev => !prev)
    }, [])

    const handleMenuClose = useCallback(() => {
        setIsMenuOpen(false)
    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-dark py-3 sticky-top" role="navigation" aria-label="Main navigation">
            <div className="container">
                {/* Brand/Logo */}
                <Logo />
                
                {/* Mobile Menu Toggle */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={handleMenuToggle}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* Navigation Menu */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                    {/* Main Navigation Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" role="menubar">
                        <li className="nav-item" role="none">
                            <NavLink 
                                className={linkClass} 
                                to="/" 
                                onClick={handleMenuClose}
                                role="menuitem"
                                aria-label="Home page"
                            >
                                <i className="fas fa-home me-2" aria-hidden="true"></i>
                                <span className="nav-text">Home</span>
                            </NavLink>
                        </li>
                        <li className="nav-item" role="none">
                            <NavLink 
                                className={linkClass} 
                                to="/product" 
                                onClick={handleMenuClose}
                                role="menuitem"
                                aria-label="Products page"
                            >
                                <i className="fas fa-shopping-bag me-2" aria-hidden="true"></i>
                                <span className="nav-text">Products</span>
                            </NavLink>
                        </li>
                        <li className="nav-item" role="none">
                            <NavLink 
                                className={linkClass} 
                                to="/product-card-demo" 
                                onClick={handleMenuClose}
                                role="menuitem"
                                aria-label="Product Card Demo"
                            >
                                <i className="fas fa-th-large me-2" aria-hidden="true"></i>
                                <span className="nav-text">Product Demo</span>
                            </NavLink>
                        </li>
                        <li className="nav-item" role="none">
                            <NavLink 
                                className={linkClass} 
                                to="/ai" 
                                onClick={handleMenuClose}
                                role="menuitem"
                                aria-label="AI Catalog page"
                            >
                                <i className="fas fa-magic me-2" aria-hidden="true"></i>
                                <span className="nav-text">AI Catalog</span>
                            </NavLink>
                        </li>
                        <li className="nav-item" role="none">
                            <NavLink 
                                className={linkClass} 
                                to="/blockchain" 
                                onClick={handleMenuClose}
                                role="menuitem"
                                aria-label="Blockchain demo page"
                            >
                                <i className="fas fa-link me-2" aria-hidden="true"></i>
                                <span className="nav-text">Blockchain</span>
                            </NavLink>
                        </li>
                    </ul>
                    
                    {/* Right Side Actions */}
                    <div className="navbar-actions d-flex align-items-center gap-2">
                        <NavLink 
                            to="/cart" 
                            className="cart-button"
                            aria-label={`Shopping cart with ${state.length} items`}
                            onClick={handleMenuClose}
                        >
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                            <span className="cart-text d-none d-md-inline">Cart</span>
                            <span className="cart-badge">
                                {state.length}
                            </span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar