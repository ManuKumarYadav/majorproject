import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ListingsIndex from './pages/ListingsIndex';
import ListingDetail from './pages/ListingDetail';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import HostDashboard from './pages/HostDashboard';
import BookingSuccess from './pages/BookingSuccess';
import EditProfile from './pages/EditProfile';
import { TermsPage, PrivacyPage, HelpPage, AirCoverPage } from './pages/PolicyPages';
import HostProfile from './pages/HostProfile';

export default function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<ListingsIndex />} />
          <Route path="/listings" element={<ListingsIndex />} />
          <Route path="/listings/new" element={<NewListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/aircover" element={<AirCoverPage />} />
          <Route path="/host/:id" element={<HostProfile />} />
          <Route path="*" element={<ListingsIndex />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}

      {/* Floating WhatsApp Concierge Widget */}
      {!isAuthPage && (
        <a 
          href="https://wa.me/917352966256?text=Hi%20StayAira%20team,%20I'm%20looking%20for%20a%20luxury%20villa%20booking" 
          target="_blank" 
          rel="noopener noreferrer"
          className="floating-whatsapp-btn"
          title="Chat on WhatsApp (+91 7352966256)"
          aria-label="Chat with StayAira Concierge on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.767-2.587 5.768-5.768 0-3.18-2.586-5.768-5.768-5.768zm3.392 8.234c-.143.403-.834.774-1.16.822-.325.048-.744.074-1.205-.074-.3-.097-.682-.232-1.173-.443-2.074-.897-3.427-2.983-3.53-3.12-.104-.138-.838-1.115-.838-2.126 0-1.011.53-1.508.718-1.714.188-.206.411-.258.548-.258.137 0 .274.002.394.008.125.006.293-.047.457.348.171.411.582 1.42.633 1.524.051.103.085.223.017.36-.068.138-.103.224-.206.343-.103.12-.217.268-.31.36-.103.103-.211.214-.091.42.12.206.534.881 1.144 1.425.787.701 1.45.918 1.656 1.021.206.103.326.086.446-.051.12-.138.514-.6.651-.806.137-.206.274-.171.463-.103.189.069 1.199.566 1.405.669.206.103.343.155.394.24.052.086.052.498-.091.901z"/>
          </svg>
        </a>
      )}
    </>
  );
}
