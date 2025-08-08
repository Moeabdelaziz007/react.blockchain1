import React, { useMemo, useState } from "react";
import { Navbar, Footer } from "../components";
import BackButton from "../components/BackButton";
import "./AICatalog.css";

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "Running Shoes Pro", price: 89.99, category: "Shoes", rating: 4.5, description: "Lightweight running shoes for daily training", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", stock: 15 },
  { id: "p2", name: "Trail Runner XT", price: 119.0, category: "Shoes", rating: 4.7, description: "All-terrain trail running shoes with superior grip", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop", stock: 8 },
  { id: "p3", name: "Yoga Mat Comfort", price: 29.99, category: "Fitness", rating: 4.2, description: "Extra thick non-slip yoga mat", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", stock: 25 },
  { id: "p4", name: "Dumbbell Set 20kg", price: 79.5, category: "Fitness", rating: 4.6, description: "Adjustable dumbbell set for home workouts", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", stock: 12 },
  { id: "p5", name: "Compression T-Shirt", price: 24.99, category: "Apparel", rating: 4.0, description: "Breathable compression tee for performance", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", stock: 30 },
  { id: "p6", name: "Hoodie Classic", price: 49.99, category: "Apparel", rating: 4.3, description: "Soft fleece hoodie for everyday wear", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", stock: 20 },
  { id: "p7", name: "Running Socks Pack", price: 14.99, category: "Apparel", rating: 4.4, description: "Moisture-wicking socks for long runs", image: "https://images.unsplash.com/photo-1586350977771-b3d0a3c8c4c4?w=300&h=300&fit=crop", stock: 45 },
  { id: "p8", name: "Fitness Tracker Band", price: 59.99, category: "Electronics", rating: 4.1, description: "Track steps, heart rate, and sleep", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop", stock: 18 },
  { id: "p9", name: "Wireless Earbuds Sport", price: 79.99, category: "Electronics", rating: 4.6, description: "Sweat-resistant earbuds with secure fit", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop", stock: 22 },
  { id: "p10", name: "Running Shoes Budget", price: 59.0, category: "Shoes", rating: 4.0, description: "Affordable runners with cushioned sole", image: "https://images.unsplash.com/photo-1549298916-b41d114d2c36?w=300&h=300&fit=crop", stock: 35 }
];

// Enhanced NLP-like parser with better understanding
function parseQuery(query) {
  const q = query.toLowerCase();
  const result = { maxPrice: undefined, minRating: undefined, categories: [], keywords: [] };

  // Enhanced price detection
  const priceUnder = q.match(/under\s*\$?\s*(\d+(?:\.\d+)?)/) || q.match(/below\s*\$?\s*(\d+(?:\.\d+)?)/) || q.match(/less\s*than\s*\$?\s*(\d+(?:\.\d+)?)/);
  if (priceUnder) result.maxPrice = parseFloat(priceUnder[1]);

  // Enhanced rating detection
  if (q.includes("good reviews") || q.includes("highly rated") || q.includes("best rated")) result.minRating = 4.3;
  if (q.includes("excellent") || q.includes("top rated")) result.minRating = 4.5;
  const ratingNum = q.match(/(\d(?:\.\d)?)\s*\+/) || q.match(/above\s*(\d(?:\.\d)?)/) || q.match(/over\s*(\d(?:\.\d)?)/);
  if (ratingNum) result.minRating = Math.max(result.minRating || 0, parseFloat(ratingNum[1]));

  // Enhanced category detection
  const catMap = {
    shoes: ["shoes", "running", "sneakers", "trail", "footwear", "trainers"],
    fitness: ["fitness", "gym", "workout", "yoga", "dumbbell", "exercise", "training"],
    apparel: ["apparel", "shirt", "t-shirt", "hoodie", "socks", "clothing", "wear"],
    electronics: ["electronics", "earbuds", "tracker", "band", "wireless", "tech", "device"]
  };
  
  Object.entries(catMap).forEach(([cat, tokens]) => {
    if (tokens.some(t => q.includes(t))) result.categories.push(capitalize(cat));
  });

  // Extract keywords for better matching
  const keywords = q.split(/\s+/).filter(word => word.length > 2);
  result.keywords = keywords;

  return result;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function smartFilter(products, query) {
  if (!query.trim()) return products;
  const intent = parseQuery(query);
  
  return products.filter(p => {
    // Price filter
    if (intent.maxPrice !== undefined && p.price > intent.maxPrice) return false;
    
    // Rating filter
    if (intent.minRating !== undefined && p.rating < intent.minRating) return false;
    
    // Category filter
    if (intent.categories.length && !intent.categories.includes(p.category)) return false;
    
    // Enhanced keyword relevance
    const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const relevance = terms.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
    
    return relevance >= Math.max(1, Math.floor(terms.length / 3));
  });
}

function recommend(products, userPrefs) {
  const { favoriteCategories = [], budget, searchHistory = [] } = userPrefs;
  
  const scored = products.map(p => {
    let score = p.rating * 2;
    
    // Category preference
    if (favoriteCategories.includes(p.category)) score += 3;
    
    // Budget consideration
    if (budget && p.price <= budget) score += 2;
    
    // Search history relevance
    const searchText = searchHistory.join(' ').toLowerCase();
    const productText = `${p.name} ${p.category} ${p.description}`.toLowerCase();
    if (searchText && productText.includes(searchText)) score += 1;
    
    // Stock availability bonus
    if (p.stock > 10) score += 0.5;
    
    return { p, score };
  });
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 6).map(s => s.p);
}

// Enhanced Dynamic Pricing Engine
function dynamicPriceFor(product, context) {
  const { demand = 50, isPeakHours = false, now = new Date(), userType = 'regular' } = context;
  let multiplier = 1.0;
  
  // Demand-driven pricing
  multiplier += ((demand - 50) / 50) * 0.15;
  
  // Rating-based pricing
  if (product.rating >= 4.6) multiplier += 0.08;
  else if (product.rating < 4.0) multiplier -= 0.05;
  
  // Category premium
  if (product.category === 'Electronics') multiplier += 0.05;
  else if (product.category === 'Shoes') multiplier += 0.03;
  
  // Time-based pricing
  const hour = now.getHours();
  const peak = isPeakHours || (hour >= 17 && hour <= 22);
  if (peak) multiplier += 0.02; else multiplier -= 0.01;
  
  // User type pricing
  if (userType === 'premium') multiplier -= 0.05;
  else if (userType === 'new') multiplier -= 0.02;
  
  // Stock-based pricing
  if (product.stock < 5) multiplier += 0.03;
  else if (product.stock > 20) multiplier -= 0.02;
  
  // Clamp to reasonable range
  multiplier = Math.max(0.75, Math.min(1.35, multiplier));
  const adjusted = Number((product.price * multiplier).toFixed(2));
  
  return { 
    adjusted, 
    multiplier,
    discount: multiplier < 1 ? Math.round((1 - multiplier) * 100) : 0,
    premium: multiplier > 1 ? Math.round((multiplier - 1) * 100) : 0
  };
}

function categoryIcon(cat) {
  switch (cat) {
    case "Shoes": return "👟";
    case "Fitness": return "💪";
    case "Apparel": return "👕";
    case "Electronics": return "📱";
    default: return "🛍️";
  }
}

export default function AICatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("search"); // search, recommendations, dynamic-pricing
  const [userPrefs, setUserPrefs] = useState({
    favoriteCategories: ["Shoes", "Electronics"],
    budget: 100,
    searchHistory: []
  });

  const filteredProducts = useMemo(() => smartFilter(SAMPLE_PRODUCTS, searchQuery), [searchQuery]);
  const recommendations = useMemo(() => recommend(SAMPLE_PRODUCTS, userPrefs), [userPrefs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setUserPrefs(prev => ({
        ...prev,
        searchHistory: [...prev.searchHistory, searchQuery]
      }));
    }
  };

  const renderProductCard = (product) => {
    const pricing = dynamicPriceFor(product, {
      demand: Math.random() * 100,
      isPeakHours: new Date().getHours() >= 17,
      now: new Date(),
      userType: 'regular'
    });

    return (
      <div key={product.id} className="ai-product-card">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x300?text=Product";
            }}
          />
          <div className="product-badges">
            <span className="category-badge">
              {categoryIcon(product.category)} {product.category}
            </span>
            {pricing.discount > 0 && (
              <span className="discount-badge">
                -{pricing.discount}%
              </span>
            )}
            {pricing.premium > 0 && (
              <span className="premium-badge">
                +{pricing.premium}%
              </span>
            )}
          </div>
        </div>
        
        <div className="product-content">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
                  </div>
            <span className="rating-text">({product.rating})</span>
              </div>
          
          <div className="product-pricing">
            <div className="price-container">
              <span className="original-price">${product.price}</span>
              <span className="dynamic-price">${pricing.adjusted}</span>
            </div>
            <span className="stock-info">
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>
          
          <button className="add-to-cart-btn">
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const renderCards = (list) => (
    <div className="products-grid">
      {list.map(renderProductCard)}
    </div>
  );

  const listForMode = () => {
    switch (viewMode) {
      case "recommendations": return recommendations;
      case "dynamic-pricing": return SAMPLE_PRODUCTS;
      default: return filteredProducts;
    }
  };

  return (
    <div className="ai-catalog-page">
      <Navbar />

      <div className="container">
        <BackButton text="Back to Home" />
      </div>

      <div className="ai-hero">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered <span className="highlight">Smart Shopping</span>
            </h1>
            <p className="hero-subtitle">
              Discover products with intelligent search, personalized recommendations, and dynamic pricing
            </p>
            <div className="hero-badges">
              <span className="hero-badge">🤖 AI Search</span>
              <span className="hero-badge">🎯 Smart Recommendations</span>
              <span className="hero-badge">💰 Dynamic Pricing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="ai-controls">
          <div className="toggle-segment">
            <button 
              className={`btn ${viewMode === "search" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("search")}
            >
              <i className="fas fa-search me-2"></i>
              Smart Search
              </button>
            <button 
              className={`btn ${viewMode === "recommendations" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("recommendations")}
            >
              <i className="fas fa-star me-2"></i>
              Recommendations
              </button>
            <button 
              className={`btn ${viewMode === "dynamic-pricing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("dynamic-pricing")}
            >
              <i className="fas fa-chart-line me-2"></i>
              Dynamic Pricing
              </button>
          </div>
        </div>

        {viewMode === "search" && (
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: 'running shoes under $100' or 'good fitness equipment'"
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
            </div>
            </form>
            
            <div className="search-examples">
              <h4>💡 Try these smart searches:</h4>
              <div className="example-tags">
                <button onClick={() => setSearchQuery("running shoes under $100")} className="example-tag">
                  running shoes under $100
                </button>
                <button onClick={() => setSearchQuery("good fitness equipment")} className="example-tag">
                  good fitness equipment
                </button>
                <button onClick={() => setSearchQuery("electronics above 4.5 rating")} className="example-tag">
                  electronics above 4.5 rating
                </button>
                <button onClick={() => setSearchQuery("apparel for workout")} className="example-tag">
                  apparel for workout
                </button>
            </div>
            </div>
          </div>
        )}

        {viewMode === "recommendations" && (
          <div className="recommendations-section">
            <div className="section-header">
              <h2>🎯 Personalized Recommendations</h2>
              <p>Based on your preferences and browsing history</p>
            </div>
            
            <div className="user-preferences">
              <h4>Your Preferences:</h4>
              <div className="preferences-tags">
                {userPrefs.favoriteCategories.map(cat => (
                  <span key={cat} className="preference-tag">
                    {categoryIcon(cat)} {cat}
                  </span>
                ))}
                <span className="preference-tag">
                  💰 Budget: ${userPrefs.budget}
                </span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "dynamic-pricing" && (
          <div className="pricing-section">
            <div className="section-header">
              <h2>💰 Dynamic Pricing</h2>
              <p>Prices adjust based on demand, time, and user preferences</p>
            </div>
            
            <div className="pricing-info">
              <div className="info-card">
                <i className="fas fa-clock"></i>
                <h4>Time-Based</h4>
                <p>Prices change during peak hours</p>
              </div>
              <div className="info-card">
                <i className="fas fa-chart-bar"></i>
                <h4>Demand-Driven</h4>
                <p>Popular items may have premium pricing</p>
              </div>
              <div className="info-card">
                <i className="fas fa-user"></i>
                <h4>User-Specific</h4>
                <p>Personalized pricing based on user type</p>
              </div>
            </div>
          </div>
        )}

        <div className="results-section">
          <div className="results-header">
            <h3>
              {viewMode === "search" && `Search Results (${filteredProducts.length} products)`}
              {viewMode === "recommendations" && `Recommended for You (${recommendations.length} products)`}
              {viewMode === "dynamic-pricing" && `All Products with Dynamic Pricing (${SAMPLE_PRODUCTS.length} products)`}
            </h3>
            {viewMode === "search" && searchQuery && (
              <p className="search-query">
                Showing results for: <strong>"{searchQuery}"</strong>
              </p>
            )}
          </div>

          {listForMode().length > 0 ? (
            renderCards(listForMode())
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h4>No products found</h4>
              <p>Try adjusting your search terms or browse our recommendations</p>
              </div>
            )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 