import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FiShoppingCart, FiMenu, FiLogOut, FiLogIn, FiShield } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { cartCount } = useCart();
  const { logoSettings } = useSettings();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "active-link" : "";

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
            <Nav.Link as={Link} to="/" className={isActive("/")}>Home</Nav.Link>
            <Nav.Link as={Link} to="/shop" className={isActive("/shop")}>Shop</Nav.Link>
            <Nav.Link as={Link} to="/about" className={isActive("/about")}>About Us</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={isActive("/contact")}>Contact</Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className={`admin-nav-link ${isActive("/admin")}`}>
                <FiShield size={14} className="me-1" /> Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="navbar-actions align-items-center gap-2">
            {/* Cart icon */}
            <Nav.Link as={Link} to="/cart" className="cart-nav-btn position-relative">
              <FiShoppingCart size={22} className="cart-icon" />
              {cartCount > 0 && (
                <Badge pill bg="danger" className="cart-badge position-absolute">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* Auth section */}
            {isLoggedIn ? (
              <NavDropdown
                title={
                  <div className="user-avatar-trigger d-inline-flex align-items-center gap-2">
                    <div className="user-avatar-circle">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name-label d-none d-lg-inline">{user?.name?.split(" ")[0]}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="user-dropdown"
              >
                <NavDropdown.Header className="user-dropdown-header">
                  <div className="fw-semibold">{user?.name}</div>
                  <div className="text-muted small">{user?.email}</div>
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/cart">
                  <FiShoppingCart className="me-2" size={14} /> My Cart
                </NavDropdown.Item>
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin">
                    <FiShield className="me-2" size={14} /> Admin Portal
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="logout-item">
                  <FiLogOut className="me-2" size={14} /> Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/auth" className="btn-signin-nav">
                <FiLogIn size={16} className="me-1" /> Sign In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
