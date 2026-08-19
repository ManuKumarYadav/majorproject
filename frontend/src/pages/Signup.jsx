import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signup(username, email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(225,29,72,0.3)' }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.4rem' }}>Create StayAira Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join over 100,000+ luxury travelers & hosts worldwide.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <button 
          type="button" 
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '0.8rem', borderRadius: '12px',
            background: 'var(--light-bg)', border: '1.5px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '1.5rem',
            color: 'var(--text-main)'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
          Sign up with Google
        </button>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
              <User size={16} style={{ color: 'var(--primary)' }} /> Choose Username
            </label>
            <input 
              type="text" 
              className="stayaira-input" 
              placeholder="e.g. wanderer_2026" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              pattern="^[a-zA-Z0-9_.-]+$"
              required 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} /> Email Address
            </label>
            <input 
              type="email" 
              className="stayaira-input" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
              <Lock size={16} style={{ color: 'var(--primary)' }} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="stayaira-input" 
                placeholder="Min. 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength="6"
                required 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary-stayaira" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.75rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary)' }}>Sign in here</Link>
        </p>

      </div>
    </div>
  );
}
