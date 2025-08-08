import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Main.css";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer for sale
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sample featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "High-quality wireless headphones with noise cancellation"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop",
      description: "Track your fitness goals with advanced health monitoring"
    },
    {
      id: 3,
      name: "Elegant Pearl Necklace",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
      description: "Beautiful pearl necklace for special occasions"
    }
  ];

  return (
    <>
      {/* Hero Section with Sale */}
      <section className="hero-section">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
            alt="Crypto Ecommerce Hero Background"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-text">
                <div className="hero-badge">
                  <i className="fas fa-fire"></i>
                  <span>FLASH SALE</span>
                </div>
                <h1 className="hero-title">
                  Crypto Winter Sale
                  <span className="brand-highlight"> 70% OFF</span>
                </h1>
                <p className="hero-subtitle">
                  Limited time offer! Shop premium products with crypto and save big.
                </p>
                
                {/* Countdown Timer */}
                <div className="countdown-timer">
                  <div className="countdown-label">Sale Ends In:</div>
                  <div className="countdown-grid">
                    <div className="countdown-item">
                      <div className="countdown-number">{timeLeft.days}</div>
                      <div className="countdown-label">Days</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                      <div className="countdown-number">{timeLeft.hours}</div>
                      <div className="countdown-label">Hours</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                      <div className="countdown-number">{timeLeft.minutes}</div>
                      <div className="countdown-label">Minutes</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                      <div className="countdown-number">{timeLeft.seconds}</div>
                      <div className="countdown-label">Seconds</div>
                    </div>
                  </div>
                </div>

                <div className="hero-buttons">
                  <NavLink to="/product" className="hero-btn primary">
                    <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                    <span>Shop Now</span>
                  </NavLink>
                  <NavLink to="/product" className="hero-btn secondary">
                    <i className="fas fa-eye" aria-hidden="true"></i>
                    <span>View Products</span>
                  </NavLink>
                </div>

                {/* Crypto Accepted */}
                <div className="crypto-accepted">
                  <div className="accepted-label">Accepted Cryptocurrencies:</div>
                  <div className="crypto-list">
                    <div className="crypto-item bitcoin">
                      <i className="fab fa-bitcoin"></i>
                      <span>Bitcoin</span>
                    </div>
                    <div className="crypto-item ethereum">
                      <i className="fab fa-ethereum"></i>
                      <span>Ethereum</span>
                    </div>
                    <div className="crypto-item cardano">
                      <i className="fas fa-coins"></i>
                      <span>Cardano</span>
                    </div>
                    <div className="crypto-item solana">
                      <i className="fas fa-bolt"></i>
                      <span>Solana</span>
                    </div>
                  </div>
                </div>

                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Products</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Crypto Pairs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="products-title">Featured Products</h2>
            <p className="products-subtitle">
              Discover our handpicked selection of premium products available with crypto payments
              </p>
            </div>
            
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-preview-card">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-preview-image"
                />
                <h3 className="product-preview-title">{product.name}</h3>
                <div className="product-preview-price">${product.price}</div>
                <p className="product-preview-description">{product.description}</p>
                <NavLink to="/product" className="product-preview-btn">
                  <i className="fas fa-eye"></i>
                  View Details
                </NavLink>
              </div>
            ))}
          </div>
          
          <div className="view-all-products">
            <NavLink to="/product" className="view-all-btn">
              <i className="fas fa-shopping-bag"></i>
              View All Products
            </NavLink>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated</h2>
              <p>Get the latest updates on new products, crypto news, and exclusive offers.</p>
            </div>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                <i className="fas fa-paper-plane"></i>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
