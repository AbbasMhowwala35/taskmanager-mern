import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { useSettings } from "../../context/SettingsContext";
import "./Footer.css";

const Footer = () => {
  const { logoSettings, socialLinks, categories } = useSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="footer-custom">
      <Container>
        <Row className="gy-4 py-5">
          {/* Brand & Socials */}
          <Col lg={4} md={6}>
            <h5 className="footer-brand mb-3">
              <span>{logoSettings.prefix}</span>{logoSettings.suffix}
            </h5>
            <p className="footer-text mb-4">
              Providing premium products, exceptional design, and curated collections for your home, office, and lifestyle. Elevate your everyday workspace.
            </p>
            <div className="footer-socials d-flex gap-3">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FiFacebook size={18} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FiTwitter size={18} />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FiInstagram size={18} />
                </a>
              )}
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h6 className="footer-title mb-3">Explore</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </Col>

          {/* Categories */}
          <Col lg={2} md={6}>
            <h6 className="footer-title mb-3">Categories</h6>
            <ul className="list-unstyled footer-links">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <a href={`/#featured-products`}>{cat}</a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={6}>
            <h6 className="footer-title mb-3">Stay Updated</h6>
            <p className="footer-text mb-3">Subscribe to receive notifications about new collections and exclusive discounts.</p>
            <Form onSubmit={handleSubmit} className="footer-newsletter d-flex gap-2">
              <Form.Control 
                type="email" 
                placeholder="Your email address" 
                className="newsletter-input" 
                required 
              />
              <Button type="submit" className="btn-primary-custom">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <div className="footer-bottom border-top py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0 text-muted footer-copyright">
            &copy; {new Date().getFullYear()} {logoSettings.prefix}{logoSettings.suffix}. All rights reserved.
          </p>
          <div className="footer-bottom-links d-flex gap-4">
            <a href="#privacy" className="text-muted text-decoration-none">Privacy Policy</a>
            <a href="#terms" className="text-muted text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
