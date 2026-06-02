import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FiArrowLeft, FiShoppingCart, FiStar } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  const { addToCart } = useCart();
  const { isLoggedIn, authHeader } = useAuth();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const response = await axios.get(`${REACT_API_URL}/products/${id}`);
    setProduct(response.data.data);
    setSimilarProducts(response.data.similarProducts || []);
    setActiveImage(0);
    setLoading(false);
  }, [REACT_API_URL, id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    try {
      await axios.post(`${REACT_API_URL}/products/${id}/reviews`, reviewForm, {
        headers: authHeader()
      });
      setReviewForm({ rating: 5, comment: "" });
      setReviewMessage("Review added successfully.");
      fetchProduct();
    } catch (error) {
      setReviewMessage(error.response?.data?.message || "Unable to add review.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center py-5">
        <h2>Product not found</h2>
        <Button as={Link} to="/shop" className="mt-3">Back to Shop</Button>
      </Container>
    );
  }

  const images = product.image?.length ? product.image : [""];
  const category = typeof product.category === "object" ? product.category?.name : product.category;

  return (
    <div className="product-details-page py-5">
      <Container>
        <Link to="/shop" className="back-link d-inline-flex align-items-center gap-2 mb-4">
          <FiArrowLeft /> Back to Shop
        </Link>

        <Row className="gy-5">
          <Col lg={6}>
            <div className="product-gallery">
              <div className="gallery-main">
                <img src={images[activeImage]} alt={product.name} />
              </div>
              <div className="gallery-thumbs">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={activeImage === index ? "active" : ""}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="product-info">
              <span className="detail-category">{category}</span>
              <h1>{product.name}</h1>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiStar className="star-icon filled" />
                <strong>{Number(product.rating || 0).toFixed(1)}</strong>
                <span className="text-muted">({product.reviews || 0} reviews)</span>
              </div>
              <p className="detail-description">{product.description}</p>
              <div className="detail-price mb-4">₹{Number(product.price).toFixed(2)}</div>

              <div className="detail-meta mb-4">
                <div><span>Brand</span><strong>{product.brand || "Store Pick"}</strong></div>
                <div><span>Stock</span><strong>{product.countInStock > 0 ? `${product.countInStock} available` : "Out of stock"}</strong></div>
              </div>

              <div className="spec-list mb-4">
                {(product.specs || []).map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>

              <Button
                className="btn-add-detail d-inline-flex align-items-center gap-2"
                onClick={() => addToCart(product)}
                disabled={product.countInStock <= 0}
              >
                <FiShoppingCart /> Add to Cart
              </Button>
            </div>
          </Col>
        </Row>

        <section className="details-section">
          <Row className="gy-4">
            <Col lg={7}>
              <h3 className="section-heading">Customer Reviews</h3>
              <div className="reviews-list">
                {product.reviewList?.length ? product.reviewList.map((review) => (
                  <div className="review-row" key={review._id || `${review.name}-${review.createdAt}`}>
                    <div className="d-flex justify-content-between gap-3">
                      <strong>{review.name}</strong>
                      <span className="review-rating">{review.rating} / 5</span>
                    </div>
                    <p className="mb-0 text-muted">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-muted mb-0">No reviews yet. Be the first to review this product.</p>
                )}
              </div>
            </Col>

            <Col lg={5}>
              <h3 className="section-heading">Write a Review</h3>
              {isLoggedIn ? (
                <Form className="review-form" onSubmit={submitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Bad</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      required
                    />
                  </Form.Group>
                  {reviewMessage && <p className="review-message">{reviewMessage}</p>}
                  <Button type="submit" className="btn-add-detail">Submit Review</Button>
                </Form>
              ) : (
                <p className="text-muted">Please <Link to="/auth">sign in</Link> to write a review.</p>
              )}
            </Col>
          </Row>
        </section>

        {similarProducts.length > 0 && (
          <section className="details-section">
            <h3 className="section-heading">Similar to Buy</h3>
            <Row className="gy-4">
              {similarProducts.map((item) => (
                <Col key={item._id} lg={3} md={6}>
                  <ProductCard product={item} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </div>
  );
};

export default ProductDetails;
