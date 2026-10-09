import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, Mail, Lock, Eye, EyeOff, ChevronRight,
  Sun, Moon, ArrowLeft, AlertCircle, HelpCircle,
  PhoneCall, ShieldCheck
} from 'lucide-react';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
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
          RIGHT PANEL: LOGIN FORM + APPEARANCE + OPTIONS
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
          <h2 className="curve-auth-title">Welcome back</h2>
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
            {/* Email Address / Username Field */}
            <div className="curve-auth-field">
              <label className="curve-auth-label">Email Address</label>
              <div className="curve-auth-input-box">
                <input
                  type="text"
                  className="curve-auth-input"
                  placeholder="hello@stayaira.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <Mail size={18} className="curve-auth-input-icon" />
              </div>
            </div>

            {/* Password Field */}
            <div className="curve-auth-field">
              <div className="curve-auth-label-row">
                <label className="curve-auth-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" className="curve-auth-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="curve-auth-input-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="curve-auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="curve-auth-submit-btn"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="curve-auth-divider">
            <div className="curve-auth-divider-line"></div>
            <span className="curve-auth-divider-text">or continue with</span>
            <div className="curve-auth-divider-line"></div>
          </div>

          {/* Google Sign-in */}
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
            Continue with Google
          </button>

          {/* Footer: Create Account Link */}
          <p className="curve-auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="curve-auth-footer-link">
              Sign up
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
