import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      price: parseFloat(product.price),
      rating: parseFloat(product.rating || 4.5),
      reviews: parseInt(product.reviews || 0, 10),
      specs: Array.isArray(product.specs) ? product.specs : product.specs.split(",").map(s => s.trim()).filter(Boolean)
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id
          ? {
              ...updatedProduct,
              price: parseFloat(updatedProduct.price),
              specs: Array.isArray(updatedProduct.specs) ? updatedProduct.specs : updatedProduct.specs.split(",").map(s => s.trim()).filter(Boolean)
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
