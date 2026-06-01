import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FiAward, FiHeart, FiSettings } from "react-icons/fi";
import "./About.css";

const About = () => {
  return (
    <div className="about-page py-5">
      {/* Intro Banner */}
      <section className="about-hero text-center mb-5 py-4">
        <Container>
          <span className="about-label text-uppercase">Who We Are</span>
          <h1 className="about-title mt-2 mb-3">Crafting the Perfect Setup</h1>
          <p className="about-subtitle text-muted mx-auto">
            VibeStore was founded with a simple mission: to provide beautifully designed, high-quality tools that enhance your digital workspace and lifestyle.
          </p>
        </Container>
      </section>

      {/* Story & Image Section */}
      <section className="about-story mb-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <h2 className="story-heading mb-4">Our Story</h2>
              <p className="story-text text-muted mb-3">
                As creators, designers, and developers, we spend hours at our desks every single day. We realized that our environment directly impacts our productivity, creativity, and overall well-being.
              </p>
              <p className="story-text text-muted mb-3">
                However, finding peripherals and desk items that were both premium and minimalist proved to be a challenge. Most products were either low quality or overly flash game-oriented.
              </p>
              <p className="story-text text-muted mb-0">
                That's why we launched VibeStore. We curate and build items that combine premium materials—like full-grain leather, American walnut, and anodized aluminum—with elegant designs to elevate your daily grind.
              </p>
            </Col>
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60" 
                  alt="Modern office space" 
                  className="img-fluid rounded-4 shadow-sm"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="about-values py-5 bg-light rounded-4 my-5">
        <Container>
          <h2 className="section-title text-center mb-5">Our Core Values</h2>
          <Row className="gy-4">
            <Col md={4}>
              <Card className="value-card h-100 border-0 p-3 text-center shadow-sm">
                <Card.Body>
                  <div className="value-icon mb-3 mx-auto">
                    <FiAward size={24} />
                  </div>
                  <Card.Title className="value-title mb-2">Uncompromising Quality</Card.Title>
                  <Card.Text className="text-muted">
                    We select materials that are built to last and look better with age, ensuring you get premium components in every package.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="value-card h-100 border-0 p-3 text-center shadow-sm">
                <Card.Body>
                  <div className="value-icon mb-3 mx-auto">
                    <FiSettings size={24} />
                  </div>
                  <Card.Title className="value-title mb-2">Minimalist Design</Card.Title>
                  <Card.Text className="text-muted">
                    We remove the unnecessary clutter, focusing on clean lines, neutral colors, and high functionality for any setup.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="value-card h-100 border-0 p-3 text-center shadow-sm">
                <Card.Body>
                  <div className="value-icon mb-3 mx-auto">
                    <FiHeart size={24} />
                  </div>
                  <Card.Title className="value-title mb-2">Customer First</Card.Title>
                  <Card.Text className="text-muted">
                    From pre-order to long-term ownership, we provide transparent support and a standard-setting shopping experience.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="about-stats py-4 text-center">
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <div className="stat-item">
                <h3 className="stat-number">10k+</h3>
                <p className="stat-label text-muted">Happy Customers</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-item">
                <h3 className="stat-number">15+</h3>
                <p className="stat-label text-muted">Curated Collections</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-item">
                <h3 className="stat-number">99.8%</h3>
                <p className="stat-label text-muted">Positive Feedback</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
