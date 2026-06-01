import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FiCheckCircle, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  const shipping = cartTotal > 150 || cartTotal === 0 ? 0 : 15.00;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <Container className="success-checkout-container text-center py-5">
        <div className="success-icon mb-4 text-success">
          <FiCheckCircle size={72} />
        </div>
        <h2 className="success-title mb-3">Order Placed Successfully!</h2>
        <p className="success-text text-muted mb-4">
          Thank you for your purchase. We've sent a confirmation email with details of your order.
        </p>
        <Button as={Link} to="/" className="btn-shop-now py-3 px-4">
          Back To Home
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="empty-cart-container text-center py-5">
        <h2 className="empty-cart-title mb-3">No Items to Checkout</h2>
        <p className="empty-cart-text text-muted mb-4">
          Your cart is currently empty. Add some products before checking out.
        </p>
        <Button as={Link} to="/" className="btn-shop-now py-3 px-4">
          Go To Store
        </Button>
      </Container>
    );
  }

  return (
    <div className="checkout-page py-5">
      <Container>
        <div className="mb-4">
          <Link to="/cart" className="back-to-cart-link d-inline-flex align-items-center gap-2 text-decoration-none text-muted">
            <FiArrowLeft /> Back to Cart
          </Link>
        </div>
        
        <h1 className="checkout-page-title mb-5">Checkout</h1>

        <Form onSubmit={handleSubmit}>
          <Row className="gy-4">
            {/* Form Details */}
            <Col lg={7}>
              <div className="d-flex flex-column gap-4">
                {/* Shipping Details */}
                <Card className="checkout-form-card border-0 shadow-sm p-4">
                  <h4 className="checkout-section-title mb-4">Shipping Information</h4>
                  <Row className="gy-3">
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label className="form-label-custom">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label className="form-label-custom">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="email">
                        <Form.Label className="form-label-custom">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="address">
                        <Form.Label className="form-label-custom">Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="city">
                        <Form.Label className="form-label-custom">City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="zipCode">
                        <Form.Label className="form-label-custom">Zip / Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>

                {/* Payment Details */}
                <Card className="checkout-form-card border-0 shadow-sm p-4">
                  <h4 className="checkout-section-title mb-4 d-flex align-items-center gap-2">
                    <FiCreditCard /> Payment Details
                  </h4>
                  <Row className="gy-3">
                    <Col md={12}>
                      <Form.Group controlId="cardName">
                        <Form.Label className="form-label-custom">Name on Card</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="cardNumber">
                        <Form.Label className="form-label-custom">Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="cardExpiry">
                        <Form.Label className="form-label-custom">Expiry Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="cardCvv">
                        <Form.Label className="form-label-custom">CVV</Form.Label>
                        <Form.Control
                          type="password"
                          name="cardCvv"
                          maxLength={3}
                          placeholder="***"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>

            {/* Sidebar Review */}
            <Col lg={5}>
              <div className="position-sticky" style={{ top: "100px" }}>
                <Card className="checkout-summary-card border-0 shadow-sm p-4">
                  <h4 className="summary-title mb-4">Review Your Order</h4>
                  
                  <div className="checkout-items-list mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout-item-row d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="checkout-item-thumb rounded-2"
                          />
                          <div>
                            <h6 className="item-name mb-0">{item.name}</h6>
                            <span className="item-qty text-muted">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="item-price font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="my-3" />

                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="summary-row d-flex justify-content-between mb-3">
                    <span className="text-muted">Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <hr className="my-3" />

                  <div className="summary-row d-flex justify-content-between mb-4">
                    <span className="total-label font-bold">Total</span>
                    <span className="total-val font-bold">${finalTotal.toFixed(2)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="btn-pay w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    Place Order - ${finalTotal.toFixed(2)}
                  </Button>
                </Card>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Checkout;
