import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { isWishlisted, toggleWishlistId } from '../utils/wishlist';

export default function ListingCard({ listing, displayTax }) {
  const [liked, setLiked] = useState(() => isWishlisted(listing._id));

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setLiked(isWishlisted(listing._id));
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [listing._id]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistId(listing._id);
    setLiked(!liked);
  };

  const price = listing.price || 0;
  const taxPrice = Math.round(price * 1.18);
  const imageUrl = listing.image && listing.image.url ? listing.image.url : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <Link to={'/listings/' + listing._id} className="listing-card-wrapper">
      <div className="listing-image-box">
        <img src={imageUrl} alt={listing.title} loading="lazy" />
        
        <div className="badge-guest-favorite">
          <Star size={12} fill="#E11D48" color="#E11D48" /> Guest favorite
        </div>

        <button 
          className={'wishlist-btn' + (liked ? ' active' : '')}
          onClick={handleHeartClick}
          title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={liked ? '#E11D48' : 'none'} color={liked ? '#E11D48' : '#FFFFFF'} />
        </button>
      </div>

      <div style={{ marginTop: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {listing.location}, {listing.country}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.9rem', fontWeight: '700' }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>4.95</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listing.title}
        </p>

        <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>
          {displayTax ? (
            <>
              <span style={{ fontWeight: '800' }}>₹{taxPrice.toLocaleString('en-IN')}</span> <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>total includes taxes</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: '800' }}>₹{price.toLocaleString('en-IN')}</span> <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>night</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

