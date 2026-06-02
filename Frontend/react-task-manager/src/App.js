import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";

// Layout
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Auth from "./pages/Auth/Auth";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Header />

              <main className="flex-grow-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* User-protected routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute><Cart /></ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                  } />

                  {/* Admin-only routes */}
                  <Route path="/admin" element={
                    <AdminRoute><Admin /></AdminRoute>
                  } />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;