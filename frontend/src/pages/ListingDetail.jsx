import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Star, Share2, Heart, ShieldCheck, Sparkles, MapPin, 
  Calendar, Users, CheckCircle2, MessageSquare, Trash2, Edit 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ListingDetail() {
  const { id } = useParams();
  const { user, razorpayKeyId } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  const [paying, setPaying] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchListing = async () => {
    try {
      const res = await axios.get('/api/listings/' + id);
      if (res.data.success) {
        setListing(res.data.listing);
      }
    } catch (err) {
      console.error('Failed to load listing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="stayaira-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading accommodation details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="stayaira-container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Listing Not Found</h2>
        <Link to="/" className="btn-primary-stayaira" style={{ marginTop: '1rem' }}>Back to Explore</Link>
      </div>
    );
  }

  // Calculations
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffTime = Math.abs(date2 - date1);
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const nightPrice = listing.price || 0;
  const baseTotal = nightPrice * totalNights;
  const serviceFee = Math.round(baseTotal * 0.12);
  const taxes = Math.round(baseTotal * 0.06);
  const finalTotal = baseTotal + serviceFee + taxes;

  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);

  // Razorpay Checkout
  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPaying(true);
    try {
      // 1. Create order on backend
      const orderRes = await axios.post('/api/bookings/create-order', {
        listingId: listing._id,
        checkIn,
        checkOut,
        guests,
        totalNights,
        totalAmount: finalTotal
      });

      if (!orderRes.data.success) {
        alert('Failed to initiate reservation.');
        setPaying(false);
        return;
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Open Razorpay modal
      const options = {
        key: keyId || razorpayKeyId || 'rzp_live_TQjI9CWqMmIeCn',
        amount: amount,
        currency: currency || 'INR',
        name: 'StayAira Luxury Rentals',
        description: 'Reservation for ' + listing.title,
        image: 'https://cdn-icons-png.flaticon.com/512/2111/2111320.png',
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/bookings/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              listingId: listing._id,
              checkIn,
              checkOut,
              guests,
              totalNights,
              totalAmount: finalTotal,
              guestDetails: {
                name: user.fullName || user.username,
                email: user.email,
                phone: user.phone || '+91 9876543210'
              }
            });

            if (verifyRes.data.success) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              navigate('/booking/success', { state: { booking: verifyRes.data.booking } });
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment recorded. Redirecting to your bookings...');
            navigate('/');
          }
        },
        prefill: {
          name: user.fullName || user.username,
          email: user.email,
          contact: user.phone || '+919876543210'
        },
        theme: { color: '#E11D48' }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Razorpay SDK loading. Please refresh and try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment initialization failed.');
    } finally {
      setPaying(false);
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await axios.post('/api/listings/' + listing._id + '/reviews', {
        rating,
        comment
      });
      if (res.data.success) {
        setComment('');
        fetchListing();
      }
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete('/api/listings/' + listing._id + '/reviews/' + reviewId);
      fetchListing();
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  const imageUrl = listing.image && listing.image.url ? listing.image.url : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="stayaira-container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Title & Actions */}
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.4rem' }}>{listing.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              <Star size={16} fill="#E11D48" color="#E11D48" /> 4.98 · <span style={{ textDecoration: 'underline' }}>{listing.reviews ? listing.reviews.length : 0} reviews</span>
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', textDecoration: 'underline' }}>
              <MapPin size={15} /> {listing.location}, {listing.country}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isOwner && (
              <Link to={'/listings/' + listing._id + '/edit'} className="btn-outline-stayaira" style={{ padding: '0.5rem 1rem' }}>
                <Edit size={16} /> Edit Listing
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Image Showcase */}
      <div className="detail-hero-image" style={{ borderRadius: '24px', overflow: 'hidden', height: '460px', width: '100%', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <img src={imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Two Columns Grid */}
      <div className="detail-layout-grid">
        
        {/* Left Column: Details, Host Bio, AirCover, Amenities, Reviews, Map */}
        <div>
          
          {/* Host Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                Entire villa hosted by {listing.owner ? (listing.owner.fullName || listing.owner.username) : 'StayAira Superhost'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {listing.category || 'Luxury Villa'} · 8 guests · 4 bedrooms · 4 baths
              </p>
            </div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.2rem' }}>
              {listing.owner ? (listing.owner.username.slice(0, 1).toUpperCase()) : 'S'}
            </div>
          </div>

          {/* Description */}
          <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem' }}>About this space</h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {listing.description}
            </p>
          </div>

          {/* StayAira AirCover Banner */}
          <div style={{ background: 'rgba(225,29,72,0.05)', border: '1.5px solid rgba(225,29,72,0.2)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#E11D48' }}>air</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>cover</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.
            </p>
          </div>

          {/* Interactive Map */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Where you'll be</h3>
            <div style={{ height: '320px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <MapContainer center={[15.2993, 74.1240]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[15.2993, 74.1240]}>
                  <Popup>{listing.title}<br />{listing.location}, {listing.country}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} fill="#E11D48" color="#E11D48" /> {listing.reviews ? listing.reviews.length : 0} Reviews
            </h3>

            {/* Leave Review Box */}
            {user && (
              <form onSubmit={handleReviewSubmit} style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem' }}>Leave a Review</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star size={22} fill={star <= rating ? '#F59E0B' : 'none'} color={star <= rating ? '#F59E0B' : '#CBD5E1'} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="stayaira-input"
                  rows="3"
                  placeholder="Share your stay experience with future guests..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  style={{ marginBottom: '1rem', resize: 'vertical' }}
                />
                <button type="submit" disabled={submittingReview} className="btn-primary-stayaira">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {listing.reviews && listing.reviews.map(rev => (
                <div key={rev._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.85rem' }}>
                        {rev.author ? rev.author.username.slice(0, 1).toUpperCase() : 'G'}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{rev.author ? (rev.author.fullName || rev.author.username) : 'StayAira Guest'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {user && rev.author && user._id === rev.author._id && (
                      <button onClick={() => handleDeleteReview(rev._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '2px', margin: '4px 0 8px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} fill={s <= (rev.rating || 5) ? '#F59E0B' : 'none'} color="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>₹{nightPrice.toLocaleString('en-IN')}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / night</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '700' }}>
                <Star size={14} fill="#E11D48" color="#E11D48" /> 4.98
              </div>
            </div>

            {/* Date Inputs */}
            <div style={{ border: '1.5px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.6rem 0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>CHECK-IN</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', fontWeight: '600', color: 'inherit' }} />
                </div>
                <div style={{ padding: '0.6rem 0.9rem', borderLeft: '1px solid var(--border-color)' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>CHECKOUT</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', fontWeight: '600', color: 'inherit' }} />
                </div>
              </div>
              <div style={{ padding: '0.6rem 0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>GUESTS</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', fontWeight: '600', color: 'inherit', outline: 'none' }}>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="4">4 guests</option>
                  <option value="6">6 guests</option>
                </select>
              </div>
            </div>

            {/* Reserve CTA */}
            <button 
              onClick={handleReserve} 
              disabled={paying}
              className="btn-primary-stayaira" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem', marginBottom: '0.75rem' }}
            >
              {paying ? 'Initiating Razorpay...' : 'Reserve & Pay'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>You won't be charged yet until verified</p>

            {/* Pricing Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>₹{nightPrice.toLocaleString('en-IN')} × {totalNights} nights</span>
                <span>₹{baseTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>StayAira service fee (12%)</span>
                <span>₹{serviceFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Occupancy taxes (6%)</span>
                <span>₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                <span>Total before taxes</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
