import React, { useMemo, useState, useCallback } from "react";
import "./ProductCard.css";

// Utility function for price formatting
function formatPrice(value) {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `$${num.toFixed(2)}`;
}

// Default variant options
const defaultVariants = ["S", "M", "L"];

// Enhanced ProductCard component with modern design
export default function ProductCard({ product, onAddToCart, selectedCrypto = "ETH" }) {
  const {
    id,
    title,
    name,
    imageUrl,
    image,
    price,
    cuttedPrice,
    variants,
    inStock,
    stock,
    description,
    category,
    rating,
  } = product || {};

  // Memoized computed values
  const isAvailable = useMemo(() => {
    if (typeof inStock === "boolean") return inStock;
    if (typeof stock === "number") return stock > 0;
    return true;
  }, [inStock, stock]);

  const displayName = name || title || "Untitled";
  const displayImage = imageUrl || image || "https://picsum.photos/400/300?random=" + (id || 1);
  const variantOptions = Array.isArray(variants) && variants.length > 0 ? variants : defaultVariants;
  
  // Calculate discount percentage
  const hasDiscount = cuttedPrice && Number(cuttedPrice) > Number(price);
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(cuttedPrice) - Number(price)) / Number(cuttedPrice)) * 100)
    : 0;

  // Stable rating computation
  const computedRating = useMemo(() => {
    if (typeof rating === 'number') return rating;
    const seed = String(id || displayName).split('').reduce((a,c)=>a+c.charCodeAt(0), 0);
    return Number((3.6 + (seed % 14) / 10).toFixed(1));
  }, [rating, id, displayName]);

  // Get crypto symbol
  const getCryptoSymbol = () => {
    switch (selectedCrypto) {
      case "ETH": return "Ξ";
      case "BTC": return "₿";
      case "ADA": return "₳";
      default: return "Ξ";
    }
  };

  // Convert USD to crypto
  const convertToCrypto = (usdPrice) => {
    const CRYPTO_RATES = {
      ETH: 0.0005,
      BTC: 0.00002,
      ADA: 2.5,
    };
    const rate = CRYPTO_RATES[selectedCrypto] || 0.0005;
    return (usdPrice * rate).toFixed(6);
  };

  // State management
  const [selectedVariant, setSelectedVariant] = useState(variantOptions[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Memoized event handlers
  const handleAddToCart = useCallback(async (productData) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await onAddToCart(productData);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  }, [isAddingToCart, onAddToCart]);

  const handleWishlistToggle = useCallback((e) => {
    e.stopPropagation();
    setWishlisted(prev => !prev);
  }, []);



  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e) => {
    e.currentTarget.src = "https://via.placeholder.com/600x400.png?text=No+Image";
    setImageLoaded(true);
  }, []);

  const handleQuickView = useCallback((e) => {
    e.stopPropagation();
    setShowQuickView(true);
    // In a real app, this would open a modal or navigate to product detail
    setTimeout(() => setShowQuickView(false), 2000);
  }, []);

  return (
    <article 
      className={`product-card-modern ${isAddingToCart ? 'loading' : ''} ${!isAvailable ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Product: ${displayName}`}
    >
      {/* Image Container */}
      <div className="product-image-container">
        {/* Loading Shimmer */}
        {!imageLoaded && (
          <div className="image-shimmer" />
        )}
        
        {/* Product Image */}
        <img
          src={displayImage}
          alt={displayName}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="badge-container discount">
            <span className="badge discount-badge" aria-label={`${discountPercentage}% off`}>
              <i className="fas fa-tag" aria-hidden="true"></i>
              -{discountPercentage}%
            </span>
          </div>
        )}
        
        {/* New Badge */}
        {Math.random() > 0.7 && (
          <div className="badge-container new">
            <span className="badge new-badge">
              <i className="fas fa-star" aria-hidden="true"></i>
              New
            </span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          type="button"
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlistToggle}
        >
          <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`} aria-hidden="true"></i>
        </button>
        
        {/* Out of Stock Badge */}
        {!isAvailable && (
          <div className="badge-container stock">
            <span className="badge stock-badge">
              <i className="fas fa-times" aria-hidden="true"></i>
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="badge-container category">
            <span className="badge category-badge">
              <i className="fas fa-tag" aria-hidden="true"></i>
              {category}
            </span>
          </div>
        )}
        
        {/* Quick View Overlay */}
        {isHovered && isAvailable && (
          <div className="quick-view-overlay">
            <button 
              className="quick-view-btn"
              title="Quick View"
              aria-label="Quick view product"
              onClick={handleQuickView}
            >
              <i className="fas fa-eye" aria-hidden="true"></i>
            </button>
            <button 
              className="quick-view-btn secondary"
              title="Add to Cart"
              aria-label="Add to cart"
              onClick={() => handleAddToCart({ ...product, selectedVariant })}
            >
              <i className="fas fa-cart-plus" aria-hidden="true"></i>
            </button>
          </div>
        )}

        {/* Stock Indicator */}
        {isAvailable && stock !== undefined && (
          <div className="stock-indicator">
            <div className="stock-bar">
              <div 
                className="stock-fill" 
                style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="stock-text">
              {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Low Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="product-content">
        {/* Product Name */}
        <h3 className="product-title" title={displayName}>
          {displayName}
        </h3>

        {/* Rating */}
        <div className="rating-container" role="img" aria-label={`Rating ${computedRating} out of 5 stars`}>
          {[1,2,3,4,5].map(i => (
            <i 
              key={i} 
              className={`star ${computedRating >= i - 0.2 ? 'filled' : 'empty'}`}
              aria-hidden="true"
            ></i>
          ))}
          <span className="rating-text">{computedRating.toFixed(1)}</span>
          <span className="rating-count">({Math.floor(Math.random() * 500) + 50} reviews)</span>
        </div>
        
        {/* Description */}
        {description && (
          <p className="product-description">
            {String(description)}
          </p>
        )}
        
        {/* Price Section */}
        <div className="price-section">
          <div className="price-container">
            <div className="price-primary">
              <span className="current-price">
                {formatPrice(price)}
              </span>
              {hasDiscount && (
                <span className="original-price">
                  {formatPrice(cuttedPrice)}
                </span>
              )}
            </div>
            <div className="price-crypto">
              <span className="crypto-price">
                {getCryptoSymbol()}{convertToCrypto(price)}
              </span>
              <span className="crypto-label">{selectedCrypto}</span>
            </div>
          </div>
          {hasDiscount && (
            <div className="savings-info">
              <span className="savings-badge">
                Save ${(Number(cuttedPrice) - Number(price)).toFixed(2)}
              </span>
              <span className="savings-percentage">
                ({discountPercentage}% off)
              </span>
            </div>
          )}
        </div>
        
        {/* Variant Selection */}
        <div className="variant-section">
          <label className="variant-label">
            <i className="fas fa-ruler" aria-hidden="true"></i>
            Size
          </label>
          <div className="variant-options">
            {variantOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`variant-option ${selectedVariant === opt ? 'selected' : ''}`}
                onClick={() => setSelectedVariant(opt)}
                disabled={!isAvailable}
                aria-label={`Select size ${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          type="button"
          className={`add-to-cart-btn ${isAvailable ? 'available' : 'unavailable'} ${isAddingToCart ? 'loading' : ''}`}
          disabled={!isAvailable || isAddingToCart}
          onClick={() => handleAddToCart({ ...product, selectedVariant })}
          aria-label={isAvailable ? 'Add to cart' : 'Out of stock'}
        >
          {isAddingToCart ? (
            <>
              <span className="spinner" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : isAvailable ? (
            <>
              <i className="fas fa-cart-plus" aria-hidden="true"></i>
              Add to Cart
            </>
          ) : (
            <>
              <i className="fas fa-times" aria-hidden="true"></i>
              Out of Stock
            </>
          )}
        </button>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            title="Add to Wishlist"
            aria-label="Add to wishlist"
            onClick={handleWishlistToggle}
          >
            <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`} aria-hidden="true"></i>
          </button>
          <button 
            className="quick-action-btn"
            title="Compare"
            aria-label="Compare product"
          >
            <i className="fas fa-exchange-alt" aria-hidden="true"></i>
          </button>
          <button 
            className="quick-action-btn"
            title="Share"
            aria-label="Share product"
          >
            <i className="fas fa-share-alt" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Quick View Success Message */}
      {showQuickView && (
        <div className="quick-view-message">
          <i className="fas fa-eye" aria-hidden="true"></i>
          Quick view activated
        </div>
      )}
    </article>
  );
} 