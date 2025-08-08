import React from 'react';
import EnhancedProductCard from '../components/EnhancedProductCard';
import './ProductCardDemo.css';

const ProductCardDemo = () => {
  // Sample product data for testing
  const sampleProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation technology for immersive audio experience",
      price: 129.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      stock: 50,
      rating: 4.5,
      reviews: 120,
      variants: ['Small', 'Medium', 'Large']
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      description: "Timeless denim jacket perfect for any casual occasion with comfortable fit",
      price: 89.99,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=300&fit=crop",
      stock: 0, // Out of stock
      rating: 4.2,
      reviews: 85,
      variants: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: 3,
      name: "Elegant Pearl Necklace",
      description: "Beautiful pearl necklace for special occasions with premium craftsmanship",
      price: 199.99,
      category: "Jewelry",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
      stock: 5, // Low stock
      rating: 4.8,
      reviews: 45,
      variants: ['16"', '18"', '20"', '24"']
    },
    {
      id: 4,
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitoring and GPS capabilities",
      price: 249.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      stock: 25,
      rating: 4.6,
      reviews: 200,
      variants: ['38mm', '42mm', '44mm']
    },
    {
      id: 5,
      name: "Summer Floral Dress",
      description: "Light and comfortable summer dress with beautiful floral pattern design",
      price: 79.99,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
      stock: 8, // Low stock
      rating: 4.3,
      reviews: 95,
      variants: ['XS', 'S', 'M', 'L']
    },
    {
      id: 6,
      name: "Leather Crossbody Bag",
      description: "Stylish leather bag perfect for everyday use with multiple compartments",
      price: 149.99,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
      stock: 20,
      rating: 4.4,
      reviews: 75,
      variants: ['Small', 'Medium', 'Large']
    }
  ];

  return (
    <div className="product-card-demo">
      <div className="container">
        {/* Header */}
        <div className="demo-header">
          <h1 className="demo-title">
            Enhanced Product Card <span className="highlight">Demo</span>
          </h1>
          <p className="demo-subtitle">
            Responsive product cards with modern UI/UX design, featuring stock management, 
            variant selection, and accessibility features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt" aria-hidden="true"></i>
            </div>
            <h3>Responsive Design</h3>
            <p>Adapts perfectly to all screen sizes from mobile to desktop</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-star" aria-hidden="true"></i>
            </div>
            <h3>Rating System</h3>
            <p>Visual star ratings with review counts for user trust</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-box" aria-hidden="true"></i>
            </div>
            <h3>Stock Management</h3>
            <p>Smart stock indicators and out-of-stock handling</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-universal-access" aria-hidden="true"></i>
            </div>
            <h3>Accessibility</h3>
            <p>WCAG compliant with keyboard navigation and screen readers</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          <h2 className="section-title">Product Cards Showcase</h2>
          <div className="products-grid">
            {sampleProducts.map((product) => (
              <div key={product.id} className="product-wrapper">
                <EnhancedProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Layout Approach */}
        <div className="layout-info">
          <h3>Layout Approach</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>CSS Grid & Flexbox</h4>
              <p>Uses CSS Grid for overall layout and Flexbox for card content alignment, ensuring consistent spacing and responsive behavior.</p>
            </div>
            <div className="info-item">
              <h4>Mobile-First Design</h4>
              <p>Built with mobile-first approach using responsive breakpoints at 480px and 768px for optimal viewing on all devices.</p>
            </div>
            <div className="info-item">
              <h4>Accessibility First</h4>
              <p>Implements proper ARIA labels, keyboard navigation, focus management, and screen reader support for inclusive design.</p>
            </div>
          </div>
        </div>

        {/* Responsiveness Considerations */}
        <div className="responsiveness-info">
          <h3>Responsiveness Considerations</h3>
          <div className="considerations-grid">
            <div className="consideration">
              <h4>📱 Mobile (≤480px)</h4>
              <ul>
                <li>Reduced padding and font sizes</li>
                <li>Simplified button interactions</li>
                <li>Optimized touch targets</li>
              </ul>
            </div>
            <div className="consideration">
              <h4>📱 Tablet (481px-768px)</h4>
              <ul>
                <li>Balanced spacing and typography</li>
                <li>Maintained hover effects</li>
                <li>Optimized grid layout</li>
              </ul>
            </div>
            <div className="consideration">
                             <h4>🖥️ Desktop (&gt;768px)</h4>
              <ul>
                <li>Full feature set with hover effects</li>
                <li>Larger touch targets</li>
                <li>Enhanced visual feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDemo;
