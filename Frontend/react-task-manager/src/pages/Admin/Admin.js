import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tabs, Tab, ListGroup } from "react-bootstrap";
import { FiPlus, FiEdit, FiTrash2, FiTag, FiDollarSign, FiStar, FiGrid, FiSettings, FiShare2, FiSave } from "react-icons/fi";
import axios from "axios";
import { useSettings } from "../../context/SettingsContext";
import "./Admin.css";
import { useEffect } from "react";

const Admin = () => {
  const {
    heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
    logoSettings, setLogoSettings,
    socialLinks, setSocialLinks
  } = useSettings();

  const REACT_API_URL = process.env.REACT_APP_API_URL;
  // Tab State
  const [activeTab, setActiveTab] = useState("products");

  // Products Modal State
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productEditMode, setProductEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    price: "",
    category: "Audio",
    image: "",
    description: "",
    featured: false,
    specs: "",
    rating: 4.5,
    reviews: 0
  });

  // Slider Modal State
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [slideEditMode, setSlideEditMode] = useState(false);
  const [selectedSlideId, setSelectedSlideId] = useState(null);
  const [slideFormData, setSlideFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "#featured-products"
  });

  // Category Input State
  const [categories, setCategories] = useState([]);
  const [catEditMode, setCatEditMode] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(null);

  // Branding & Social Inputs
  const [tempLogo, setTempLogo] = useState({ ...logoSettings });
  const [tempSocials, setTempSocials] = useState({ ...socialLinks });

  // Stats Calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featuredCount = products.filter((p) => p.featured).length;
  const averagePrice = totalProducts > 0? products.reduce((acc, p) => acc + p.price, 0) / totalProducts : 0;

  // PRODUCT HANDLERS
  const handleProductModalClose = () => {
    setShowProductModal(false);
    setProductEditMode(false);
    setSelectedProductId(null);
    setProductFormData({
      name: "",
      price: "",
      category: categories[0] || "Audio",
      image: "",
      description: "",
      featured: false,
      specs: "",
      rating: 4.5,
      reviews: 0
    });
  };

  const fetchProducts = async () => {
    const response = await axios.get(
      `${REACT_API_URL}/products`
    );
    setProducts(response.data.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get(
      `${REACT_API_URL}/categories`
    );
    setCategories(response.data.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleProductShowAdd = () => {
    setProductEditMode(false);
    setProductFormData((prev) => ({
      ...prev,
      category: categories[0] || "Audio"
    }));
    setShowProductModal(true);
  };

  const handleProductShowEdit = (product) => {
    setProductEditMode(true);
    setSelectedProductId(product._id);
    setProductFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      featured: product.featured,
      specs: Array.isArray(product.specs) ? product.specs.join(", ") : product.specs,
      rating: product.rating,
      reviews: product.reviews
    });
    setShowProductModal(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (productEditMode) {
      // updateProduct({ id: selectedProductId, ...productFormData });
      await axios.put(
        `${REACT_API_URL}/products/${selectedProductId}`,
        productFormData
      );
    } else {
      await axios.post(
        `${REACT_API_URL}/products`,
        productFormData
      );
    }
    fetchProducts();
    handleProductModalClose();
  };

  // SLIDE HANDLERS
  const handleSlideModalClose = () => {
    setShowSlideModal(false);
    setSlideEditMode(false);
    setSelectedSlideId(null);
    setSlideFormData({
      title: "",
      subtitle: "",
      image: "",
      ctaText: "",
      ctaLink: "#featured-products"
    });
  };

  const handleSlideShowAdd = () => {
    setSlideEditMode(false);
    setShowSlideModal(true);
  };

  const handleSlideShowEdit = (slide) => {
    setSlideEditMode(true);
    setSelectedSlideId(slide.id);
    setSlideFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink
    });
    setShowSlideModal(true);
  };

  const handleSlideInputChange = (e) => {
    const { name, value } = e.target;
    setSlideFormData({
      ...slideFormData,
      [name]: value
    });
  };

  const handleSlideSubmit = (e) => {
    e.preventDefault();
    if (slideEditMode) {
      updateHeroSlide({ id: selectedSlideId, ...slideFormData });
    } else {
      addHeroSlide(slideFormData);
    }
    handleSlideModalClose();
  };

  const handleSlideDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      deleteHeroSlide(id);
    }
  };

  // CATEGORY HANDLERS
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      if (catEditMode) {
        // updateProduct({ id: selectedProductId, ...productFormData });
        await axios.put(
          `${REACT_API_URL}/categories/${selectedCatId}`,
          { name: newCatName }
        );
      } else {
        await axios.post(
          `${REACT_API_URL}/categories`,
          { name: newCatName }
        );
      }
      fetchCategories();
      setNewCatName("");
    }
  };

  // BRANDING HANDLERS
  const handleLogoChange = (e) => {
    const { name, value } = e.target;
    setTempLogo({ ...tempLogo, [name]: value });
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setTempSocials({ ...tempSocials, [name]: value });
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    setLogoSettings(tempLogo);
    setSocialLinks(tempSocials);
    alert("Branding and Social settings saved successfully!");
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(
        `${REACT_API_URL}/products/${id}`
      );
      fetchProducts();
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(
        `${REACT_API_URL}/categories/${id}`
      );
      fetchCategories();
    }
  };

  return (
    <div className="admin-page py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h1 className="admin-title mb-1">Admin Portal</h1>
            <p className="text-muted mb-0">Manage products, slides, categories, and site branding dynamically</p>
          </div>
        </div>

        {/* Dynamic Tabs */}
        <Tabs id="admin-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 admin-custom-tabs">
          <Tab eventKey="products" title="Products Inventory">
            <Row className="gy-4 mb-4 mt-1">
              <Col lg={3} sm={6}>
                <Card className="stat-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="stat-label text-muted text-uppercase mb-1 d-block">Total Products</span>
                      <h3 className="stat-number mb-0">{totalProducts}</h3>
                    </div>
                    <div className="stat-icon bg-indigo-light text-indigo">
                      <FiGrid size={22} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="stat-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="stat-label text-muted text-uppercase mb-1 d-block">Categories</span>
                      <h3 className="stat-number mb-0">{totalCategories}</h3>
                    </div>
                    <div className="stat-icon bg-green-light text-green">
                      <FiTag size={22} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="stat-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="stat-label text-muted text-uppercase mb-1 d-block">Featured Items</span>
                      <h3 className="stat-number mb-0">{featuredCount}</h3>
                    </div>
                    <div className="stat-icon bg-amber-light text-amber">
                      <FiStar size={22} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="stat-card border-0 shadow-sm p-3">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="stat-label text-muted text-uppercase mb-1 d-block">Average Price</span>
                      <h3 className="stat-number mb-0">₹{averagePrice.toFixed(2)}</h3>
                    </div>
                    <div className="stat-icon bg-blue-light text-blue">
                      <FiDollarSign size={22} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mb-3">
              <Button onClick={handleProductShowAdd} className="btn-add-product py-2 px-3 d-flex align-items-center gap-2">
                <FiPlus /> Add Product
              </Button>
            </div>

            <Card className="product-table-card border-0 shadow-sm rounded-4 overflow-hidden">
              <Table responsive borderless className="align-middle admin-table mb-0">
                <thead>
                  <tr className="border-bottom border-light text-muted uppercase-headers">
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Rating</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-bottom border-light">
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={product.image} alt={product.name} className="admin-item-thumb rounded-3" />
                          <div>
                            <h6 className="admin-item-name mb-0">{product.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-category-badge">{product.category}</span>
                      </td>
                      <td className="font-semibold">₹{product.price.toFixed(2)}</td>
                      <td>
                        <span className={product.featured ? "status-badge featured" : "status-badge standard"}>
                          {product.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <FiStar className="star-icon filled" size={14} />
                          <span>{product.rating}</span>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleProductShowEdit(product)} className="btn-action">
                            <FiEdit size={16} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => deleteProduct(product._id)} className="btn-action">
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab>

          {/* 2. HERO SLIDERS TAB */}
          <Tab eventKey="sliders" title="Hero Sliders">
            <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
              <h5 className="mb-0">Banner Carousel Slides</h5>
              <Button onClick={handleSlideShowAdd} className="btn-add-product py-2 px-3 d-flex align-items-center gap-2">
                <FiPlus /> Add Slide
              </Button>
            </div>

            <Card className="product-table-card border-0 shadow-sm rounded-4 overflow-hidden">
              <Table responsive borderless className="align-middle admin-table mb-0">
                <thead>
                  <tr className="border-bottom border-light text-muted uppercase-headers">
                    <th>Slide Info</th>
                    <th>Subtitle</th>
                    <th>CTA Button</th>
                    <th>CTA Link</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {heroSlides.map((slide) => (
                    <tr key={slide.id} className="border-bottom border-light">
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={slide.image} alt={slide.title} className="admin-item-thumb rounded-3" />
                          <div>
                            <h6 className="admin-item-name mb-0">{slide.title}</h6>
                            <small className="text-muted">ID: {slide.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                          {slide.subtitle}
                        </span>
                      </td>
                      <td className="font-semibold">{slide.ctaText || "None"}</td>
                      <td><code>{slide.ctaLink}</code></td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleSlideShowEdit(slide)} className="btn-action">
                            <FiEdit size={16} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleSlideDelete(slide.id)} className="btn-action">
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab>

          {/* 3. CATEGORIES TAB */}
          <Tab eventKey="categories" title="Categories Management">
            <Row className="gy-4 mt-2">
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <h5 className="mb-3">{catEditMode ? "Edit Category" : "Add Category"}</h5>
                  <Form onSubmit={handleAddCategory} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="e.g. Smart Home"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="form-input-custom"
                      required
                    />
                    <Button type="submit" className="btn-add-product px-4">
                      {catEditMode ? "Update" : "Add"}
                    </Button>
                  </Form>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                  <Card.Header className="bg-white py-3 border-0">
                    <h5 className="mb-0">Current Categories</h5>
                  </Card.Header>
                  <ListGroup variant="flush" className="border-top border-light">
                    {categories.map((cat) => (
                      <ListGroup.Item key={cat._id} className="d-flex justify-content-between align-items-center py-3 border-light">
                        <span className="font-semibold"><FiTag className="me-2 text-muted" />{cat?.name}</span>
                        <div className="gap-2 d-flex">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-action"
                            onClick={() => {
                              setCatEditMode(true);
                              setSelectedCatId(cat._id);
                              setNewCatName(cat.name);
                            }}>
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Delete category "${cat?.name}"?`)) deleteCategory(cat?._id);
                            }}
                            className="btn-action"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* 4. BRANDING & SOCIAL TAB */}
          <Tab eventKey="branding" title="Store Branding & Socials">
            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 mt-3">
              <Form onSubmit={handleSaveBranding}>
                <Row className="gy-4">
                  {/* Logo Brand Title */}
                  <Col md={12}>
                    <h5 className="border-bottom border-light pb-2 d-flex align-items-center gap-2">
                      <FiSettings /> Brand Logo Settings
                    </h5>
                    <p className="text-muted small">Change the branding prefix and suffix rendering in Header and Footer logos.</p>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="logoPrefix">
                      <Form.Label className="form-label-custom">Logo Brand Prefix (Colored Text)</Form.Label>
                      <Form.Control
                        type="text"
                        name="prefix"
                        value={tempLogo.prefix}
                        onChange={handleLogoChange}
                        className="form-input-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="logoSuffix">
                      <Form.Label className="form-label-custom">Logo Brand Suffix (Standard Text)</Form.Label>
                      <Form.Control
                        type="text"
                        name="suffix"
                        value={tempLogo.suffix}
                        onChange={handleLogoChange}
                        className="form-input-custom"
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Social links */}
                  <Col md={12} className="mt-5">
                    <h5 className="border-bottom border-light pb-2 d-flex align-items-center gap-2">
                      <FiShare2 /> Social Media Hyperlinks
                    </h5>
                    <p className="text-muted small">Update social redirect endpoints linked in the page Footer.</p>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="socialFacebook">
                      <Form.Label className="form-label-custom">Facebook Link</Form.Label>
                      <Form.Control
                        type="url"
                        name="facebook"
                        value={tempSocials.facebook}
                        onChange={handleSocialChange}
                        className="form-input-custom"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="socialTwitter">
                      <Form.Label className="form-label-custom">Twitter Link</Form.Label>
                      <Form.Control
                        type="url"
                        name="twitter"
                        value={tempSocials.twitter}
                        onChange={handleSocialChange}
                        className="form-input-custom"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="socialInstagram">
                      <Form.Label className="form-label-custom">Instagram Link</Form.Label>
                      <Form.Control
                        type="url"
                        name="instagram"
                        value={tempSocials.instagram}
                        onChange={handleSocialChange}
                        className="form-input-custom"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="text-end mt-4">
                    <Button type="submit" className="btn-add-product py-3 px-4 d-inline-flex align-items-center gap-2">
                      <FiSave /> Save Store Branding Settings
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Tab>
        </Tabs>
      </Container>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal show={showProductModal} onHide={handleProductModalClose} size="lg" centered className="admin-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-heading">
            {productEditMode ? "Edit Product Details" : "Add New Catalog Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProductSubmit}>
          <Modal.Body className="py-4">
            <Row className="gy-3">
              <Col md={6}>
                <Form.Group controlId="prodName">
                  <Form.Label className="form-label-custom">Product Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                    placeholder="e.g. Mechanical Keyboard"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="prodPrice">
                  <Form.Label className="form-label-custom">Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={productFormData.price}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="prodCategory">
                  <Form.Label className="form-label-custom">Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={productFormData.category}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat?.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="prodImage">
                  <Form.Label className="form-label-custom">Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={productFormData.image}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                    placeholder="https://unsplash.com/..."
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="prodDescription">
                  <Form.Label className="form-label-custom">Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                    placeholder="Enter product description..."
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="prodSpecs">
                  <Form.Label className="form-label-custom">Specifications (comma-separated list)</Form.Label>
                  <Form.Control
                    type="text"
                    name="specs"
                    value={productFormData.specs}
                    onChange={handleProductInputChange}
                    className="form-input-custom"
                    placeholder="e.g. RGB Backlighting, Wireless, Mechanical Switches"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="prodFeatured" className="mt-2">
                  <Form.Check
                    type="checkbox"
                    label="Promote/Feature on Home Page"
                    name="featured"
                    checked={productFormData.featured}
                    onChange={handleProductInputChange}
                    className="custom-checkbox"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleProductModalClose} className="py-2 px-3 rounded-3">
              Cancel
            </Button>
            <Button type="submit" className="btn-modal-submit py-2 px-4">
              {productEditMode ? "Save Changes" : "Create Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ADD / EDIT SLIDE MODAL */}
      <Modal show={showSlideModal} onHide={handleSlideModalClose} size="lg" centered className="admin-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-heading">
            {slideEditMode ? "Edit Slider Details" : "Add New Hero Carousel Slide"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSlideSubmit}>
          <Modal.Body className="py-4">
            <Row className="gy-3">
              <Col md={12}>
                <Form.Group controlId="slideTitle">
                  <Form.Label className="form-label-custom">Slide Main Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={slideFormData.title}
                    onChange={handleSlideInputChange}
                    className="form-input-custom"
                    placeholder="e.g. Elevate Your Workspace"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="slideSubtitle">
                  <Form.Label className="form-label-custom">Slide Subtitle / Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="subtitle"
                    value={slideFormData.subtitle}
                    onChange={handleSlideInputChange}
                    className="form-input-custom"
                    placeholder="Describe this slider promotion..."
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="slideCtaText">
                  <Form.Label className="form-label-custom">CTA Button Text</Form.Label>
                  <Form.Control
                    type="text"
                    name="ctaText"
                    value={slideFormData.ctaText}
                    onChange={handleSlideInputChange}
                    className="form-input-custom"
                    placeholder="e.g. Shop Now"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="slideCtaLink">
                  <Form.Label className="form-label-custom">CTA Redirect Link / Hash</Form.Label>
                  <Form.Control
                    type="text"
                    name="ctaLink"
                    value={slideFormData.ctaLink}
                    onChange={handleSlideInputChange}
                    className="form-input-custom"
                    placeholder="e.g. #featured-products"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="slideImage">
                  <Form.Label className="form-label-custom">Slide Background Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={slideFormData.image}
                    onChange={handleSlideInputChange}
                    className="form-input-custom"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleSlideModalClose} className="py-2 px-3 rounded-3">
              Cancel
            </Button>
            <Button type="submit" className="btn-modal-submit py-2 px-4">
              {slideEditMode ? "Save Slide" : "Create Slide"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
