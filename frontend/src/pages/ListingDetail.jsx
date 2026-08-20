import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Star, Share2, Heart, ShieldCheck, Sparkles, MapPin, 
  Calendar, Users, CheckCircle2, MessageSquare, Trash2, Edit,
  Tag, Flag, Award, MessageCircle, RotateCcw, Briefcase, Music, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ListingDetail() {
  const { id } = useParams();
  const { user, razorpayKeyId } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubNav, setShowSubNav] = useState(false);
  const [hostMsgModal, setHostMsgModal] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowSubNav(window.scrollY > 420);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const originalPrice = Math.round(nightPrice * 1.15);
  const baseTotal = nightPrice * totalNights;
  const serviceFee = Math.round(baseTotal * 0.12);
  const taxes = Math.round(baseTotal * 0.06);
  const finalTotal = baseTotal + serviceFee + taxes;

  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);

  const handleClearDates = () => {
    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    const d2 = new Date();
    d2.setDate(d2.getDate() + 3);
    setCheckIn(d1.toISOString().split('T')[0]);
    setCheckOut(d2.toISOString().split('T')[0]);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Razorpay Checkout
  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPaying(true);
    try {
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
  const ownerName = listing.owner ? (listing.owner.fullName || listing.owner.username) : 'Sameer';

  return (
    <div className="detail-page-wrapper">
      {/* Sticky Secondary Navigation Bar */}
      {showSubNav && (
        <div className="detail-sub-nav" style={{
          position: 'sticky', top: '80px', zIndex: 48, background: 'var(--card-bg)',
          borderBottom: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease'
        }}>
          <div className="stayaira-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: '700' }}>
              <button onClick={() => scrollToSection('photos')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Photos</button>
              <button onClick={() => scrollToSection('amenities')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Amenities</button>
              <button onClick={() => scrollToSection('reviews')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Reviews</button>
              <button onClick={() => scrollToSection('location')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Location</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '6px' }}>₹{originalPrice.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: '1.15rem', fontWeight: '800' }}>₹{nightPrice.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> for {totalNights} nights</span>
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', fontWeight: '700' }}>★ 4.98</span>
              </div>
              <button onClick={handleReserve} className="btn-primary-stayaira" style={{ padding: '0.55rem 1.4rem' }}>
                Reserve
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="stayaira-container detail-main-container" style={{ padding: '2rem 1.5rem 4rem' }}>
        
        {/* Title & Actions */}
        <div id="photos" style={{ marginBottom: '1.2rem' }}>
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
          
          {/* Left Column */}
          <div>
            
            {/* Host Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                  Entire villa hosted by {ownerName}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {listing.category || 'Luxury Villa'} · 8 guests · 4 bedrooms · 4 baths
                </p>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.2rem', position: 'relative' }}>
                {ownerName.slice(0, 1).toUpperCase()}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '18px', height: '18px', borderRadius: '50%', background: '#E11D48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '2px solid #fff' }}>
                  <Award size={10} />
                </div>
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

            {/* Amenities Section */}
            <div id="amenities" style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>What this place offers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> High-Speed Wi-Fi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> Private Infinity Pool</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> Free Parking on Premises</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> Air Conditioning & Heating</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> Ocean / Mountain View</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={18} color="var(--primary)" /> Dedicated Workspace</div>
              </div>
            </div>

            {/* Interactive Date Selection / Nights Section */}
            <div style={{ paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  {totalNights} {totalNights === 1 ? 'night' : 'nights'} in {listing.location}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              {/* Interactive Date Calendar Grid */}
              <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', textAlign: 'center' }}>
                      {new Date(checkIn).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.85rem' }}>
                      {[...Array(31)].map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected = dayNum >= 28 && dayNum <= 30;
                        return (
                          <div 
                            key={i} 
                            style={{
                              padding: '8px 0', borderRadius: '50%',
                              background: isSelected ? '#0F172A' : 'transparent',
                              color: isSelected ? '#FFFFFF' : 'inherit',
                              fontWeight: isSelected ? '700' : '500',
                              cursor: 'pointer'
                            }}
                          >
                            {dayNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="calendar-month-2">
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', textAlign: 'center' }}>
                      September 2026
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.85rem' }}>
                      {[...Array(30)].map((_, i) => {
                        const dayNum = i + 1;
                        return (
                          <div key={i} style={{ padding: '8px 0', borderRadius: '50%', color: 'inherit' }}>
                            {dayNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleClearDates} style={{ background: 'none', border: 'none', color: 'var(--text-main)', textDecoration: 'underline', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RotateCcw size={14} /> Clear dates
                </button>
              </div>
            </div>

            {/* Meet Your Host Section (Airbnb Style) */}
            <div style={{ paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Meet your host</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                
                {/* Left Host Profile Card */}
                <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.2rem', fontWeight: '800', margin: '0 auto 1rem', position: 'relative' }}>
                    {ownerName.slice(0, 1).toUpperCase()}
                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: '28px', height: '28px', borderRadius: '50%', background: '#E11D48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff' }}>
                      <Award size={14} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2px' }}>{ownerName}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>🏆 Superhost</p>

                  <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>65</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Reviews</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>4.83 ★</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Rating</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>8</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Months hosting</p>
                    </div>
                  </div>
                </div>

                {/* Right Host Details & Bio */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>{ownerName} is a Superhost</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                  </p>

                  <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Host details</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Response rate: 100%</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Responds within an hour</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Briefcase size={18} color="var(--primary)" />
                      <span><strong>My work:</strong> Hospitality & Real Estate</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Music size={18} color="var(--primary)" />
                      <span><strong>Favourite song:</strong> Tujhe Dekha Toh Yaara</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setHostMsgModal(true)} 
                    className="btn-outline-stayaira" 
                    style={{ padding: '0.65rem 1.4rem', borderRadius: '12px', fontSize: '0.9rem' }}
                  >
                    <MessageSquare size={16} /> Message host
                  </button>

                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--light-bg)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <ShieldCheck size={20} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>To help protect your payment, always use StayAira to send money and communicate with hosts.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Map */}
            <div id="location" style={{ marginBottom: '3rem' }}>
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
            <div id="reviews">
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

          {/* Right Column: Sticky Airbnb-Style Booking Widget */}
          <div className="detail-booking-sidebar" style={{ position: 'sticky', top: '100px' }}>
            {/* Top Prices Include All Fees Pill */}
            <div style={{
              background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '16px',
              padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', boxShadow: 'var(--shadow-sm)', fontSize: '0.88rem', fontWeight: '700'
            }}>
              <Tag size={16} color="#E11D48" /> Prices include all fees
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '6px' }}>
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    ₹{nightPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> for {totalNights} {totalNights === 1 ? 'night' : 'nights'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '700' }}>
                  <Star size={14} fill="#E11D48" color="#E11D48" /> 4.98
                </div>
              </div>

              {/* Date Inputs Box */}
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

              {/* Free Cancellation Badge */}
              <div style={{ background: 'var(--light-bg)', padding: '0.6rem 0.9rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                Free cancellation before {new Date(new Date(checkIn).getTime() - 24*60*60*1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
              </div>

              {/* Reserve CTA */}
              <button 
                onClick={handleReserve} 
                disabled={paying}
                className="btn-primary-stayaira" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem', marginBottom: '0.75rem' }}
              >
                {paying ? 'Initiating Razorpay...' : 'Reserve'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>You won't be charged yet</p>

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

              {/* Report Listing Button */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={() => alert('Thank you. This listing has been flagged for staff review.')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'underline', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Flag size={13} /> Report this listing
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Mobile Bottom Sticky Reserve Bar (Airbnb Style) */}
      <div className="mobile-detail-reserve-bar">
        <div>
          <p style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
            ₹{nightPrice.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>for {totalNights} nights</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textDecoration: 'underline' }}>
            {new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <button onClick={handleReserve} disabled={paying} className="btn-primary-stayaira" style={{ padding: '0.65rem 1.4rem' }}>
          {paying ? 'Initiating...' : 'Reserve'}
        </button>
      </div>

      {/* Host Message Dialog */}
      {hostMsgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card-bg)', width: '90%', maxWidth: '480px', borderRadius: '24px', padding: '2rem', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Message {ownerName}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Send a direct message regarding check-in times, house rules, or special requests.</p>
            <textarea className="stayaira-input" rows="4" placeholder="Hi Sameer, I have a question about..." style={{ marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setHostMsgModal(false)} className="btn-outline-stayaira">Cancel</button>
              <button onClick={() => { alert('Message sent to host!'); setHostMsgModal(false); }} className="btn-primary-stayaira">Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
