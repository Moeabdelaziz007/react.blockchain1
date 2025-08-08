import React from 'react';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';

const ModernProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { id, title, price, image, category } = product;

  const handleAddToCart = () => {
    dispatch(addCart({ ...product, qty: 1 }));
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={image}
        alt={title}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">{category}</p>
        <p className="card-text fw-bold">${price}</p>
        <button
          className="btn btn-primary w-100"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ModernProductCard;
