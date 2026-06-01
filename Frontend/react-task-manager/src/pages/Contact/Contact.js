import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your message has been sent successfully.`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page py-5">
      {/* Page Header */}
      <section className="contact-hero text-center mb-5 py-4">
        <Container>
          <span className="contact-label text-uppercase">Get In Touch</span>
          <h1 className="contact-title mt-2 mb-3">We'd Love to Hear From You</h1>
          <p className="contact-subtitle text-muted mx-auto">
            Have questions about our collections, custom designs, or an existing order? Drop us a line and our team will get back to you within 24 hours.
          </p>
        </Container>
      </section>

      <section className="contact-content">
        <Container>
          <Row className="gy-5">
            {/* Contact Details */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-4">
                <Card className="contact-info-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start gap-3">
                    <div className="contact-info-icon">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <h5 className="contact-info-title mb-1">Email Us</h5>
                      <a href="mailto:support@vibestore.com" className="contact-info-link text-decoration-none">
                        support@vibestore.com
                      </a>
                      <p className="contact-info-sub text-muted mb-0">For general and sales inquiries</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="contact-info-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start gap-3">
                    <div className="contact-info-icon">
                      <FiPhone size={20} />
                    </div>
                    <div>
                      <h5 className="contact-info-title mb-1">Call Us</h5>
                      <a href="tel:+15550199" className="contact-info-link text-decoration-none">
                        +1 (555) 0199
                      </a>
                      <p className="contact-info-sub text-muted mb-0">Mon - Fri, 9am - 6pm EST</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="contact-info-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-start gap-3">
                    <div className="contact-info-icon">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <h5 className="contact-info-title mb-1">Our Studio</h5>
                      <p className="contact-info-link text-dark mb-0">
                        128 Design District, Suite 400
                      </p>
                      <p className="contact-info-sub text-muted mb-0">Brooklyn, NY 11201</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

            {/* Contact Form */}
            <Col lg={8}>
              <Card className="contact-form-card border-0 shadow-sm p-4 p-md-5">
                <h3 className="form-heading mb-4">Send Message</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="gy-3">
                    <Col md={6}>
                      <Form.Group controlId="name">
                        <Form.Label className="form-label-custom">Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label className="form-label-custom">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="subject">
                        <Form.Label className="form-label-custom">Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          placeholder="Product Inquiry / Order Status"
                          value={formData.subject}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="message">
                        <Form.Label className="form-label-custom">Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          placeholder="Tell us what you need help with..."
                          value={formData.message}
                          onChange={handleChange}
                          className="form-input-custom"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="text-end mt-4">
                      <Button type="submit" className="btn-submit-contact d-inline-flex align-items-center gap-2 py-3 px-4">
                        <FiSend /> Send Message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
