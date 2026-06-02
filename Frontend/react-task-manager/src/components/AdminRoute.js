import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

// Redirects to /admin/login if user is not an admin
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#4f46e5" }} />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
