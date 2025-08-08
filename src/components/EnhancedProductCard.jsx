import React, { useState, useCallback } from 'react';
import './EnhancedProductCard.css';

// Utility function for price formatting
function formatPrice(price) {
  if (!price) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Enhanced Product Card Component
const EnhancedProductCard = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    category,
    image,
    stock,
    rating,
    reviews,
    variants = []
  } = product;

  // State management
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || '');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Computed values
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 10;
  const stockStatus = !isInStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock';

  // Event handlers
  const handleAddToCart = useCallback(async () => {
    if (!isInStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Added to cart:', { ...product, selectedVariant });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [isInStock, isAddingToCart, product, selectedVariant]);

  const handleWishlistToggle = useCallback((e) => {
    e.stopPropagation();
    setIsWishlisted(prev => !prev);
  }, []);

  const handleVariantChange = useCallback((e) => {
    setSelectedVariant(e.target.value);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    setImageLoaded(true);
  }, []);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt filled" />);
      } else {
        stars.push(<i key={i} className="far fa-star" />);
      }
    }
    return stars;
  };

  return (
    <div className="enhanced-product-card">
      {/* Image Container */}
      <div className="product-image-container">
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer" />
          </div>
        )}
        
        <img
          src={image}
          alt={name}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Stock Badge */}
        {stockStatus !== 'in-stock' && (
          <div className={`stock-badge ${stockStatus}`}>
            {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'}
          </div>
        )}

        {/* Category Badge */}
        <div className="category-badge">
          {category}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} />
        </button>

        {/* Quick View Overlay */}
        <div className="quick-view-overlay">
          <button
            type="button"
            className="quick-view-btn"
            aria-label="Quick view"
          >
            <i className="fas fa-eye" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="product-content">
        {/* Product Name */}
        <h3 className="product-name" title={name}>
          {name}
        </h3>

        {/* Rating and Reviews */}
        <div className="rating-section">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-text">
            {rating.toFixed(1)} ({reviews} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="product-description" title={description}>
          {description}
        </p>

        {/* Price */}
        <div className="price-section">
          <span className="price">{formatPrice(price)}</span>
          {stockStatus === 'low-stock' && (
            <span className="stock-warning">Only {stock} left!</span>
          )}
        </div>

        {/* Variant Selection */}
        {variants.length > 0 && (
          <div className="variant-section">
            <label htmlFor={`variant-${id}`} className="variant-label">
              Select Size:
            </label>
            <select
              id={`variant-${id}`}
              className="variant-select"
              value={selectedVariant}
              onChange={handleVariantChange}
              disabled={!isInStock}
            >
              {variants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          type="button"
          className={`add-to-cart-btn ${stockStatus} ${isAddingToCart ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          aria-label={isInStock ? 'Add to cart' : 'Out of stock'}
        >
          {isAddingToCart ? (
            <>
              <span className="spinner" />
              Adding...
            </>
          ) : isInStock ? (
            <>
              <i className="fas fa-shopping-cart" />
              Add to Cart
            </>
          ) : (
            <>
              <i className="fas fa-times" />
              Out of Stock
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EnhancedProductCard;
