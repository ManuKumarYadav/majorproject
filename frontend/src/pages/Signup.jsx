import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, Mail, Lock, User, Eye, EyeOff, ChevronRight,
  Sun, Moon, ArrowLeft, AlertCircle, HelpCircle,
  PhoneCall, ShieldCheck, Check, X
} from 'lucide-react';

// ── Password strength scorer ──────────────────────────────────────────
function getPasswordStrength(pwd) {
  const checks = {
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number:    /[0-9]/.test(pwd),
    special:   /[^A-Za-z0-9]/.test(pwd),
  };
  const score = Object.values(checks).filter(Boolean).length; // 0–4
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
  return { checks, score, label: levels[score] || '', color: colors[score] || '' };
}

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isPasswordOk = strength.score >= 3; // require Good or Strong

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordOk) {
      setError('Please choose a stronger password (at least Good strength).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await signup(username, email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    }
  };

  return (
    <div className="curve-auth-wrapper">
      {/* ─────────────────────────────────────────────
          LEFT PANEL: BRAND SHOWCASE & TAGLINE
      ───────────────────────────────────────────── */}
      <div className="curve-auth-left">
        <div className="curve-auth-left-overlay"></div>

        <div className="curve-auth-left-content">
          {/* Logo Card */}
          <Link to="/" className="curve-auth-logo-box" title="StayAira Home">
            <Compass size={36} color="#ffffff" />
          </Link>

          {/* Brand Name */}
          <h1 className="curve-auth-brand-name">StayAira</h1>

          {/* Tagline Card */}
          <div className="curve-auth-tagline-card">
            <p className="curve-auth-tagline-text">
              A fast and reliable luxury villa booking platform.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          RIGHT PANEL: SIGNUP FORM + APPEARANCE + OPTIONS
      ───────────────────────────────────────────── */}
      <div className="curve-auth-right">
        {/* Organic Curve Divider SVG */}
        <div className="curve-auth-svg-divider">
          <svg
            viewBox="0 0 160 1000"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M 160,0 C 90,160 15,480 0,1000 L 160,1000 Z"
              fill="var(--card-bg)"
            />
          </svg>
        </div>

        {/* Top Bar with Appearance Switcher & Back to Site */}
        <div className="curve-auth-top-bar">
          {/* Dedicated Appearance / Theme Switcher */}
          <div className="curve-appearance-group">
            <span className="curve-appearance-label">Appearance:</span>
            <div className="curve-appearance-pills">
              <button
                type="button"
                onClick={() => { if (theme === 'dark') toggleTheme(); }}
                className={`curve-appearance-btn ${theme !== 'dark' ? 'active' : ''}`}
                title="Light mode"
              >
                <Sun size={13} color="#F59E0B" /> Light
              </button>
              <button
                type="button"
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`curve-appearance-btn ${theme === 'dark' ? 'active' : ''}`}
                title="Dark mode"
              >
                <Moon size={13} color="#818CF8" /> Dark
              </button>
            </div>
          </div>

          <Link to="/" className="curve-auth-back-link">
            <ArrowLeft size={14} />
            <span>Back to site</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="curve-auth-form-container">
          {/* Heading */}
          <h2 className="curve-auth-title">Create account</h2>
          <p className="curve-auth-subtitle">
            Enter your details to access your dashboard.
          </p>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1.5px solid #EF4444',
              color: '#EF4444',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="curve-auth-field">
              <label className="curve-auth-label">Choose Username</label>
              <div className="curve-auth-input-box">
                <input
                  type="text"
                  className="curve-auth-input"
                  placeholder="wanderer_2026"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  pattern="^[a-zA-Z0-9_.-]+$"
                  required
                  autoComplete="username"
                />
                <User size={18} className="curve-auth-input-icon" />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="curve-auth-field">
              <label className="curve-auth-label">Email Address</label>
              <div className="curve-auth-input-box">
                <input
                  type="email"
                  className="curve-auth-input"
                  placeholder="hello@stayaira.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Mail size={18} className="curve-auth-input-icon" />
              </div>
            </div>

            {/* Password Field */}
            <div className="curve-auth-field">
              <label className="curve-auth-label">Password</label>
              <div className="curve-auth-input-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="curve-auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <Lock size={18} className="curve-auth-input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="curve-auth-toggle-pwd"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ── Password Strength Meter ────────────────────── */}
              {password.length > 0 && (
                <div className="pwd-strength-wrapper">
                  {/* Segmented progress bars */}
                  <div className="pwd-strength-bars">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className="pwd-strength-bar"
                        style={{
                          background: strength.score >= seg ? strength.color : 'var(--border-color)',
                          transition: 'background 0.35s ease'
                        }}
                      />
                    ))}
                  </div>
                  {/* Label */}
                  {strength.label && (
                    <span className="pwd-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}

                  {/* Requirements checklist */}
                  <ul className="pwd-requirements">
                    {[
                      { key: 'length',    text: 'At least 8 characters' },
                      { key: 'uppercase', text: 'One uppercase letter (A-Z)' },
                      { key: 'number',    text: 'One number (0-9)' },
                      { key: 'special',   text: 'One special character (!@#…)' },
                    ].map(({ key, text }) => (
                      <li key={key} className={`pwd-req-item ${strength.checks[key] ? 'met' : ''}`}>
                        {strength.checks[key]
                          ? <Check size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                          : <X     size={12} style={{ color: '#EF4444', flexShrink: 0 }} />
                        }
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordOk}
              className="curve-auth-submit-btn"
              title={!isPasswordOk ? 'Strengthen your password first' : ''}
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="curve-auth-divider">
            <div className="curve-auth-divider-line"></div>
            <span className="curve-auth-divider-text">or continue with</span>
            <div className="curve-auth-divider-line"></div>
          </div>

          {/* Google Sign-up */}
          <button
            type="button"
            onClick={handleGoogle}
            className="curve-auth-google-btn"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: '18px', height: '18px' }}
            />
            Sign up with Google
          </button>

          {/* Footer: Sign In Link */}
          <p className="curve-auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="curve-auth-footer-link">
              Sign in
            </Link>
          </p>

          {/* Extra Options: Help Center & Support */}
          <div className="curve-auth-help-bar">
            <Link to="/help" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={13} /> Help Center
            </Link>
            <span>·</span>
            <a href="tel:+917352966256" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={13} /> 24/7 Concierge
            </a>
            <span>·</span>
            <Link to="/terms" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> Privacy & Terms
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
