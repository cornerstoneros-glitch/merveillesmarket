import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AbbeysUniverse from './pages/AbbeysUniverse';
import JosyUniverse from './pages/JosyUniverse';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';
import NewsletterPopup from './components/NewsletterPopup';
import Ticker from './components/Ticker';
import CookiePopup from './components/CookiePopup';
import AdminLayout from './pages/admin/AdminLayout';
import AdminStats from './pages/admin/AdminStats';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCoupons from './pages/admin/AdminCoupons';
import { CGU, CGV, MentionsLegales, Confidentialite, PolitiqueCookies } from './pages/LegalPages';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/abbeys" element={<AbbeysUniverse />} />
            <Route path="/josy" element={<JosyUniverse />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminStats />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>

            {/* Legal Pages */}
            <Route path="/cgu" element={<CGU />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cookies" element={<PolitiqueCookies />} />

            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Ticker />
        <Footer />
        <NewsletterPopup />
        <CookiePopup />
      </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
