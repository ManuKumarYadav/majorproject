import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Globe, Heart, Mail, Phone, Camera, AtSign, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border-color)', marginTop: 'auto', padding: '3.5rem 0 1.5rem' }}>
      <div className="stayaira-container">
        
        {/* Top grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Compass size={20} />
              </div>
              <div>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary)' }}>StayAira</span>
                <p style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-muted)', lineHeight: 1, margin: 0 }}>VISTA STAYS. BETTER DAYS.</p>
              </div>
            </div>
            <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              Handpicked luxury villas, beachfront bungalows, mountain cabins, and memorable stays across the globe.
            </p>
            {/* Contact Email */}
            <a href="mailto:manukyadav703@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.87rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', marginBottom: '1rem' }}>
              <Mail size={15} />
              manukyadav703@gmail.com
            </a>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <a href="#" aria-label="Instagram" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s ease' }}>
                <Camera size={16} />
              </a>
              <a href="#" aria-label="Twitter" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s ease' }}>
                <AtSign size={16} />
              </a>
              <a href="#" aria-label="Community" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s ease' }}>
                <Users size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Support & Safety</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/help" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Help Center</Link></li>
              <li><Link to="/aircover" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>StayAira AirCover</Link></li>
              <li><Link to="/safety" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Safety Information</Link></li>
              <li><Link to="/cancellation" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Cancellation Options</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Hosting on StayAira</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/listings/new" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>StayAira your home</Link></li>
              <li><Link to="/insurance" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>AirCover for Hosts</Link></li>
              <li><Link to="/resources" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Hosting Resources</Link></li>
              <li><Link to="/community" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Community Forum</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Legal & Privacy</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link></li>
              <li><Link to="/sitemap" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Site Map</Link></li>
              <li>
                <a href="mailto:manukyadav703@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> manukyadav703@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', fontSize: '0.83rem', color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <span>© {new Date().getFullYear()} StayAira, Inc. All rights reserved.</span>
            <span>·</span>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
            <span>·</span>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            <span>·</span>
            <Link to="/sitemap" style={{ color: 'inherit', textDecoration: 'none' }}>Sitemap</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={14} /> English (IN)</span>
            <span style={{ fontWeight: '700' }}>₹ INR</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
