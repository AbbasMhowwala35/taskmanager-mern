import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import "./Header.css";

const Header = () => {
  const { cartCount } = useCart();
  const { logoSettings } = useSettings();
  const location = useLocation();

  return (
    <Navbar expand="lg" className="navbar-custom sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          <span>{logoSettings.prefix}</span>{logoSettings.suffix}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
          <FiMenu size={24} />
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto navbar-links">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === "/" ? "active-link" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={location.pathname === "/about" ? "active-link" : ""}
            >
              About Us
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={location.pathname === "/contact" ? "active-link" : ""}
            >
              Contact
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className={location.pathname === "/admin" ? "active-link" : ""}
            >
              Admin Portal
            </Nav.Link>
          </Nav>
          
          <Nav className="navbar-actions">
            <Nav.Link as={Link} to="/cart" className="cart-nav-btn position-relative">
              <FiShoppingCart size={22} className="cart-icon" />
              {cartCount > 0 && (
                <Badge pill bg="danger" className="cart-badge position-absolute">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
