import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './UserExperience.css';

const UserExperience = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Back to Top Button */}
      {isVisible && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <i className="fas fa-chevron-up" aria-hidden="true"></i>
        </button>
      )}

      {/* Keyboard Navigation Helper */}
      <div className="keyboard-helper" role="status" aria-live="polite">
        <span className="sr-only">Use Tab to navigate, Enter to select, Escape to close</span>
      </div>
    </>
  );
};

export default UserExperience;
