import React from 'react'
import { NavLink } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-modern" role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="brand-gradient">React Ecommerce</span>
            </h3>
            <p className="footer-description">
              Your one-stop destination for modern e-commerce solutions. 
              Built with React and cutting-edge technologies.
            </p>
            <div className="social-links">
              <a 
                href="https://facebook.com" 
                className="social-link"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a 
                href="https://twitter.com" 
                className="social-link"
                aria-label="Follow us on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
              <a 
                href="https://instagram.com" 
                className="social-link"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                className="social-link"
                aria-label="Follow us on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <nav className="footer-nav" role="navigation" aria-label="Footer navigation">
              <ul className="footer-nav-list">
                <li>
                  <NavLink 
                    to="/product" 
                    className="footer-link"
                    aria-label="View all products"
                  >
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/product-card-demo" 
                    className="footer-link"
                    aria-label="Product card demo"
                  >
                    Product Card Demo
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/ai" 
                    className="footer-link"
                    aria-label="AI Catalog"
                  >
                    AI Catalog
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/blockchain" 
                    className="footer-link"
                    aria-label="Blockchain demo"
                  >
                    Blockchain
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <address className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon" aria-hidden="true"></i>
                <span>123 Ecommerce St, Tech City</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone contact-icon" aria-hidden="true"></i>
                <a href="tel:+15551234567" className="contact-link">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope contact-icon" aria-hidden="true"></i>
                <a href="mailto:info@reactecommerce.com" className="contact-link">
                  info@reactecommerce.com
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} React Ecommerce. All rights reserved.
            </p>
            <nav className="footer-bottom-nav" role="navigation" aria-label="Legal links">
              <a 
                href="#" 
                className="footer-bottom-link"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="footer-bottom-link"
                aria-label="Terms of Service"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
