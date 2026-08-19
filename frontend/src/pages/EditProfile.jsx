import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Camera, User, Mail, MapPin, Briefcase, Phone, FileText, ArrowLeft, Check, Loader } from 'lucide-react';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    work: user?.work || '',
    phone: user?.phone || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        await refreshUser();
        setTimeout(() => navigate('/host/dashboard'), 1200);
      } else {
        setError(res.data.message || 'Update failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const initials = (user?.fullName || user?.username || 'U').slice(0, 1).toUpperCase();

  return (
    <div className="stayaira-container" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '680px', margin: '0 auto' }}>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600',
          marginBottom: '2rem', padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Account Settings
        </span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '4px 0' }}>Edit Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Update your personal info and profile photo.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Avatar Upload Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.5rem',
          padding: '1.5rem', background: 'var(--card-bg)',
          border: '1.5px solid var(--border-color)', borderRadius: '20px',
          marginBottom: '2rem',
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
            ) : (
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#E11D48,#f43f5e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '2rem', fontWeight: '800',
                border: '3px solid var(--primary)',
              }}>
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#E11D48', border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
              title="Change photo"
            >
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '1rem' }}>{user?.fullName || user?.username}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{user?.email}</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)',
                background: 'none', border: '1.5px solid var(--primary)',
                borderRadius: '9999px', padding: '0.3rem 0.8rem', cursor: 'pointer',
              }}
            >
              Upload photo
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{
          background: 'var(--card-bg)', border: '1.5px solid var(--border-color)',
          borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>

          {[
            { icon: <User size={16} />, label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Your full name' },
            { icon: <MapPin size={16} />, label: 'Location', name: 'location', type: 'text', placeholder: 'City, Country' },
            { icon: <Briefcase size={16} />, label: 'Work / Profession', name: 'work', type: 'text', placeholder: 'What do you do?' },
            { icon: <Phone size={16} />, label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 9876543210' },
          ].map(({ icon, label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {icon} {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="stayaira-input"
                style={{ width: '100%' }}
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <FileText size={16} /> About Me
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell guests a little about yourself..."
              className="stayaira-input"
              rows={4}
              style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Read-only email */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Mail size={16} /> Email (cannot be changed)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="stayaira-input"
              style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>

        {/* Status messages */}
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#EF4444', fontSize: '0.9rem', fontWeight: '600' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', color: '#10B981', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} /> {success}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline-stayaira"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary-stayaira"
            disabled={loading}
            style={{ flex: 2 }}
          >
            {loading ? <><Loader size={16} /> Saving...</> : <><Check size={16} /> Save Changes</>}
          </button>
        </div>

      </form>
    </div>
  );
}
