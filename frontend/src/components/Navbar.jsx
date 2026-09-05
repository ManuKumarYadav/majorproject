import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, Search, Moon, Sun, User, LogIn, UserPlus, PlusCircle,
  LayoutDashboard, LogOut, Menu, X, Home, Plane, Settings,
  SlidersHorizontal, ChevronDown, ChevronUp, Smartphone, Phone,
  Sparkles, MessageSquare, PhoneCall, Copy, Check, Waves, Palmtree,
  Mountain, Castle, Flame, TreePine, Heart, Users, Laptop, Tent, Snowflake,
  Crown, Gift, Compass as CompassIcon, Sparkles as SparklesIcon
} from 'lucide-react';

const BRANDS = [
  {
    id: 'vieda',
    title: 'Vieda',
    subtitle: 'by STAYAIRA',
    tier: 'Uber Luxury',
    fontStyle: 'italic serif',
    filter: 'Luxury Villas'
  },
  {
    id: 'stayaira',
    title: 'STAY AIRA',
    subtitle: '',
    tier: 'Premium Luxury',
    fontStyle: 'sans-serif',
    fontWeight: '900',
    letterSpacing: '2px',
    filter: ''
  },
  {
    id: 'veo',
    title: 'VEO',
    subtitle: 'by STAYAIRA',
    tier: 'Lean Luxury',
    fontStyle: 'sans-serif',
    fontWeight: '800',
    filter: 'Trending'
  },
  {
    id: 'residences',
    title: 'AIRA RESIDENCES',
    subtitle: '',
    tier: 'Boutique Apartments',
    fontStyle: 'sans-serif',
    letterSpacing: '1px',
    filter: 'Iconic Cities'
  },
  {
    id: 'grams',
    title: "GRAM'S",
    subtitle: '',
    tier: 'Lifestyle Hotel',
    fontStyle: 'serif',
    fontWeight: '800',
    filter: 'Countryside'
  },
  {
    id: 'vaana',
    title: 'Vaana',
    subtitle: 'by STAYAIRA',
    tier: 'Luxury Boutique Resort',
    fontStyle: 'serif',
    filter: 'Tropical'
  }
];

const CATEGORIES_SECTIONS = [
  {
    title: 'Occasions',
    icon: '👑',
    items: [
      { name: 'Corporate Offsite', query: 'Corporate' },
      { name: 'Events and Experiences', query: 'Events' },
      { name: 'Gift Card', query: 'Gift' }
    ]
  },
  {
    title: 'Companions',
    icon: '🏡',
    items: [
      { name: 'Kids Friendly', query: 'Kids Friendly' },
      { name: 'Romantic Getaways', query: 'Romantic' },
      { name: 'Pet Friendly', query: 'Pet Friendly' }
    ]
  },
  {
    title: 'Experiences',
    icon: '🧭',
    items: [
      { name: 'Beach Retreats', query: 'Beachfront' },
      { name: 'Heritage Trails', query: 'Castles' },
      { name: 'Mountain Escapes', query: 'Mountains' },
      { name: 'Heated Pool Villas', query: 'Amazing Pools' },
      { name: 'Safari with StayAira', query: 'Camping' },
      { name: 'Lake View Villas', query: 'Countryside' }
    ]
  }
];

const EXPLORE_TABS = [
  'Villas', 'Collections', 'Travel Guide', 'Homestays',
  'Cottages', 'Luxury Villas', 'Pool Villas', 'Bungalows', 'Places To Visit'
];

const EXPLORE_REGIONS = [
  {
    name: 'Villas In Goa',
    query: 'Goa',
    sublocations: ['Villas In Goa', 'Villas In South Goa', 'Villas In North Goa', 'Villas in Candolim', 'Villas in Anjuna']
  },
  {
    name: 'Villas In Maharashtra',
    query: 'Maharashtra',
    sublocations: ['Villas in Lonavala', 'Villas in Alibaug', 'Villas in Karjat', 'Villas in Mahabaleshwar', 'Villas in Igatpuri']
  },
  {
    name: 'Villas In Karnataka',
    query: 'Karnataka',
    sublocations: ['Villas in Coorg', 'Villas in Chikmagalur', 'Villas in Kabini', 'Villas in Bangalore']
  },
  {
    name: 'Villas In Rajasthan',
    query: 'Rajasthan',
    sublocations: ['Villas in Udaipur', 'Villas in Jaipur', 'Villas in Jodhpur', 'Villas in Pushkar']
  },
  {
    name: 'Villas In Himachal Pradesh',
    query: 'Himachal',
    sublocations: ['Villas in Manali', 'Villas in Shimla', 'Villas in Kasauli', 'Villas in Dharamshala']
  },
  {
    name: 'Villas In Delhi',
    query: 'Delhi',
    sublocations: ['Villas in Delhi NCR', 'Villas in Gurgaon', 'Villas in Noida']
  },
  {
    name: 'Villas In Gujarat',
    query: 'Gujarat',
    sublocations: ['Villas in Gir', 'Villas in Ahmedabad', 'Villas in Surat']
  }
];

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mega menu states: 'brands' | 'categories' | 'explore' | 'touch' | null
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [activeExploreTab, setActiveExploreTab] = useState('Villas');
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveMegaMenu(null);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyCouponCode = () => {
    navigator.clipboard.writeText('STAYAIRA50');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('7352966256');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleBrandSelect = (filter) => {
    setActiveMegaMenu(null);
    if (filter) {
      navigate(`/?category=${encodeURIComponent(filter)}`);
    } else {
      navigate('/');
    }
  };

  const handleCategoryItemSelect = (item) => {
    setActiveMegaMenu(null);
    if (item.query) {
      navigate(`/?category=${encodeURIComponent(item.query)}`);
    } else {
      navigate(`/?search=${encodeURIComponent(item.name)}`);
    }
  };

  const handleRegionSelect = (sublocation) => {
    setActiveMegaMenu(null);
    const cleanSearch = sublocation.replace(/^Villas in /i, '').replace(/^Villas /i, '');
    navigate(`/?search=${encodeURIComponent(cleanSearch)}`);
  };

  const toggleMenu = (menuName) => {
    setActiveMegaMenu(prev => prev === menuName ? null : menuName);
  };

  return (
    <>
      <header
        ref={menuRef}
        className={`main-header stayvista-header ${isHomePage && !scrolled && !activeMegaMenu ? 'transparent-header' : 'solid-header'}`}
        style={{ position: 'sticky', top: 0, zIndex: 1050 }}
      >
        {/* Top Announcement Banner with High-Visibility Coupon Code */}
        {bannerVisible && (
          <div className="stayvista-top-banner">
            <div className="banner-content-inner">
              <span className="banner-promo-tag">⚡ SPECIAL OFFER</span>
              <span className="banner-promo-text">
                FLAT <strong>50% OFF</strong> on 2nd night on our newest escapes!
              </span>
              <div
                className="banner-coupon-pill"
                onClick={copyCouponCode}
                title="Click to copy coupon code"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyCouponCode(); }}
              >
                <span className="coupon-pill-label">CODE:</span>
                <span className="coupon-pill-code">STAYAIRA50</span>
                <span className={`coupon-copy-badge ${copiedCode ? 'copied' : ''}`}>
                  {copiedCode ? (
                    <>
                      <Check size={12} color="#10B981" /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> COPY
                    </>
                  )}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="banner-close-btn"
              aria-label="Close promotion banner"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Mobile Top Header with Search Pill and Dark/Light Theme Button */}
        <div className="mobile-top-search-bar">
          <div className="mobile-search-pill-inner" onClick={() => setSearchModalOpen(true)}>
            <Search size={18} color="var(--primary)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Start your search</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Anywhere · Any week · Add guests</p>
            </div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-bg)', flexShrink: 0 }}>
              <SlidersHorizontal size={13} color="var(--text-main)" />
            </div>
          </div>
          <button
            type="button"
            className="mobile-theme-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark and Light theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
          </button>
        </div>

        <div className="stayaira-container desktop-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 4px 14px rgba(225,29,72,0.3)', flexShrink: 0
            }}>
              <Compass size={24} />
            </div>
            <div>
              <span className="navbar-brand-title stayvista-brand-title">
                StayAira
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="stayvista-nav-links desktop-only">
            {/* Our Brands Button */}
            <button
              type="button"
              className={`nav-link-btn ${activeMegaMenu === 'brands' ? 'active' : ''}`}
              onClick={() => toggleMenu('brands')}
            >
              Our Brands {activeMegaMenu === 'brands' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {/* Categories Button with 3-Column Dropdown Container */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`nav-link-btn ${activeMegaMenu === 'categories' ? 'active' : ''}`}
                onClick={() => toggleMenu('categories')}
              >
                Categories {activeMegaMenu === 'categories' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {/* ─────────────────────────────────────────────
                  EXACT STAYVISTA 3-COLUMN CATEGORIES DROPDOWN
              ───────────────────────────────────────────── */}
              {activeMegaMenu === 'categories' && (
                <div className="stayvista-categories-dropdown">
                  {CATEGORIES_SECTIONS.map((section, idx) => (
                    <div key={section.title} className="categories-col-box">
                      <div className="categories-col-header">
                        <span className="categories-col-emoji">{section.icon}</span>
                        <span className="categories-col-heading">{section.title}</span>
                      </div>
                      <div className="categories-col-links-list">
                        {section.items.map(item => (
                          <button
                            key={item.name}
                            type="button"
                            className="categories-dropdown-item-link"
                            onClick={() => handleCategoryItemSelect(item)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List your Property */}
            <Link to="/listings/new" className="nav-link-item">
              List your Property
            </Link>

            {/* Explore Button */}
            <button
              type="button"
              className={`nav-link-btn ${activeMegaMenu === 'explore' ? 'active' : ''}`}
              onClick={() => toggleMenu('explore')}
            >
              Explore {activeMegaMenu === 'explore' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

            {/* Airbnb-Style Switch to hosting / Switch to traveling */}
            <Link
              to={location.pathname.startsWith('/host') ? '/' : (user ? '/host/dashboard' : '/login')}
              className="switch-hosting-btn desktop-only"
              title={location.pathname.startsWith('/host') ? 'Switch to traveling' : 'Switch to hosting'}
            >
              {location.pathname.startsWith('/host') ? 'Switch to traveling' : 'Switch to hosting'}
            </Link>

            <button
              onClick={toggleTheme}
              style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0
              }}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Perfectly Circular User Profile Avatar */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  padding: 0,
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  background: 'var(--card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : user ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.95rem'
                  }}>
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)'
                  }}>
                    <User size={18} />
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: '50px', width: '280px',
                    background: 'var(--card-bg)', borderRadius: '16px',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem 0', zIndex: 100, overflow: 'hidden'
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#E11D48,#f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>
                          {user.avatar?.url
                            ? <img src={user.avatar.url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            : user.username.slice(0, 1).toUpperCase()
                          }
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName || user.username}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile/edit" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <Settings size={16} /> Edit Profile
                      </Link>
                      <Link to="/host/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <LayoutDashboard size={16} /> Host Dashboard
                      </Link>
                      <Link to="/listings/new" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <PlusCircle size={16} /> List a Villa
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }}></div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheme();
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.65rem 1.25rem', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#6366F1" />}
                          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                          {theme === 'dark' ? 'DARK' : 'LIGHT'}
                        </span>
                      </button>
                      <button
                        onClick={logout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem',
                          fontSize: '0.9rem', fontWeight: '600', color: '#E11D48', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: '700' }}>
                        <LogIn size={16} /> Sign In
                      </Link>
                      <Link to="/signup" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary)' }}>
                        <UserPlus size={16} /> Create Account
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }}></div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheme();
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.65rem 1.25rem', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#6366F1" />}
                          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                          {theme === 'dark' ? 'DARK' : 'LIGHT'}
                        </span>
                      </button>
                      <Link to="/help" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Help Center
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Get In Touch with User's Number: 7352966256 */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`get-in-touch-btn desktop-only ${activeMegaMenu === 'touch' ? 'active' : ''}`}
                onClick={() => toggleMenu('touch')}
              >
                <Phone size={16} /> Get In Touch <ChevronDown size={14} />
              </button>

              {activeMegaMenu === 'touch' && (
                <div className="touch-popover">
                  <div className="touch-popover-header">
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Direct Support & Booking</p>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>+91 7352966256</h4>
                  </div>

                  <div className="touch-popover-actions">
                    <a href="tel:+917352966256" className="touch-action-btn primary-touch">
                      <PhoneCall size={16} /> Call Now
                    </a>
                    <a
                      href="https://wa.me/917352966256?text=Hi,%20I'm%20inquiring%20about%20StayAira%20villas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-action-btn whatsapp-touch"
                    >
                      <MessageSquare size={16} /> WhatsApp
                    </a>
                    <button type="button" onClick={handleCopyNumber} className="touch-action-btn copy-touch">
                      {copiedPhone ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                      {copiedPhone ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Available 24/7 for bespoke concierge & luxury reservations.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ─────────────────────────────────────────────
            MEGA MENU 1: OUR BRANDS
        ───────────────────────────────────────────── */}
        {activeMegaMenu === 'brands' && (
          <div className="mega-menu-container brands-mega-menu">
            <div className="stayaira-container">
              <div className="brands-grid-card">
                {BRANDS.map(brand => (
                  <div
                    key={brand.id}
                    className="brand-item-box"
                    onClick={() => handleBrandSelect(brand.filter)}
                  >
                    <div className="brand-logo-area">
                      <span
                        className="brand-logo-text"
                        style={{
                          fontFamily: brand.fontStyle || 'inherit',
                          fontWeight: brand.fontWeight || '700',
                          letterSpacing: brand.letterSpacing || 'normal'
                        }}
                      >
                        {brand.title}
                      </span>
                      {brand.subtitle && <span className="brand-subtext">{brand.subtitle}</span>}
                    </div>
                    <span className="brand-tier-label">{brand.tier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            MEGA MENU 3: EXPLORE
        ───────────────────────────────────────────── */}
        {activeMegaMenu === 'explore' && (
          <div className="mega-menu-container explore-mega-menu">
            <div className="stayaira-container">
              <div className="explore-card">

                {/* Horizontal Category Tabs */}
                <div className="explore-tabs-bar">
                  {EXPLORE_TABS.map(tab => (
                    <button
                      key={tab}
                      type="button"
                      className={`explore-tab-item ${activeExploreTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveExploreTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Body with region sidebar & sublocations */}
                <div className="explore-body">
                  {/* Left Region Sidebar */}
                  <div className="explore-region-sidebar">
                    {EXPLORE_REGIONS.map((region, idx) => (
                      <button
                        key={region.name}
                        type="button"
                        className={`explore-region-btn ${activeRegionIndex === idx ? 'active' : ''}`}
                        onMouseEnter={() => setActiveRegionIndex(idx)}
                        onClick={() => handleRegionSelect(region.query)}
                      >
                        {region.name}
                      </button>
                    ))}
                  </div>

                  {/* Right Sublocations Column */}
                  <div className="explore-sublocations-area">
                    <h4 className="explore-current-region-title">
                      {EXPLORE_REGIONS[activeRegionIndex].name}
                    </h4>
                    <div className="explore-sublocations-grid">
                      {EXPLORE_REGIONS[activeRegionIndex].sublocations.map((sub, i) => (
                        <button
                          key={i}
                          type="button"
                          className="sublocation-link"
                          onClick={() => handleRegionSelect(sub)}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </header>

      {/* Search Modal */}
      {searchModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px',
          zIndex: 1200
        }}>
          <div style={{
            width: '100%', maxWidth: '640px', background: 'var(--card-bg)', borderRadius: '24px',
            padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Search StayAira Accommodations</h3>
              <button onClick={() => setSearchModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  className="stayaira-input"
                  placeholder="Where to? (e.g. Goa, Manali, Jaipur, Alibaug, Maldives...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{ paddingLeft: '3rem', fontSize: '1.05rem', height: '56px' }}
                />
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--text-muted)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSearchModalOpen(false)} className="btn-outline-stayaira">Cancel</button>
                <button type="submit" className="btn-primary-stayaira"><Search size={18} /> Search Stays</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
