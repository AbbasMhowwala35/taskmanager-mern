import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  const shipping = cartTotal > 150 || cartTotal === 0 ? 0 : 15.00;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <Container className="empty-cart-container text-center py-5">
        <div className="empty-cart-icon mb-4">
          <FiShoppingBag size={64} />
        </div>
        <h2 className="empty-cart-title mb-3">Your Cart is Empty</h2>
        <p className="empty-cart-text text-muted mb-4">
          Looks like you haven't added anything to your cart yet. Check out our latest workspace additions!
        </p>
        <Button as={Link} to="/" className="btn-shop-now py-3 px-4">
          Go To Store
        </Button>
      </Container>
    );
  }

  return (
    <div className="cart-page py-5">
      <Container>
        <h1 className="cart-page-title mb-5">Your Cart</h1>
        <Row className="gy-4">
          {/* Cart Table */}
          <Col lg={8}>
            <div className="cart-table-wrapper bg-white shadow-sm rounded-4 overflow-hidden p-3 p-md-4">
              <Table responsive borderless className="align-middle cart-table">
                <thead>
                  <tr className="border-bottom text-muted uppercase-headers">
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="text-end">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-bottom">
                      <td>
                        <div className="d-flex align-items-center gap-3 py-2">
                          <img 
                            src={Array.isArray(item.image) ? item.image[0] : item.image}
                            alt={item.name} 
                            className="cart-item-image rounded-3"
                          />
                          <div>
                            <h6 className="cart-item-name mb-1">{item.name}</h6>
                            <span className="cart-item-cat text-muted">{item.category}</span>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>
                        <div className="qty-control d-flex align-items-center gap-2">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="text-end font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="btn-remove-item"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>

          {/* Cart Summary */}
          <Col lg={4}>
            <div className="cart-summary-card bg-white shadow-sm rounded-4 p-4">
              <h4 className="summary-title mb-4">Order Summary</h4>
              
              <div className="summary-row d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row d-flex justify-content-between mb-3">
                <span className="text-muted">Estimated Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr className="my-4" />

              <div className="summary-row d-flex justify-content-between mb-4">
                <span className="total-label font-bold">Total</span>
                <span className="total-val font-bold">₹{finalTotal.toFixed(2)}</span>
              </div>

              <Button 
                as={Link} 
                to="/checkout" 
                className="btn-checkout w-100 py-3 d-flex align-items-center justify-content-center gap-2"
              >
                Proceed to Checkout <FiArrowRight />
              </Button>

              {shipping > 0 && (
                <p className="shipping-notice text-center text-muted mt-3 mb-0">
                  Add <strong className="text-dark">₹{(150 - cartTotal).toFixed(2)}</strong> more to unlock Free Shipping!
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
