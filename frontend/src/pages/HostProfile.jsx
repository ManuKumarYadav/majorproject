import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase, ShieldCheck, Award, MessageSquare,
  Globe, Phone, CheckCircle2, Heart,
  MapPin, Clock, X, Shield, Compass,
  PawPrint, Lightbulb, Music, Wand2
} from 'lucide-react';

const HOST_BIO_DEFAULT = "I'm very hapning and I can make others laugh at any situation .. I'm very emotional too";

export default function HostProfile() {
  const { id } = useParams();
  const [hostData, setHostData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [verifiedOpen, setVerifiedOpen] = useState(false);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const res = await axios.get('/api/listings');
        if (res.data.success) {
          const allListings = res.data.listings;
          const hostListings = allListings.filter(l =>
            l.owner && (l.owner._id === id || l.owner === id)
          );
          if (hostListings.length > 0 && hostListings[0].owner) {
            setHostData(hostListings[0].owner);
            setListings(hostListings);
          } else {
            const fallbackListing = allListings.find(l => l.owner && l.owner._id === id);
            if (fallbackListing) {
              setHostData(fallbackListing.owner);
            }
          }
        }
      } catch (err) {
        console.error('Host profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHost();
  }, [id]);

  if (loading) {
    return (
      <div className="stayaira-container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="shimmer" style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
        <div className="shimmer" style={{ width: '200px', height: '24px', borderRadius: '12px', margin: '0 auto 1rem' }} />
        <div className="shimmer" style={{ width: '300px', height: '16px', borderRadius: '10px', margin: '0 auto' }} />
      </div>
    );
  }

  if (!hostData) {
    return (
      <div className="stayaira-container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Host not found</h2>
        <Link to="/" className="btn-primary-stayaira">Back to Explore</Link>
      </div>
    );
  }

  const name = hostData.fullName || hostData.username || 'Host';
  const firstName = name.split(' ')[0];
  const avatarUrl = hostData.avatar?.url;
  const joinDate = hostData.createdAt
    ? new Date(hostData.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'January 2023';
  const totalReviews = listings.reduce((sum, l) => sum + (l.reviews?.length || 0), 0);
  const hostPhone = hostData.phone || '+91 7352966256';

  // Build info rows like Airbnb screenshot
  const infoRows = [
    { icon: <Briefcase size={19} />, label: 'My work', value: hostData.work || 'contractor' },
    { icon: <Compass size={19} />, label: "Where I've always wanted to go", value: hostData.dreamDestinations || 'every new places on earth' },
    { icon: <PawPrint size={19} />, label: 'Pets', value: hostData.pets || 'no' },
    { icon: <Lightbulb size={19} />, label: 'Fun fact', value: hostData.funFact || "I'm very interesting" },
    { icon: <Music size={19} />, label: 'Favourite song in school', value: hostData.favSong || 'tuje dekha toh yeah jana sanam' },
    { icon: <Clock size={19} />, label: 'I spend too much time', value: hostData.spendTime || 'thinking' },
    { icon: <Wand2 size={19} />, label: 'Most useless skill', value: hostData.uselessSkill || 'talking' },
    { icon: <Globe size={19} />, label: 'Speaks', value: hostData.languages || 'English, Hindi' },
    { icon: <MapPin size={19} />, label: 'Lives in', value: hostData.location || 'Mumbai, India' },
    { icon: <ShieldCheck size={19} />, label: 'Identity verified', value: null, clickable: true, onClick: () => setVerifiedOpen(v => !v) },
  ];

  return (
    <div className="host-profile-page">
      <div className="stayaira-container host-profile-container">

        {/* ── LEFT COLUMN: Airbnb Profile Card (Split: Avatar+Name on left, Stats on right) ── */}
        <aside className="host-profile-sidebar">
          <div className="host-sidebar-card">
            {/* User Info */}
            <div className="host-card-user-info">
              <div className="host-sidebar-avatar-wrap">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="host-sidebar-avatar-img" />
                ) : (
                  <div className="host-sidebar-avatar-initial">
                    {name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="host-sidebar-medal">
                  <ShieldCheck size={13} color="#fff" />
                </div>
              </div>

              <h1 className="host-sidebar-name">{firstName}</h1>
              <p className="host-sidebar-superhost">
                <Award size={13} /> Superhost
              </p>
            </div>

            {/* Vertical Stats on Right Side of Card */}
            <div className="host-sidebar-stats-vertical">
              <div className="host-stat-row">
                <span className="stat-big-v">{totalReviews || 73}</span>
                <span className="stat-lbl-v">Reviews</span>
              </div>
              <div className="host-stat-divider-h" />
              <div className="host-stat-row">
                <span className="stat-big-v">4.84★</span>
                <span className="stat-lbl-v">Rating</span>
              </div>
              <div className="host-stat-divider-h" />
              <div className="host-stat-row">
                <span className="stat-big-v">{listings.length || 8}</span>
                <span className="stat-lbl-v">Months hosting</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT COLUMN ── */}
        <div className="host-profile-main">

          {/* Airbnb-style info rows */}
          <div className="host-info-rows">
            {infoRows.map((row, i) => (
              <React.Fragment key={i}>
                {row.clickable ? (
                  <button
                    className="host-info-row host-info-row-clickable"
                    onClick={row.onClick}
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '0.2rem 0' }}
                  >
                    <span className="host-info-icon">{row.icon}</span>
                    <span className="host-info-text" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      {row.label}
                    </span>
                  </button>
                ) : (
                  <div className="host-info-row">
                    <span className="host-info-icon">{row.icon}</span>
                    <span className="host-info-text">
                      {row.label}: {row.value}
                    </span>
                  </div>
                )}

                {/* Inline verification card — opens below this row */}
                {row.clickable && verifiedOpen && (
                  <div className="host-verified-inline-card">
                    {/* Close */}
                    <button
                      onClick={() => setVerifiedOpen(false)}
                      style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(0,0,0,0.22)', border: 'none', borderRadius: '50%',
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 2
                      }}
                    >
                      <X size={16} />
                    </button>

                    {/* Gradient header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #E11D48 0%, #BE185D 40%, #7C3AED 100%)',
                      borderRadius: '16px 16px 0 0',
                      padding: '1.25rem 1.25rem 1.1rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0, opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '28px 28px'
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', gap: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#fff', margin: '0 0 3px' }}>
                            {firstName}
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: '600', margin: '0 0 0.75rem' }}>
                            Verified since {joinDate}
                          </p>
                          <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.55', margin: 0 }}>
                            Trust is the cornerstone of StayAira's community, and identity verification is part of how we build it.
                          </p>
                        </div>
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={name} style={{
                            width: '64px', height: '64px', borderRadius: '12px',
                            objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.5)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.3)', flexShrink: 0
                          }} />
                        ) : (
                          <div style={{
                            width: '64px', height: '64px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.25)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', fontWeight: '900', color: '#fff',
                            border: '2.5px solid rgba(255,255,255,0.5)', flexShrink: 0
                          }}>
                            {name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                      <p style={{ fontSize: '0.87rem', color: 'var(--text-main)', lineHeight: '1.7', margin: '0 0 0.75rem' }}>
                        Our identity verification process checks a person's information against trusted third-party sources or a government ID. The process has safeguards but doesn't guarantee that someone is who they say they are.
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Shield size={14} color="#10B981" />
                        <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700' }}>Verified by StayAira</span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Host Bio Paragraph */}
          <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', lineHeight: '1.75', margin: '1.5rem 0 2rem' }}>
            {hostData.bio || HOST_BIO_DEFAULT}
          </p>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          {/* Contact Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', marginBottom: '2.5rem' }}>
            <button
              id="host-profile-message-btn"
              onClick={() => setMsgOpen(true)}
              className="host-message-btn"
              style={{ margin: 0 }}
            >
              <MessageSquare size={17} />
              Message {firstName}
            </button>

            <a
              href={`tel:${hostPhone}`}
              className="btn-outline-stayaira"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.92rem',
                textDecoration: 'none'
              }}
            >
              <Phone size={16} color="var(--primary)" />
              <span>{hostPhone}</span>
            </a>
          </div>

          {/* Host's Listings */}
          {listings.length > 0 && (
            <div className="host-profile-listings">
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                {firstName}'s listings ({listings.length})
              </h3>
              <div className="host-listings-grid">
                {listings.slice(0, 6).map(listing => (
                  <Link to={`/listings/${listing._id}`} key={listing._id} className="host-listing-card">
                    <div className="host-listing-img-wrap">
                      <img
                        src={listing.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                        alt={listing.title}
                        className="host-listing-img"
                      />
                      <button
                        className="host-listing-heart"
                        onClick={e => e.preventDefault()}
                        aria-label="Wishlist"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    <div style={{ padding: '0.85rem 0 0' }}>
                      <p style={{ fontWeight: '800', fontSize: '0.92rem', marginBottom: '2px', color: 'var(--text-main)' }}>
                        {listing.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {listing.location}, {listing.country}
                      </p>
                      <p style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        ₹{(listing.price || 0).toLocaleString('en-IN')}
                        <span style={{ fontWeight: '500', fontSize: '0.78rem', color: 'var(--text-muted)' }}> / night</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Safety notice */}
          <div className="host-safety-notice" style={{ marginTop: '2rem' }}>
            <ShieldCheck size={19} color="#E11D48" style={{ flexShrink: 0 }} />
            <span>
              To protect your payment, always use <strong>StayAira</strong> to send money and communicate with hosts.
            </span>
          </div>
        </div>
      </div>

      {/* ── Message Modal ── */}
      {msgOpen && (
        <div
          className="modal-overlay"
          onClick={() => { setMsgOpen(false); setMsgSent(false); setMsgText(''); }}
        >
          <div
            className="host-msg-modal"
            onClick={e => e.stopPropagation()}
          >
            {!msgSent ? (
              <>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Message {firstName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Ask about availability, special requests, or anything else about the property.
                </p>
                <textarea
                  rows="5"
                  placeholder={`Hi ${firstName}, I'm interested in your property...`}
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  className="stayaira-input"
                  style={{ marginBottom: '1rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn-primary-stayaira"
                    style={{ flex: 1 }}
                    onClick={() => { if (msgText.trim()) setMsgSent(true); }}
                  >
                    Send message
                  </button>
                  <button
                    className="btn-outline-stayaira"
                    onClick={() => setMsgOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
                <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Direct phone for {firstName}:
                  </p>
                  <a
                    href={`tel:${hostPhone}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.92rem' }}
                  >
                    <Phone size={15} /> {hostPhone}
                  </a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Message sent!</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {firstName} typically responds within an hour.
                </p>
                <button
                  className="btn-primary-stayaira"
                  onClick={() => { setMsgOpen(false); setMsgSent(false); setMsgText(''); }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
