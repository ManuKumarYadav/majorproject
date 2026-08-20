import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Compass, Search, Moon, Sun, User, LogIn, UserPlus, PlusCircle, LayoutDashboard, LogOut, Menu, X, Home, Plane, Settings, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [switchHover, setSwitchHover] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user is currently on host-related pages
  const isHostView = location.pathname.startsWith('/host');

  const handleSwitchMode = () => {
    if (isHostView) {
      navigate('/');
    } else {
      navigate(user ? '/host/dashboard' : '/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    navigate('/?search=' + encodeURIComponent(searchQuery));
    setSearchModalOpen(false);
  };

  return (
    <>
      <header className="glass-effect main-header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Mobile Top Search Bar (Airbnb Style) */}
        <div className="mobile-top-search-bar" onClick={() => setSearchModalOpen(true)}>
          <div className="mobile-search-pill-inner">
            <Search size={18} color="var(--primary)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Start your search</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Anywhere · Any week · Add guests</p>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-bg)' }}>
              <SlidersHorizontal size={14} color="var(--text-main)" />
            </div>
          </div>
        </div>

        <div className="stayaira-container desktop-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 4px 14px rgba(225,29,72,0.3)', flexShrink: 0
            }}>
              <Compass size={24} />
            </div>
            <div>
              <span className="navbar-brand-title" style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--primary)' }}>
                StayAira
              </span>
              <span className="navbar-tagline" style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Vista Stays. Better Days.
              </span>
            </div>
          </Link>

          <div
            className="navbar-search-pill"
            onClick={() => setSearchModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.5rem 0.75rem 0.5rem 1.4rem',
              background: 'var(--card-bg)', border: '1.5px solid var(--border-color)',
              borderRadius: '9999px', boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <span className="navbar-search-text" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Anywhere</span>
            <span className="navbar-search-divider" style={{ height: '16px', width: '1px', background: 'var(--border-color)' }}></span>
            <span className="navbar-search-text" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Any week</span>
            <span className="navbar-search-divider" style={{ height: '16px', width: '1px', background: 'var(--border-color)' }}></span>
            <span className="navbar-search-text" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add guests</span>
            <span className="navbar-search-mobile-label">Where to?</span>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', flexShrink: 0
            }}>
              <Search size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Switch to hosting / Switch to travelling toggle */}
            <button
              id="mode-switch-btn"
              className="navbar-mode-btn"
              onClick={handleSwitchMode}
              onMouseEnter={() => setSwitchHover(true)}
              onMouseLeave={() => setSwitchHover(false)}
              title={isHostView ? 'Switch to travelling mode' : 'Switch to hosting mode'}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1.1rem',
                background: isHostView
                  ? (switchHover ? '#c0112e' : '#E11D48')
                  : (switchHover ? 'var(--card-bg)' : 'transparent'),
                border: isHostView ? 'none' : '1.5px solid var(--border-color)',
                borderRadius: '9999px',
                color: isHostView ? '#FFFFFF' : 'var(--text-main)',
                fontSize: '0.88rem', fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isHostView
                  ? (switchHover ? '0 4px 18px rgba(225,29,72,0.45)' : '0 2px 10px rgba(225,29,72,0.28)')
                  : (switchHover ? 'var(--shadow-sm)' : 'none'),
                transform: switchHover ? 'scale(1.03)' : 'scale(1)',
                whiteSpace: 'nowrap',
              }}
            >
              {isHostView ? (
                <>
                  <Plane size={15} style={{ transition: 'transform 0.3s ease', transform: switchHover ? 'translateX(2px) rotate(-8deg)' : 'none' }} />
                  Switch to travelling
                </>
              ) : (
                <>
                  <Home size={15} style={{ transition: 'transform 0.3s ease', transform: switchHover ? 'translateY(-2px)' : 'none' }} />
                  Switch to hosting
                </>
              )}
            </button>

            <button
              onClick={toggleTheme}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.6rem 0.4rem 0.8rem',
                  background: 'var(--card-bg)', border: '1.5px solid var(--border-color)',
                  borderRadius: '9999px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', flexShrink: 0
                }}
              >
                <Menu size={18} />
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: user?.avatar?.url ? 'transparent' : 'linear-gradient(135deg,#E11D48,#f43f5e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF', fontWeight: '700', fontSize: '0.85rem',
                  overflow: 'hidden', flexShrink: 0
                }}>
                  {user?.avatar?.url
                    ? <img src={user.avatar.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : user
                      ? user.username.slice(0, 1).toUpperCase()
                      : <User size={16} />
                  }
                </div>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: '50px', width: '280px',
                    background: 'var(--card-bg)', borderRadius: '16px',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem 0', zIndex: 100, overflow: 'hidden'
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={handleSwitchMode}
                    className="mobile-only-dropdown-item"
                    style={{
                      alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1.25rem',
                      fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)',
                      borderBottom: '1px solid var(--border-color)', width: '100%',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    {isHostView ? <Plane size={16} /> : <Home size={16} />}
                    {isHostView ? 'Switch to Travelling' : 'Switch to Hosting'}
                  </button>

                  {user ? (
                    <>
                      {/* Profile header with avatar */}
                      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#E11D48,#f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>
                          {user.avatar?.url
                            ? <img src={user.avatar.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : user.username.slice(0, 1).toUpperCase()
                          }
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName || user.username}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile/edit" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <Settings size={16} /> Edit Profile
                      </Link>
                      <Link to="/host/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <LayoutDashboard size={16} /> Host Dashboard
                      </Link>
                      <Link to="/listings/new" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <PlusCircle size={16} /> List a Villa
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }}></div>
                      <button
                        onClick={logout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem',
                          fontSize: '0.9rem', fontWeight: '600', color: '#E11D48', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: '700' }}>
                        <LogIn size={16} /> Sign In
                      </Link>
                      <Link to="/signup" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary)' }}>
                        <UserPlus size={16} /> Create Account
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }}></div>
                      <Link to="/help" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Help Center
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {searchModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px',
          zIndex: 999
        }}>
          <div style={{
            width: '100%', maxWidth: '640px', background: 'var(--card-bg)', borderRadius: '24px',
            padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Search StayAira Accommodations</h3>
              <button onClick={() => setSearchModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  className="stayaira-input"
                  placeholder="Where to? (e.g. Goa, Manali, Jaipur, Maldives...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{ paddingLeft: '3rem', fontSize: '1.05rem', height: '56px' }}
                />
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--text-muted)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSearchModalOpen(false)} className="btn-outline-stayaira">Cancel</button>
                <button type="submit" className="btn-primary-stayaira"><Search size={18} /> Search Stays</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
