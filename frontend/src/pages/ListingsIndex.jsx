import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import ListingCard from '../components/ListingCard';
import LiveMap from '../components/LiveMap';
import { SearchX, Heart, ChevronLeft, ChevronRight, Map, List } from 'lucide-react';
import { getWishlist } from '../utils/wishlist';

const VILLA_TABS = ['All', 'Lonavala', 'Alibaug', 'Shimla', 'Manali', 'Coorg'];

export default function ListingsIndex() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayTax, setDisplayTax] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() => getWishlist());
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const isWishlistMode = queryParams.get('wishlist') === 'true';

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistIds(getWishlist());
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      let url = `${API_BASE_URL}/api/listings`;
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      } else if (selectedCategory && selectedCategory !== 'All') {
        params.append('search', selectedCategory);
      }

      if (params.toString()) url += '?' + params.toString();
      const res = await axios.get(url);
      if (res.data.success) {
        setListings(res.data.listings);
      }
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  const handleTabClick = (tab) => {
    if (tab === 'All') {
      setSelectedCategory('');
      navigate('/');
    } else {
      setSelectedCategory(tab);
      navigate(`/?search=${encodeURIComponent(tab)}`);
    }
  };

  const handleTabNav = (dir) => {
    const currentTab = searchQuery || selectedCategory || 'All';
    const currentIndex = VILLA_TABS.indexOf(currentTab);
    const validIdx = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (validIdx + dir + VILLA_TABS.length) % VILLA_TABS.length;
    handleTabClick(VILLA_TABS[nextIndex]);
  };

  const handleResetSearch = () => {
    setSelectedCategory('');
    navigate('/');
  };

  // Filter for wishlist mode if active
  const displayedListings = isWishlistMode
    ? listings.filter(l => wishlistIds.includes(l._id))
    : listings;

  return (
    <div className="home-page-wrapper">
      {!searchQuery && !isWishlistMode && (
        <>
          <Hero onSearch={(loc) => navigate('/?search=' + encodeURIComponent(loc))} />
          <Destinations />
        </>
      )}

      <div className="stayaira-container listings-index-container">
        {/* Search Results Header */}
        {searchQuery && !isWishlistMode && (
          <div className="search-results-header" style={{ marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem' }}>
            <div>
              <div style={{ marginBottom: '0.35rem' }}>
                <button
                  onClick={handleResetSearch}
                  style={{ background: 'none', border: 'none', color: '#E11D48', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600', padding: 0 }}
                >
                  <ChevronLeft size={16} /> Back to all destinations
                </button>
              </div>
              <h2 style={{ fontSize: '1.7rem', fontWeight: '800', margin: 0 }}>
                Luxury Stays in <span style={{ color: '#E11D48' }}>{searchQuery}</span>
              </h2>
              <p style={{ color: 'var(--text-muted, #71717a)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
                {loading ? 'Searching luxury retreats...' : `${displayedListings.length} ${displayedListings.length === 1 ? 'exclusive villa' : 'exclusive villas'} available`}
              </p>
            </div>
            <div>
              <button
                onClick={handleResetSearch}
                className="btn-outline-stayaira"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '30px' }}
              >
                Clear Filter & View All
              </button>
            </div>
          </div>
        )}

        {/* Best Rated Villas Section (when on Home/All view) */}
        {!searchQuery && !isWishlistMode && (
          <div className="villas-section-header">
            <h2 className="section-title">Best Rated Villas</h2>
            <div className="villas-tabs-container">
              <div className="villas-tabs">
                {VILLA_TABS.map(tab => (
                  <button
                    key={tab}
                    className={`villa-tab-btn ${selectedCategory === tab || (!selectedCategory && tab === 'All') ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </button>
                ))}
                <button
                  className="villa-tab-btn explore-more"
                  onClick={() => {
                    const el = document.querySelector('.dest-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore more
                </button>
              </div>
              <div className="villas-nav">
                <button className="nav-arrow" onClick={() => handleTabNav(-1)} aria-label="Previous destination">
                  <ChevronLeft size={16} />
                </button>
                <button className="nav-arrow" onClick={() => handleTabNav(1)} aria-label="Next destination">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {isWishlistMode && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={24} fill="#E11D48" color="#E11D48" /> Your Saved Wishlists ({displayedListings.length})
            </h2>
            <Link to="/" className="btn-outline-stayaira" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              View All Stays
            </Link>
          </div>
        )}

        {loading ? (
          <div className="listings-grid" style={{ marginTop: '1rem' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '20/19', background: 'var(--border-color)', opacity: 0.6 }}></div>
                <div style={{ height: '16px', background: 'var(--border-color)', width: '60%', margin: '10px 0 6px', borderRadius: '4px' }}></div>
                <div style={{ height: '14px', background: 'var(--border-color)', width: '40%', borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        ) : isWishlistMode && displayedListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(225,29,72,0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>As you search, tap the heart icon on any stay to save your favorite spots here.</p>
            <Link to="/" className="btn-primary-stayaira">
              Start Exploring
            </Link>
          </div>
        ) : displayedListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(225,29,72,0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <SearchX size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              No listings found {searchQuery ? `for "${searchQuery}"` : ''}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing filters or searching for another destination.</p>
            <button onClick={handleResetSearch} className="btn-primary-stayaira">
              View All Accommodations
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {displayedListings.map(listing => (
              <ListingCard key={listing._id} listing={listing} displayTax={displayTax} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Show Map Button */}
      {displayedListings.length > 0 && !showMap && (
        <div className="map-toggle-btn-wrapper">
          <button
            type="button"
            className="map-toggle-btn"
            onClick={() => setShowMap(true)}
            aria-label="Show Live Map"
          >
            <Map size={17} color="#FB7185" /> Show Live Map
          </button>
        </div>
      )}

      {/* Fullscreen Interactive Live Map Modal */}
      {showMap && (
        <LiveMap 
          listings={displayedListings} 
          isModal={true} 
          onClose={() => setShowMap(false)} 
        />
      )}
    </div>
  );
}

