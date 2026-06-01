import React from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { FiTruck, FiShield, FiPhoneCall, FiRotateCcw } from "react-icons/fi";
import { useSettings } from "../../context/SettingsContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Home.css";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const { heroSlides } = useSettings();

  const fetchProducts = async () => {
    const response = await axios.get(
      `${REACT_API_URL}/products`
    );
    setProducts(response.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.filter((product) => product.featured);

  const handleShopNow = () => {
    const section = document.getElementById("featured-products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* Dynamic Hero Slider */}
      <Carousel
        controls={heroSlides.length > 1}
        indicators={heroSlides.length > 1}
        interval={6000}
        className="hero-slider"
      >
        {heroSlides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div className="hero-slide-bg py-5 d-flex align-items-center" style={{ minHeight: "550px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
              <Container>
                <Row className="align-items-center gy-4">
                  <Col lg={6} className="hero-content text-lg-start text-center">
                    <h1 className="hero-title mb-3">
                      {slide.title}
                    </h1>
                    <p className="hero-subtitle mb-4">
                      {slide.subtitle}
                    </p>
                    <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                      {slide.ctaText && (
                        <Button
                          onClick={() => {
                            if (slide.ctaLink.startsWith("#") || slide.ctaLink.startsWith("featured-products")) {
                              const targetId = slide.ctaLink.replace("#", "");
                              const section = document.getElementById(targetId);
                              if (section) {
                                section.scrollIntoView({ behavior: "smooth" });
                              } else {
                                handleShopNow();
                              }
                            } else {
                              window.location.href = slide.ctaLink;
                            }
                          }}
                          className="btn-shop-now py-3 px-4"
                        >
                          {slide.ctaText}
                        </Button>
                      )}
                    </div>
                  </Col>
                  <Col lg={6} className="text-center position-relative">
                    <div className="hero-image-container">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="img-fluid hero-image rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                      />
                      <div className="accent-blob-1"></div>
                      <div className="accent-blob-2"></div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Features/Benefits Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row className="gy-4 text-center">
            <Col md={3} sm={6}>
              <div className="feature-card p-4 rounded-3 h-100 bg-white shadow-sm">
                <div className="feature-icon-wrapper mb-3 mx-auto">
                  <FiTruck size={24} />
                </div>
                <h5 className="feature-title mb-2">Free Delivery</h5>
                <p className="feature-text text-muted mb-0">Free delivery on all orders over $150</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card p-4 rounded-3 h-100 bg-white shadow-sm">
                <div className="feature-icon-wrapper mb-3 mx-auto">
                  <FiShield size={24} />
                </div>
                <h5 className="feature-title mb-2">Secure Payments</h5>
                <p className="feature-text text-muted mb-0">100% SSL protected transactions</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card p-4 rounded-3 h-100 bg-white shadow-sm">
                <div className="feature-icon-wrapper mb-3 mx-auto">
                  <FiRotateCcw size={24} />
                </div>
                <h5 className="feature-title mb-2">Easy Returns</h5>
                <p className="feature-text text-muted mb-0">30-day money-back guarantee</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card p-4 rounded-3 h-100 bg-white shadow-sm">
                <div className="feature-icon-wrapper mb-3 mx-auto">
                  <FiPhoneCall size={24} />
                </div>
                <h5 className="feature-title mb-2">24/7 Support</h5>
                <p className="feature-text text-muted mb-0">Dedicated support team online 24/7</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="products-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <span className="section-label text-uppercase">Curated Items</span>
            <h2 className="section-title mt-1 mb-2">Featured Products</h2>
            <p className="section-subtitle text-muted mx-auto">
              Handpicked options featuring timeless design and superior functionality.
            </p>
          </div>

          <Row className="gy-4">
            {featuredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Promotion/CTA Banner */}
      <section className="promo-section py-5 text-white position-relative overflow-hidden mb-5">
        <div className="promo-overlay position-absolute top-0 start-0 w-100 h-100"></div>
        <Container className="position-relative z-index-2 py-4">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <span className="promo-tag mb-2 d-inline-block text-uppercase">Limited Time Offer</span>
              <h2 className="promo-title mb-3">Upgrade Your Setup & Save 15%</h2>
              <p className="promo-desc mb-4 text-white-50">
                Unlock exclusive pricing on our premier office collections. Use checkout code <strong className="text-white">SETUP15</strong> at checkout. Offer ends Sunday.
              </p>
              <Button onClick={handleShopNow} className="btn-promo-action py-3 px-4">
                Shop Special Offers
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
