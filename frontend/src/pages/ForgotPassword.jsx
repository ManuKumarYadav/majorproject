import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Key, Lock, CheckCircle2, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/check-email', { email });
      if (res.data.valid) {
        setStep(2);
      } else {
        setError(res.data.message || 'No account found with that email.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password-direct', {
        email,
        password,
        confirmPassword
      });
      if (res.data.success) {
        setStep(3);
      } else {
        setError(res.data.message || 'Failed to update password.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Header */}
        <div style={{ background: 'var(--primary-gradient)', padding: '2rem', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', backdropFilter: 'blur(8px)' }}>
            {step === 1 ? <Key size={26} /> : step === 2 ? <Lock size={26} /> : <CheckCircle2 size={26} />}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Set New Password' : 'Password Updated!'}
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
            {step === 1 ? 'Enter your registered email to continue' : step === 2 ? 'Create a new secure password' : 'You can now sign in with your new credentials'}
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="stayaira-input" 
                  placeholder="Enter your registered email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary-stayaira" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Verifying...' : <>Continue <ArrowRight size={16} /></>}
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ background: 'rgba(225,29,72,0.08)', padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.85rem', color: '#E11D48', fontWeight: '600' }}>
                Resetting for: {email}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>New Password</label>
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  className="stayaira-input" 
                  placeholder="Re-enter new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary-stayaira" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Your StayAira password has been updated securely.
              </p>
              <Link to="/login" className="btn-primary-stayaira" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                Sign In Now
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
