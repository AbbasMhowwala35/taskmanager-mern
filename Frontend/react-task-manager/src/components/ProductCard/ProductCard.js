import React from "react";
import { Card, Button } from "react-bootstrap";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const productId = product._id || product.id;
  const image = Array.isArray(product.image) ? product.image[0] : product.image;
  const category = typeof product.category === "object" ? product.category?.name : product.category;

  return (
    <Card className="product-card h-100 border-0 shadow-sm">
      <div className="product-img-wrapper position-relative overflow-hidden">
        <Link to={`/products/${productId}`}>
          <Card.Img variant="top" src={image} alt={product.name} className="product-image" />
        </Link>
        <span className="product-category-badge position-absolute">{category}</span>
      </div>
      
      <Card.Body className="d-flex flex-column p-4">
        <div className="product-rating d-flex align-items-center mb-2">
          <FiStar className="star-icon filled" />
          <span className="rating-val ms-1">{product.rating}</span>
          <span className="rating-count ms-1">({product.reviews})</span>
        </div>

        <Card.Title className="product-title mb-2">
          <Link to={`/products/${productId}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </Card.Title>
        
        <Card.Text className="product-desc flex-grow-1 mb-3">
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="product-price">₹{Number(product.price).toFixed(2)}</span>
          <Button 
            onClick={() => addToCart(product)} 
            className="btn-add-to-cart d-flex align-items-center gap-2"
          >
            <FiShoppingCart /> Add
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
