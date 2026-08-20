import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<ListingsIndex />} />
          <Route path="/listings" element={<ListingsIndex />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/new" element={<NewListing />} />
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
          <Route path="*" element={<ListingsIndex />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
