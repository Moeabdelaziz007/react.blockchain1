import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            </div>
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-subtitle">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/product" className="continue-shopping-btn">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    
    return (
      <>
        <div className="cart-container">
          <div className="container">
            <div className="cart-header">
              <h1 className="cart-title">
                Shopping <span className="highlight">Cart</span>
              </h1>
              <p className="cart-subtitle">
                Review your items and proceed to checkout
              </p>
            </div>

            <div className="cart-content">
              <div className="cart-items">
                <div className="cart-items-header">
                  <h3>Cart Items ({totalItems})</h3>
                </div>
                
                <div className="cart-items-list">
                  {state.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="item-img"
                        />
                      </div>

                      <div className="item-details">
                        <h4 className="item-title">{item.title}</h4>
                        <p className="item-price">${item.price}</p>
                      </div>

                      <div className="item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => removeItem(item)}
                          aria-label="Decrease quantity"
                        >
                          <i className="fas fa-minus" aria-hidden="true"></i>
                        </button>
                        
                        <span className="quantity-display">{item.qty}</span>
                        
                        <button
                          className="quantity-btn"
                          onClick={() => addItem(item)}
                          aria-label="Increase quantity"
                        >
                          <i className="fas fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>

                      <div className="item-total">
                        <span className="total-amount">${(item.price * item.qty).toFixed(2)}</span>
                      </div>

                      <button
                        className="remove-item-btn"
                        onClick={() => removeItem(item)}
                        aria-label="Remove item"
                      >
                        <i className="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h3 className="summary-title">Order Summary</h3>
                  
                  <div className="summary-items">
                    <div className="summary-item">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-item">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-item total">
                      <span>Total</span>
                      <span>${(subtotal + shipping).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="summary-actions">
                    <button className="checkout-btn">
                      <i className="fas fa-credit-card" aria-hidden="true"></i>
                      Proceed to Checkout
                    </button>
                    
                    <Link to="/product" className="continue-shopping-link">
                      <i className="fas fa-arrow-left" aria-hidden="true"></i>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      {state.length === 0 ? <EmptyCart /> : <ShowCart />}
      <Footer />
    </>
  );
};

export default Cart;
