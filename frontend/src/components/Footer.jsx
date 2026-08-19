import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border-color)', marginTop: 'auto', padding: '3.5rem 0 1.5rem' }}>
      <div className="stayaira-container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Compass size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>StayAira</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Handpicked luxury villas, beachfront bungalows, mountain cabins, and memorable stays across the globe.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem' }}>Support & Safety</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/aircover">StayAira AirCover</Link></li>
              <li><Link to="/safety">Safety Information</Link></li>
              <li><Link to="/cancellation">Cancellation Options</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem' }}>Hosting on StayAira</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/listings/new">StayAira your home</Link></li>
              <li><Link to="/insurance">AirCover for Hosts</Link></li>
              <li><Link to="/resources">Hosting Resources</Link></li>
              <li><Link to="/community">Community Forum</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem' }}>Legal & Privacy</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/sitemap">Site Map</Link></li>
              <li><a href="mailto:support@stayaira.in">support@stayaira.in</a></li>
            </ul>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} StayAira, Inc. All rights reserved.
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
