import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await adminLogin(formData.email, formData.password);
      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Check your credentials.";
      setAlert({ type: "danger", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="admin-login-wrapper">
          {/* Shield badge */}
          <div className="admin-login-badge mb-4">
            <FiShield size={28} />
          </div>

          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-sub text-muted mb-4">
            Restricted access. Authorized administrators only.
          </p>

          <Card className="admin-login-card border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              {alert && (
                <Alert variant={alert.type} className="mb-4 rounded-3" onClose={() => setAlert(null)} dismissible>
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="adminEmail">
                  <Form.Label className="admin-form-label">Admin Email</Form.Label>
                  <div className="input-icon-wrapper">
                    <FiMail className="input-icon" />
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@vibestore.com"
                      className="admin-login-input ps-5"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="adminPassword">
                  <Form.Label className="admin-form-label">Password</Form.Label>
                  <div className="input-icon-wrapper">
                    <FiLock className="input-icon" />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="admin-login-input ps-5 pe-5"
                      required
                    />
                    <button
                      type="button"
                      className="input-icon-right"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="admin-login-btn w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <><Spinner animation="border" size="sm" className="me-2" /> Verifying...</>
                  ) : (
                    "Access Admin Panel"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center mt-4 text-muted small">
            Not an admin?{" "}
            <a href="/" className="text-decoration-none" style={{ color: "#4f46e5" }}>
              Back to Store
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AdminLogin;
