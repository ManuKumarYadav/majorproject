import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';
import { SearchX, Heart } from 'lucide-react';
import { getWishlist } from '../utils/wishlist';

export default function ListingsIndex() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayTax, setDisplayTax] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() => getWishlist());
  const location = useLocation();

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
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

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

  // Filter for wishlist mode if active
  const displayedListings = isWishlistMode 
    ? listings.filter(l => wishlistIds.includes(l._id))
    : listings;

  return (
    <div>
      <FilterBar 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        displayTax={displayTax}
        onToggleTax={setDisplayTax}
      />

      <div className="stayaira-container listings-index-container">
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>No listings found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing filters or searching for another destination.</p>
            <button onClick={() => setSelectedCategory('')} className="btn-primary-stayaira">
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
    </div>
  );
}

