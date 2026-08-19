import React from 'react';
import { ShieldCheck, FileText, HelpCircle, Lock, Award, Users } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="stayaira-container" style={{ maxWidth: '840px', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: August 2026</p>
      <div style={{ lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>Welcome to StayAira. By accessing or using our website, services, and mobile applications, you agree to comply with and be bound by these Terms of Service.</p>
        <h3>1. Acceptance of Terms</h3>
        <p>These terms govern your use of the StayAira accommodation platform. If you disagree with any part of these terms, please do not use our services.</p>
        <h3>2. Host Obligations</h3>
        <p>Hosts agree to provide accurate descriptions, high-quality living accommodations, and honor all confirmed guest reservations.</p>
        <h3>3. Payment & Security</h3>
        <p>All payments are securely handled through PCI-DSS compliant gateways with cryptographic signature verification.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="stayaira-container" style={{ maxWidth: '840px', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>DPDP Act 2023 Compliant · Last updated: August 2026</p>
      <div style={{ lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>At StayAira, your privacy is paramount. We believe in total transparency regarding how your personal information is processed.</p>
        <h3>1. Information We Collect</h3>
        <p>We collect account details (name, email), booking records, and property information necessary to provide accommodation services.</p>
        <h3>2. Zero Data Selling</h3>
        <p>StayAira will never sell, lease, or monetize your personal information to third-party advertising brokers.</p>
      </div>
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="stayaira-container" style={{ maxWidth: '840px', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>StayAira Help Center</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>24/7 Concierge Support</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <h4>How do I cancel my reservation?</h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>You can cancel free of charge up to 48 hours before check-in from your reservation details.</p>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <h4>How do I become a host?</h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Click "StayAira your home" in the header to list your property and start hosting.</p>
        </div>
      </div>
    </div>
  );
}

export function AirCoverPage() {
  return (
    <div className="stayaira-container" style={{ maxWidth: '840px', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E11D48' }}>air</span><span style={{ fontSize: '2.5rem', fontWeight: '900' }}>cover</span>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '1rem 0' }}>Comprehensive Booking Protection</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
        Included free with every single stay on StayAira. Includes booking guarantee, check-in guarantee, and 24/7 dedicated safety hotline.
      </p>
    </div>
  );
}
