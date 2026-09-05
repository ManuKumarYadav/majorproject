import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Camera, User, Mail, MapPin, Briefcase, Phone, FileText, ArrowLeft,
  Check, Loader, Shield, Lock, Globe, Sparkles, ExternalLink,
  Award, CheckCircle2, ChevronRight, AlertCircle, Bell, Eye, KeyRound
} from 'lucide-react';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'security' | 'preferences'
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    work: user?.work || '',
    phone: user?.phone || '',
    languages: user?.languages || 'English, Hindi',
  });

  // Keep form in sync if user loads/refreshes
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        work: user.work || '',
        phone: user.phone || '',
        languages: user.languages || 'English, Hindi',
      });
      if (user.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      }
    }
  }, [user]);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Notification Preferences (local state)
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailOffers, setEmailOffers] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleBioPrompt = (text) => {
    setForm(prev => ({
      ...prev,
      bio: prev.bio ? `${prev.bio} ${text}` : text
    }));
    setHasChanges(true);
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 20; // base for registration
    if (user?.email) score += 15;
    if (form.fullName.trim()) score += 20;
    if (avatarPreview) score += 20;
    if (form.location.trim()) score += 10;
    if (form.work.trim()) score += 5;
    if (form.bio.trim()) score += 10;
    return Math.min(100, score);
  };

  const completionPercent = calculateCompletion();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await axios.put('/api/auth/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setHasChanges(false);
        await refreshUser();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#E11D48', '#FB7185', '#FBBF24', '#10B981']
          });
        } catch {}
      } else {
        setError(res.data.message || 'Update failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving changes.');
    } finally {
      setLoading(false);
    }
  };

  const initials = (form.fullName || user?.username || 'U').slice(0, 1).toUpperCase();
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024';

  const TABS = [
    { id: 'personal', label: 'Personal Information', icon: <User size={15} /> },
    { id: 'security', label: 'Login & Security', icon: <Lock size={15} /> },
    { id: 'preferences', label: 'Preferences & Alerts', icon: <Bell size={15} /> }
  ];

  return (
    <div className="edit-profile-page">
      <div className="stayaira-container" style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* ── Breadcrumb & Top Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color)',
              borderRadius: '9999px', padding: '0.4rem 0.95rem', cursor: 'pointer',
              color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: '700',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Profile Strength Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color)',
            borderRadius: '9999px', padding: '0.35rem 0.95rem',
            fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <Sparkles size={13} color="#E11D48" />
            <span>Profile Strength:</span>
            <span style={{ color: completionPercent === 100 ? '#10B981' : '#E11D48', fontWeight: '800' }}>
              {completionPercent}%
            </span>
            <div style={{ width: '50px', height: '5px', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${completionPercent}%`, height: '100%', background: completionPercent === 100 ? '#10B981' : 'var(--primary-gradient)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(225,29,72,0.08)', color: '#E11D48', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Account Settings
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Personal Info &amp; Preferences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', margin: 0 }}>
            Manage your personal identity, public host profile, contact verification, and security.
          </p>
        </div>

        {/* ── Mobile Horizontal Segmented Tabs ── */}
        <div className="mobile-tabs-container">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`account-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main Two Column Grid Layout ── */}
        <div className="account-settings-grid">
          
          {/* ════ LEFT COLUMN: Identity Showcase & Desktop Nav ════ */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Live Profile Card */}
            <div className="account-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header Gradient Banner */}
              <div style={{
                height: '80px',
                background: 'linear-gradient(135deg, #0F172A 0%, #E11D48 100%)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: '10px', right: '12px',
                  background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                  color: '#fff', fontSize: '0.68rem', fontWeight: '700',
                  padding: '3px 8px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Eye size={10} /> Live Preview
                </div>
              </div>

              {/* Avatar & Core Identity */}
              <div style={{ padding: '0 1.25rem 1.25rem', marginTop: '-42px', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3.5px solid var(--card-bg, #fff)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'var(--primary-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '2rem',
                      fontWeight: '800',
                      border: '3.5px solid var(--card-bg, #fff)',
                      boxShadow: '0 6px 20px rgba(225,29,72,0.35)'
                    }}>
                      {initials}
                    </div>
                  )}

                  {/* Camera Upload Badge */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    title="Change Photo"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#E11D48',
                      border: '2px solid var(--card-bg, #fff)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 3px', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                  {form.fullName || user?.username || 'Your Name'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 0.85rem', wordBreak: 'break-all' }}>
                  {user?.email}
                </p>

                {/* Verified Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(16,185,129,0.1)', color: '#059669',
                  border: '1px solid rgba(16,185,129,0.25)', borderRadius: '9999px',
                  padding: '3px 10px', fontSize: '0.72rem', fontWeight: '700', marginBottom: '1rem'
                }}>
                  <CheckCircle2 size={12} /> Verified Member
                </div>

                {/* Live Details Breakdown */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                  textAlign: 'left',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} color="#E11D48" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.location || 'Location not set'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)' }}>
                    <Briefcase size={14} color="#6366F1" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.work || 'Profession not set'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)' }}>
                    <Globe size={14} color="#10B981" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.languages || 'English, Hindi'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)' }}>
                    <Award size={14} color="#F59E0B" style={{ flexShrink: 0 }} />
                    <span>Member since {memberYear}</span>
                  </div>
                </div>

                {/* View Public Host Profile */}
                {user?._id && (
                  <Link
                    to={`/host/${user._id}`}
                    target="_blank"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      marginTop: '1rem',
                      padding: '0.5rem 0.9rem',
                      background: 'var(--bg-secondary, #F1F5F9)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>View Public Profile</span>
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Navigation Tabs Menu */}
            <div className="account-card" style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.95rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {tab.icon} {tab.label}
                  </span>
                  <ChevronRight size={14} style={{ opacity: activeTab === tab.id ? 1 : 0.4 }} />
                </button>
              ))}
            </div>

            {/* StayAira Trust & Security Shield */}
            <div style={{
              background: 'rgba(225,29,72,0.04)',
              border: '1px solid rgba(225,29,72,0.18)',
              borderRadius: '18px',
              padding: '1.1rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(225,29,72,0.12)', color: '#E11D48',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Shield size={18} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 3px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  StayAira Privacy Shield
                </h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Your personal info is encrypted with 256-bit AES protection.
                </p>
              </div>
            </div>

          </aside>

          {/* ════ RIGHT COLUMN: Interactive Settings Form ════ */}
          <main>
            <form onSubmit={handleSubmit}>

              {/* ── TAB 1: PERSONAL INFORMATION ── */}
              {activeTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Photo Upload Showcase Card */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Camera size={18} color="#E11D48" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Profile Photo
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      A clear photo helps hosts and guests connect with confidence on StayAira.
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1rem',
                      background: 'var(--bg-secondary, #F8FAFC)',
                      border: '1.5px dashed var(--border-color)',
                      borderRadius: '16px',
                      flexWrap: 'wrap'
                    }}>
                      {/* Avatar preview circle */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #E11D48' }}
                          />
                        ) : (
                          <div style={{
                            width: '70px', height: '70px', borderRadius: '50%',
                            background: 'var(--primary-gradient)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.6rem', fontWeight: '800'
                          }}>
                            {initials}
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="btn-primary-stayaira"
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Camera size={13} /> Upload Photo
                          </button>
                          {avatarPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setAvatarFile(null);
                                setAvatarPreview(null);
                                setHasChanges(true);
                              }}
                              className="btn-outline-stayaira"
                              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                          Square JPG or PNG, max size 5MB.
                        </p>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Core Personal Details Card */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <User size={18} color="#E11D48" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Basic Information
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      This information appears on your public host profile and booking confirmations.
                    </p>

                    {/* Form Fields: 2-column on desktop, clean full-width 1-column on phone */}
                    <div className="account-form-grid">
                      {/* Full Name */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                          <User size={14} color="#E11D48" /> Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="stayaira-input"
                          required
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                          Displayed on your reservations and public reviews.
                        </span>
                      </div>

                      {/* Phone */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                          <Phone size={14} color="#10B981" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 7352966256"
                          className="stayaira-input"
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                          Used for booking updates and WhatsApp concierge.
                        </span>
                      </div>

                      {/* Location */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                          <MapPin size={14} color="#E11D48" /> Where You Live
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="e.g. Patna, Bihar, India"
                          className="stayaira-input"
                        />
                      </div>

                      {/* Work / Profession */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                          <Briefcase size={14} color="#6366F1" /> Profession / Work
                        </label>
                        <input
                          type="text"
                          name="work"
                          value={form.work}
                          onChange={handleChange}
                          placeholder="e.g. Software Engineer / Student"
                          className="stayaira-input"
                        />
                      </div>

                      {/* Languages */}
                      <div className="full-col">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                          <Globe size={14} color="#0EA5E9" /> Languages You Speak
                        </label>
                        <input
                          type="text"
                          name="languages"
                          value={form.languages}
                          onChange={handleChange}
                          placeholder="e.g. English, Hindi, Punjabi"
                          className="stayaira-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Me / Bio Card */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} color="#E11D48" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                          About You (Bio)
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {form.bio.length} / 500
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      Share your travel style, hobbies, and what makes a stay memorable for you.
                    </p>

                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      maxLength={500}
                      rows={4}
                      placeholder="e.g. Passionate traveler who loves exploring serene villas, local culture, and quiet mountain escapes..."
                      className="stayaira-input"
                      style={{ width: '100%', resize: 'vertical', lineHeight: 1.6, marginBottom: '0.75rem', boxSizing: 'border-box' }}
                    />

                    {/* Quick bio suggestion prompts */}
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
                        Click to add inspiration:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {[
                          "Love discovering secluded luxury villas.",
                          "Always looking for unique local food.",
                          "Quiet mountain cabins are my favorite escape.",
                          "Happy to share insider recommendations!"
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleBioPrompt(prompt)}
                            style={{
                              background: 'var(--bg-secondary, #F1F5F9)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '9999px',
                              padding: '3px 9px',
                              fontSize: '0.72rem',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            + {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connected Account Email */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={18} color="#E11D48" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                          Account Email
                        </h3>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(16,185,129,0.1)', color: '#059669',
                        padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '700'
                      }}>
                        <CheckCircle2 size={11} /> Primary Verified
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      Your primary email address is used for secure authentication and booking receipts.
                    </p>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="stayaira-input"
                        style={{ width: '100%', opacity: 0.75, cursor: 'not-allowed', background: 'var(--bg-secondary, #F8FAFC)', boxSizing: 'border-box' }}
                      />
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Lock size={12} /> Protected
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ── TAB 2: LOGIN & SECURITY ── */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Password Card */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <KeyRound size={18} color="#E11D48" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Password &amp; Credentials
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      Keep your account safe by using a strong password.
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'var(--bg-secondary, #F8FAFC)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      flexWrap: 'wrap',
                      gap: '0.85rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                          Password
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          •••••••••••• (Encrypted on StayAira Server)
                        </div>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="btn-outline-stayaira"
                        style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem', borderRadius: '9999px', textDecoration: 'none' }}
                      >
                        Change Password
                      </Link>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Shield size={18} color="#10B981" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Connected Sessions &amp; Security
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Devices currently signed in to your StayAira account.
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      background: 'var(--bg-secondary, #F8FAFC)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Current Browser Session</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Active Now</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: '5px' }}>
                        Active
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* ── TAB 3: PREFERENCES & NOTIFICATIONS ── */}
              {activeTab === 'preferences' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div className="account-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Bell size={18} color="#E11D48" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Notifications &amp; Concierge Alerts
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      Choose how you want to be updated about bookings, check-in instructions, and villa discounts.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {/* WhatsApp toggle */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '14px',
                        background: 'var(--bg-secondary, #F8FAFC)',
                        gap: '0.75rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                            WhatsApp Instant Alerts
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Receive booking confirmations and host check-in codes on WhatsApp (+91).
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={whatsappAlerts}
                          onChange={(e) => setWhatsappAlerts(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#E11D48', cursor: 'pointer', flexShrink: 0 }}
                        />
                      </div>

                      {/* Email Offers toggle */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '14px',
                        background: 'var(--bg-secondary, #F8FAFC)',
                        gap: '0.75rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                            StayAira Promotions &amp; Coupon Codes
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Get early access to luxury villa deals and STAYAIRA50 discounts.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailOffers}
                          onChange={(e) => setEmailOffers(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#E11D48', cursor: 'pointer', flexShrink: 0 }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Status Alert Banners */}
              {error && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1.5px solid rgba(239,68,68,0.3)',
                  borderRadius: '14px',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              {success && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  borderRadius: '14px',
                  color: '#10B981',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check size={16} style={{ flexShrink: 0 }} /> {success}
                </div>
              )}

              {/* ── Action Bar ── */}
              <div className="account-sticky-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hasChanges ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#E11D48', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E11D48', display: 'inline-block' }} />
                      Unsaved changes
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      All changes saved
                    </span>
                  )}
                </div>

                <div className="actions-group" style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-outline-stayaira"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '9999px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-stayaira"
                    disabled={loading}
                    style={{
                      padding: '0.55rem 1.5rem',
                      fontSize: '0.85rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 16px rgba(225,29,72,0.35)'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader size={15} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </main>

        </div>
      </div>
    </div>
  );
}
