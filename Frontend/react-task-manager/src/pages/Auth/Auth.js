import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, forgotPassword, resetPassword } = useAuth();

  // "login" | "signup" | "forgot" | "reset"
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: "success"|"danger", message }
  const [resetToken, setResetToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert(null);
  };

  const showAlert = (type, message) => setAlert({ type, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        navigate("/");
      } else if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          return showAlert("danger", "Passwords do not match.");
        }
        await register(formData.name, formData.email, formData.password);
        navigate("/");
      } else if (mode === "forgot") {
        const res = await forgotPassword(formData.email);
        showAlert("success", res.message);
        // In dev we get the raw reset token back — store it so user can use it
        if (res.data?.resetToken) {
          setResetToken(res.data.resetToken);
          showAlert("success", `Reset token: ${res.data.resetToken} — use this in the reset form.`);
          setMode("reset");
        }
      } else if (mode === "reset") {
        if (formData.password !== formData.confirmPassword) {
          return showAlert("danger", "Passwords do not match.");
        }
        await resetPassword(resetToken, formData.password);
        showAlert("success", "Password reset! You can now log in.");
        setTimeout(() => setMode("login"), 2000);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      showAlert("danger", msg);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: { heading: "Welcome back", sub: "Log in to your account to continue shopping." },
    signup: { heading: "Create an account", sub: "Join VibeStore and start your premium journey." },
    forgot: { heading: "Forgot password?", sub: "Enter your email and we'll send you a reset link." },
    reset: { heading: "Reset your password", sub: "Enter your new password below." }
  };

  const { heading, sub } = titles[mode];

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={7}>
            <div className="auth-wrapper">
              {/* Left accent strip */}
              <div className="auth-accent d-none d-md-flex">
                <div className="auth-accent-inner">
                  <div className="auth-brand mb-4">
                    <span>Vibe</span>Store
                  </div>
                  <h2 className="auth-accent-title">Your premium workspace starts here.</h2>
                  <p className="auth-accent-sub">Discover curated tech peripherals, audio gear and wearables delivered to your door.</p>
                  <div className="auth-dots mt-4 d-flex gap-2">
                    <span className={mode === "login" ? "dot active" : "dot"}></span>
                    <span className={mode === "signup" ? "dot active" : "dot"}></span>
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <Card className="auth-card border-0">
                <Card.Body className="p-4 p-md-5">
                  <h3 className="auth-heading mb-1">{heading}</h3>
                  <p className="auth-subheading text-muted mb-4">{sub}</p>

                  {alert && (
                    <Alert variant={alert.type} className="auth-alert" onClose={() => setAlert(null)} dismissible>
                      {alert.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Name — signup only */}
                    {mode === "signup" && (
                      <Form.Group className="mb-3" controlId="authName">
                        <Form.Label className="auth-label">Full Name</Form.Label>
                        <div className="input-icon-wrapper">
                          <FiUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="auth-input ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    )}

                    {/* Email */}
                    {(mode !== "reset") && (
                      <Form.Group className="mb-3" controlId="authEmail">
                        <Form.Label className="auth-label">Email Address</Form.Label>
                        <div className="input-icon-wrapper">
                          <FiMail className="input-icon" />
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="auth-input ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    )}

                    {/* Password */}
                    {(mode === "login" || mode === "signup" || mode === "reset") && (
                      <Form.Group className="mb-3" controlId="authPassword">
                        <Form.Label className="auth-label">
                          {mode === "reset" ? "New Password" : "Password"}
                        </Form.Label>
                        <div className="input-icon-wrapper">
                          <FiLock className="input-icon" />
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className="auth-input ps-5 pe-5"
                            required
                          />
                          <button
                            type="button"
                            className="input-icon-right"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password"
                          >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </Form.Group>
                    )}

                    {/* Confirm Password */}
                    {(mode === "signup" || mode === "reset") && (
                      <Form.Group className="mb-4" controlId="authConfirmPassword">
                        <Form.Label className="auth-label">Confirm Password</Form.Label>
                        <div className="input-icon-wrapper">
                          <FiLock className="input-icon" />
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className="auth-input ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    )}

                    {/* Forgot link — login mode */}
                    {mode === "login" && (
                      <div className="d-flex justify-content-end mb-3">
                        <button type="button" className="auth-link-btn" onClick={() => setMode("forgot")}>
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Reset token input — reset mode (manual entry fallback) */}
                    {mode === "reset" && !resetToken && (
                      <Form.Group className="mb-3" controlId="authResetToken">
                        <Form.Label className="auth-label">Reset Token</Form.Label>
                        <Form.Control
                          type="text"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="Paste reset token from email"
                          className="auth-input"
                          required
                        />
                      </Form.Group>
                    )}

                    <Button
                      type="submit"
                      className="auth-submit-btn w-100 d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <><Spinner animation="border" size="sm" /> Processing...</>
                      ) : (
                        <>{mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Reset Password"} <FiArrowRight /></>
                      )}
                    </Button>
                  </Form>

                  {/* Mode switchers */}
                  <div className="auth-switch text-center mt-4">
                    {mode === "login" && (
                      <p className="mb-0 text-muted">
                        Don't have an account?{" "}
                        <button className="auth-link-btn fw-semibold" onClick={() => setMode("signup")}>Create one</button>
                      </p>
                    )}
                    {mode === "signup" && (
                      <p className="mb-0 text-muted">
                        Already have an account?{" "}
                        <button className="auth-link-btn fw-semibold" onClick={() => setMode("login")}>Sign in</button>
                      </p>
                    )}
                    {(mode === "forgot" || mode === "reset") && (
                      <p className="mb-0 text-muted">
                        <button className="auth-link-btn fw-semibold" onClick={() => setMode("login")}>← Back to Sign In</button>
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
