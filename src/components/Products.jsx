import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import "./Products.css";

const API_BASE = process.env.REACT_APP_API_BASE || "";

// Crypto price conversion (mock data)
const CRYPTO_RATES = {
  ETH: 0.0005, // 1 USD = 0.0005 ETH
  BTC: 0.00002, // 1 USD = 0.00002 BTC
  ADA: 2.5, // 1 USD = 2.5 ADA
};

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("ETH");
  const [gridColumns, setGridColumns] = useState(4);

  // Enhanced filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  // Convert USD to crypto
  const convertToCrypto = useCallback((usdPrice) => {
    const rate = CRYPTO_RATES[selectedCrypto];
    return (usdPrice * rate).toFixed(6);
  }, [selectedCrypto]);

  // Get crypto symbol


  // Enhanced filter function
  const applyFilters = useCallback(() => {
    let filteredData = [...data];

    // Search filter
    if (searchQuery.trim()) {
      filteredData = filteredData.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    filteredData = filteredData.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Rating filter
    if (selectedRating > 0) {
      filteredData = filteredData.filter(product =>
        product.rating >= selectedRating
    );
    }

    // Stock filter
    if (showOnlyInStock) {
      filteredData = filteredData.filter(product =>
        product.stock > 0 || product.inStock
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filteredData.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredData.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for "featured"
        break;
    }

    setFilter(filteredData);
  }, [data, searchQuery, selectedCategories, priceRange, selectedRating, sortBy, showOnlyInStock]);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [data, searchQuery, selectedCategories, priceRange, selectedRating, sortBy, showOnlyInStock, applyFilters]);

  // Category options
  const categories = useMemo(() => [
    { id: "electronics", name: "Electronics", icon: "📱", count: 0 },
    { id: "men's clothing", name: "Men's Clothing", icon: "👔", count: 0 },
    { id: "women's clothing", name: "Women's Clothing", icon: "👗", count: 0 },
    { id: "jewelery", name: "Jewelry", icon: "💎", count: 0 },
    { id: "accessories", name: "Accessories", icon: "👜", count: 0 }
  ], []);

  // Update category counts
  useEffect(() => {
    // Note: In a real implementation, you'd update the categories state here
    // const updatedCategories = categories.map(cat => ({
    //   ...cat,
    //   count: data.filter(product => product.category === cat.id).length
    // }));
  }, [data, categories]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(0);
    setSortBy("featured");
    setShowOnlyInStock(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 1000) count++;
    if (selectedRating > 0) count++;
    if (showOnlyInStock) count++;
    return count;
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      // Use mock data instead of API
      const mockProducts = [
        {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 129.99,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
          rating: 4.5,
          cryptoPrice: convertToCrypto(129.99),
          stock: 15,
          inStock: true
        },
        {
          id: 2,
          title: "Classic Denim Jacket",
          price: 89.99,
          category: "men's clothing",
          image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=300&fit=crop",
          rating: 4.2,
          cryptoPrice: convertToCrypto(89.99),
          stock: 8,
          inStock: true
        },
        {
          id: 3,
          title: "Elegant Pearl Necklace",
          price: 199.99,
          category: "jewelery",
          image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
          rating: 4.7,
          cryptoPrice: convertToCrypto(199.99),
          stock: 3,
          inStock: true
        },
        {
          id: 4,
          title: "Smart Fitness Watch",
          price: 249.99,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
          rating: 4.6,
          cryptoPrice: convertToCrypto(249.99),
          stock: 12,
          inStock: true
        },
        {
          id: 5,
          title: "Summer Floral Dress",
          price: 79.99,
          category: "women's clothing",
          image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
          rating: 4.3,
          cryptoPrice: convertToCrypto(79.99),
          stock: 0,
          inStock: false
        },
        {
          id: 6,
          title: "Leather Crossbody Bag",
          price: 149.99,
          category: "women's clothing",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
          rating: 4.4,
          cryptoPrice: convertToCrypto(149.99),
          stock: 6,
          inStock: true
        },
        {
          id: 7,
          title: "Gaming Mechanical Keyboard",
          price: 179.99,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
          rating: 4.8,
          cryptoPrice: convertToCrypto(179.99),
          stock: 4,
          inStock: true
        },
        {
          id: 8,
          title: "Vintage Sunglasses",
          price: 59.99,
          category: "accessories",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
          rating: 4.1,
          cryptoPrice: convertToCrypto(59.99),
          stock: 20,
          inStock: true
        }
      ];
      
      setData(mockProducts);
      setFilter(mockProducts);
      setLoading(false);
    };

    getProducts();
  }, [convertToCrypto]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`col-lg-${12/gridColumns} col-md-6 col-12 mb-4`}>
            <Skeleton height={360} />
          </div>
        ))}
      </>
    );
  };

  const handleAddDemoProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Demo Product",
          price: 99.99,
          category: "demo",
          image: "https://via.placeholder.com/400x300",
        }),
      });

      if (response.ok) {
        toast.success("Demo product added successfully!");
        // Refresh products
        window.location.reload();
      } else {
        toast.error("Failed to add demo product");
      }
    } catch (error) {
      console.error("Error adding demo product:", error);
      toast.error("Error adding demo product");
    }
  };

  const ShowProducts = () => {
    return (
      <>
        {/* Crypto Price Display */}
        <div className="crypto-price-display">
          <div className="container">
            <div className="crypto-controls">
              <div className="crypto-selector">
                <label htmlFor="crypto-select">Display Prices in:</label>
                <select 
                  id="crypto-select"
                  value={selectedCrypto} 
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="crypto-select"
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ADA">Cardano (ADA)</option>
                </select>
              </div>
              <div className="grid-controls">
                <label>Grid Layout:</label>
                <div className="grid-buttons">
                  <button 
                    className={`grid-btn ${gridColumns === 3 ? 'active' : ''}`}
                    onClick={() => setGridColumns(3)}
                  >
                    3 Columns
                  </button>
                  <button 
                    className={`grid-btn ${gridColumns === 4 ? 'active' : ''}`}
                    onClick={() => setGridColumns(4)}
                  >
                    4 Columns
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

        {/* Enhanced Filter Section */}
        <div className="enhanced-filter-section">
          <div className="container">
            <div className="filter-header">
              <div className="filter-toggle">
              <button 
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fas fa-filter"></i>
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className="filter-badge">{getActiveFiltersCount()}</span>
                  )}
              </button>
              </div>
              <div className="results-info">
                <span className="results-count">{filter.length} products found</span>
                {getActiveFiltersCount() > 0 && (
              <button 
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
              >
                    Clear All
              </button>
                )}
              </div>
            </div>

            {/* Filter Sidebar */}
            {showFilters && (
              <div className="filter-sidebar">
                <div className="filter-group">
                  <h3 className="filter-title">
                    <i className="fas fa-search"></i>
                    Search
                  </h3>
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-title">
                    <i className="fas fa-tags"></i>
                    Categories
                  </h3>
                  <div className="category-filters">
                    {categories.map(category => (
                      <label key={category.id} className="category-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="category-label">
                          {category.icon} {category.name}
                        </span>
                        <span className="category-count">({category.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-title">
                    <i className="fas fa-dollar-sign"></i>
                    Price Range
                  </h3>
                  <div className="price-range">
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                        className="price-input"
                      />
                      <span className="price-separator">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                        className="price-input"
                      />
                    </div>
                    <div className="price-slider">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="range-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="range-slider"
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-title">
                    <i className="fas fa-star"></i>
                    Rating
                  </h3>
                  <div className="rating-filters">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="rating-checkbox">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="rating-label">
                          {rating}+ Stars
                        </span>
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-title">
                    <i className="fas fa-sort"></i>
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="stock-checkbox">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="stock-label">
                      <i className="fas fa-check-circle"></i>
                      Show only in stock
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* Products Grid */}
        <div className="products-section">
          <div className="container">
            <div className="row">
              {filter.map((product) => (
                <div key={product.id} className={`col-lg-${12/gridColumns} col-md-6 col-12 mb-4`}>
                  <ProductCard 
                    product={product}
                    onAddToCart={addProduct}
                    selectedCrypto={selectedCrypto}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Product Button */}
        <div className="demo-section">
          <div className="container">
            <button 
              className="demo-btn"
              onClick={handleAddDemoProduct}
            >
              <i className="fas fa-plus"></i>
              Add Demo Product
            </button>
        </div>
      </div>
    </>
    );
  };

  return (
    <div className="products-page">
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products;
