import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageLoader.css';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cryptoIcons, setCryptoIcons] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    // Generate floating crypto icons
    const icons = [
      { id: 1, icon: '₿', delay: 0, x: 10, y: 20 },
      { id: 2, icon: 'Ξ', delay: 0.5, x: 80, y: 60 },
      { id: 3, icon: '₿', delay: 1, x: 20, y: 80 },
      { id: 4, icon: 'Ξ', delay: 1.5, x: 70, y: 30 },
      { id: 5, icon: '₿', delay: 2, x: 90, y: 70 },
      { id: 6, icon: 'Ξ', delay: 2.5, x: 30, y: 50 }
    ];
    setCryptoIcons(icons);

    // Simulate loading progress with crypto-themed messages
    let messageIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const newProgress = prev + Math.random() * 20;
        if (newProgress > (messageIndex + 1) * 18) {
          messageIndex++;
        }
        return newProgress;
      });
    }, 150);

    // Complete loading after a short delay
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="page-loader">
      {/* Background crypto pattern */}
      <div className="crypto-background">
        <div className="blockchain-pattern"></div>
        {cryptoIcons.map((crypto) => (
          <div
            key={crypto.id}
            className="floating-crypto"
            style={{
              left: `${crypto.x}%`,
              top: `${crypto.y}%`,
              animationDelay: `${crypto.delay}s`
            }}
          >
            {crypto.icon}
          </div>
        ))}
      </div>

      <div className="loader-container">
        <div className="loader-icon">
          <div className="loader-spinner"></div>
          <div className="loader-pulse"></div>
          <div className="crypto-center">
            <span className="crypto-symbol">₿</span>
          </div>
        </div>
        
        <div className="loader-text">
          <span className="loading-text">Loading Crypto Commerce</span>
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
        
        <div className="loader-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        <div className="loader-message">
          {progress < 20 && 'Connecting to blockchain...'}
          {progress >= 20 && progress < 40 && 'Loading crypto wallet...'}
          {progress >= 40 && progress < 60 && 'Initializing AI...'}
          {progress >= 60 && progress < 80 && 'Preparing secure connection...'}
          {progress >= 80 && 'Almost ready...'}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
