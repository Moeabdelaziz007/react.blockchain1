import React from 'react'
import { Footer, Navbar } from "../components"
import ProductsComponent from "../components/Products"

const Products = () => {
  return (
    <>
      <Navbar />

      <section className="hero-section" aria-label="Latest products">
        <div className="container text-center py-5">
          <span className="badge hero-badge mb-3"><i className="fas fa-box-open me-2" aria-hidden="true"></i>Catalog</span>
          <h1 className="hero-title mb-2">Latest Products</h1>
          <p className="hero-subtitle mb-0">Hand-picked items with a clean, modern layout.</p>
        </div>
        <div className="hero-glow" />
      </section>

      <ProductsComponent />
      <Footer />
    </>
  )
}

export default Products