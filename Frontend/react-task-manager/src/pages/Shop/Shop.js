import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Shop.css";

const Shop = () => {
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categories: [], brands: [], priceRange: { min: 0, max: 0 } });
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => ({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    sort: searchParams.get("sort") || "newest",
  }), [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${REACT_API_URL}/products`, {
        params: Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ""))
      });
      setProducts(response.data.data);
      setFilters(response.data.filters);
    } finally {
      setLoading(false);
    }
  }, [REACT_API_URL, query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (name, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="shop-page py-5">
      <Container>
        <div className="shop-heading mb-4">
          <span className="section-label text-uppercase">Catalog</span>
          <h1 className="shop-title mb-2">Shop Products</h1>
          <p className="text-muted mb-0">Browse dynamic inventory with live categories, brands, prices, ratings, and sorting.</p>
        </div>

        <Row className="gy-4">
          <Col lg={3}>
            <aside className="shop-filter-panel bg-white shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="mb-0 d-flex align-items-center gap-2"><FiFilter /> Filters</h5>
                <Button variant="light" size="sm" onClick={clearFilters} className="d-flex align-items-center gap-1">
                  <FiX /> Clear
                </Button>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <div className="filter-search-wrap">
                  <FiSearch className="filter-search-icon" />
                  <Form.Control
                    value={query.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    placeholder="Product, brand, specs"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={query.category} onChange={(e) => updateFilter("category", e.target.value)}>
                  <option value="">All categories</option>
                  {filters.categories?.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Select value={query.brand} onChange={(e) => updateFilter("brand", e.target.value)}>
                  <option value="">All brands</option>
                  {filters.brands?.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row className="gy-3">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      value={query.minPrice}
                      placeholder={filters.priceRange?.min}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      value={query.maxPrice}
                      placeholder={filters.priceRange?.max}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Label>Minimum Rating</Form.Label>
                <Form.Select value={query.minRating} onChange={(e) => updateFilter("minRating", e.target.value)}>
                  <option value="">Any rating</option>
                  <option value="4.5">4.5 and up</option>
                  <option value="4">4.0 and up</option>
                  <option value="3.5">3.5 and up</option>
                </Form.Select>
              </Form.Group>
            </aside>
          </Col>

          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
              <div className="text-muted">{products.length} products found</div>
              <Form.Select className="shop-sort-select" value={query.sort} onChange={(e) => updateFilter("sort", e.target.value)}>
                <option value="newest">Newest</option>
                <option value="rating">Highest rated</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="name">Name A-Z</option>
              </Form.Select>
            </div>

            {loading ? (
              <div className="shop-loading text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <Row className="gy-4">
                {products.map((product) => (
                  <Col key={product._id} xl={4} md={6}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Shop;
