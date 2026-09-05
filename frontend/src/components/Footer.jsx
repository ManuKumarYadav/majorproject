import React, { useState, useEffect, useCallback } from 'react';
import { Globe, X, HelpCircle, Shield, FileText, Map, Home, Heart, BookOpen, MessageSquare, Lock, Compass, Users, Sparkles, AlertTriangle, Accessibility, UserCheck, Award, Megaphone, Briefcase, TrendingUp } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const MODAL_CONTENT = {
  help: {
    icon: <HelpCircle size={28} />,
    badge: '24/7 Support',
    title: 'Help Centre',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    content: (
      <>
        <p>Welcome to the StayAira Help Centre. Our team is available around the clock to support guests and hosts.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🏠 Cancel Reservation</h4><p>Cancel free of charge up to 48 hours before check-in from your reservation details page.</p></div>
          <div className="modal-card"><h4>💳 Payments</h4><p>All payments are securely processed via PCI-DSS compliant gateways with end-to-end encryption.</p></div>
          <div className="modal-card"><h4>🌟 Become a Host</h4><p>Click "StayAira your home" in the header to list your property and start earning immediately.</p></div>
          <div className="modal-card"><h4>📞 Contact Support</h4><p>Email us at manukyadav703@gmail.com or call our 24/7 helpline.</p></div>
        </div>
      </>
    ),
  },
  safety: {
    icon: <Shield size={28} />,
    badge: 'Your wellbeing',
    title: 'Get help with a safety issue',
    gradient: 'linear-gradient(135deg,#0ea5e9,#22d3ee)',
    content: (
      <>
        <p>Your physical safety and peace of mind are our absolute priority on StayAira.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🚨 24/7 Safety Line</h4><p>Get immediate connection to our dedicated trust and safety team.</p></div>
          <div className="modal-card"><h4>🔒 Identity Verification</h4><p>All hosts and guests verify their identity with government-issued IDs.</p></div>
          <div className="modal-card"><h4>🏠 Secure Neighborhoods</h4><p>Verified neighborhood safety ratings and clear host property guidelines.</p></div>
          <div className="modal-card"><h4>📞 Emergency Services</h4><p>In life-threatening situations, always dial local emergency services (112) first.</p></div>
        </div>
      </>
    ),
  },
  aircover: {
    icon: <Shield size={28} />,
    badge: 'Every booking',
    title: 'StayAira Shield',
    gradient: 'linear-gradient(135deg,#E11D48,#f97316)',
    content: (
      <>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 900, color: '#E11D48' }}>Stay</span>
          <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Aira Shield</span>
        </div>
        <p>Included <strong>free</strong> with every stay on StayAira. Comprehensive protection for guests and hosts.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>✅ Booking Guarantee</h4><p>If a host cancels within 30 days of check-in, we'll find you a comparable or better home.</p></div>
          <div className="modal-card"><h4>🔑 Check-in Guarantee</h4><p>If you can't get into your home, we'll cover your stay elsewhere until resolved.</p></div>
          <div className="modal-card"><h4>🛡️ 24/7 Safety Hotline</h4><p>Dedicated safety line available around the clock in any emergency.</p></div>
          <div className="modal-card"><h4>🏡 Host Damage Protection</h4><p>Up to $3M protection for property damage caused by guests.</p></div>
        </div>
      </>
    ),
  },
  antidiscrimination: {
    icon: <Users size={28} />,
    badge: 'Belong anywhere',
    title: 'Anti-discrimination Policy',
    gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    content: (
      <>
        <p>StayAira is founded on the principle that anyone can belong anywhere. Discrimination has no place here.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🤝 Open Community</h4><p>We welcome guests of every race, religion, gender, sexual orientation, and ability.</p></div>
          <div className="modal-card"><h4>⚖️ Zero Tolerance</h4><p>Refusal to host or discriminatory conduct results in permanent account suspension.</p></div>
          <div className="modal-card"><h4>🛡️ Fair Housing</h4><p>All members adhere to strict local and international nondiscrimination standards.</p></div>
        </div>
      </>
    ),
  },
  disability: {
    icon: <Accessibility size={28} />,
    badge: 'Accessibility',
    title: 'Disability Support',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    content: (
      <>
        <p>We are dedicated to making travel effortless and inclusive for guests with disabilities.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>♿ Step-Free Access</h4><p>Filter listings specifically with verified step-free entries, wide doors, and accessible bathrooms.</p></div>
          <div className="modal-card"><h4>🐕 Service Animals</h4><p>Service animals are welcome without additional fees or pet restrictions across all listings.</p></div>
          <div className="modal-card"><h4>💬 Accessibility Support</h4><p>Our dedicated accessibility specialists help coordinate unique stay requirements.</p></div>
        </div>
      </>
    ),
  },
  cancellation: {
    icon: <FileText size={28} />,
    badge: 'Flexible options',
    title: 'Cancellation Options',
    gradient: 'linear-gradient(135deg,#f59e0b,#f97316)',
    content: (
      <>
        <p>StayAira offers a transparent range of cancellation policies so you can book with confidence.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🟢 Flexible</h4><p>Full refund if cancelled at least 24 hours before check-in.</p></div>
          <div className="modal-card"><h4>🟡 Moderate</h4><p>Full refund if cancelled 5 days before check-in.</p></div>
          <div className="modal-card"><h4>🔴 Strict</h4><p>50% refund if cancelled at least 7 days before check-in.</p></div>
          <div className="modal-card"><h4>🏢 Long-term Stays</h4><p>First 30 days non-refundable on stays of 28 nights or more.</p></div>
        </div>
      </>
    ),
  },
  neighbourhood: {
    icon: <AlertTriangle size={28} />,
    badge: 'Community',
    title: 'Report neighbourhood concern',
    gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)',
    content: (
      <>
        <p>Live next to a StayAira listing? We are here to ensure peace and harmony in your community.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🔇 Noise & Disturbance</h4><p>Report excessive noise, parties, or parking issues for immediate mediation.</p></div>
          <div className="modal-card"><h4>⚡ Rapid Response</h4><p>Our community response team contacts the host within minutes of notification.</p></div>
          <div className="modal-card"><h4>🏡 Host Responsibility</h4><p>Repeat offenders are removed to protect neighborhood wellbeing.</p></div>
        </div>
      </>
    ),
  },
  listings_new: {
    icon: <Home size={28} />,
    badge: 'Earn money',
    title: 'StayAira your home',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    content: (
      <>
        <p>Turn your space into a steady income stream. Join thousands of luxury hosts worldwide.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>💰 Prime Earnings</h4><p>Earn competitive rates for verified villas, apartments, and vacation escapes.</p></div>
          <div className="modal-card"><h4>🛡️ StayAira Shield Included</h4><p>$3M damage protection and $1M liability insurance with every stay.</p></div>
          <div className="modal-card"><h4>⚡ Intuitive Tools</h4><p>Manage calendar, bookings, and instant payouts from our dedicated Host Dashboard.</p></div>
        </div>
      </>
    ),
  },
  experience: {
    icon: <Sparkles size={28} />,
    badge: 'Curated adventures',
    title: 'StayAira your experience',
    gradient: 'linear-gradient(135deg,#f43f5e,#ec4899)',
    content: (
      <>
        <p>Host local cooking classes, guided wildlife excursions, yacht trips, or cultural workshops.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>✨ Share Your Passion</h4><p>Create unforgettable activities for travelers seeking authentic local experiences.</p></div>
          <div className="modal-card"><h4>🌐 Global Reach</h4><p>Market your experience to high-intent luxury travelers visiting your area.</p></div>
        </div>
      </>
    ),
  },
  service: {
    icon: <Briefcase size={28} />,
    badge: 'Partner network',
    title: 'StayAira your service',
    gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    content: (
      <>
        <p>Offer professional co-hosting, concierge, private chef, or housekeeping services.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🤝 Partner with Hosts</h4><p>Connect with property owners looking for top-tier management partners.</p></div>
          <div className="modal-card"><h4>📈 Grow Your Business</h4><p>Build long-term retainer client relationships in luxury hospitality.</p></div>
        </div>
      </>
    ),
  },
  insurance: {
    icon: <Heart size={28} />,
    badge: 'Free protection',
    title: 'Host Protection Guarantee',
    gradient: 'linear-gradient(135deg,#E11D48,#ec4899)',
    content: (
      <>
        <p>Comprehensive protection built exclusively for hosts — included free with every booking.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🏠 $3M Damage Protection</h4><p>Covers damage to your home, art, and valuables caused by guests.</p></div>
          <div className="modal-card"><h4>⚖️ $1M Liability Insurance</h4><p>Covers guest injuries or accidental damage to neighboring property.</p></div>
          <div className="modal-card"><h4>🐾 Pet Damage Protection</h4><p>Protects against unexpected pet stains, bites, and scratches.</p></div>
        </div>
      </>
    ),
  },
  resources: {
    icon: <BookOpen size={28} />,
    badge: 'Host education',
    title: 'Hosting resources',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    content: (
      <>
        <p>Everything you need to run a successful, 5-star hosting business.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📘 Superhost Masterclass</h4><p>Guides on styling, guest communication, and maintaining top ratings.</p></div>
          <div className="modal-card"><h4>📊 Pricing Insights</h4><p>Automate dynamic pricing based on local holidays and demand.</p></div>
        </div>
      </>
    ),
  },
  community: {
    icon: <MessageSquare size={28} />,
    badge: 'Connect',
    title: 'Community forum',
    gradient: 'linear-gradient(135deg,#f59e0b,#10b981)',
    content: (
      <>
        <p>Connect with fellow hosts, ask advice, share hospitality tips, and find inspiration.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>💬 Host Discussions</h4><p>Ask experienced hosts questions about guest management and amenities.</p></div>
          <div className="modal-card"><h4>🌟 Host Meetups</h4><p>Attend in-person and virtual networking events in your city.</p></div>
        </div>
      </>
    ),
  },
  responsibly: {
    icon: <Award size={28} />,
    badge: 'Standards',
    title: 'Hosting responsibly',
    gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
    content: (
      <>
        <p>Clear guidelines for compliance, local taxation, and neighborhood safety standards.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📜 Local Regulations</h4><p>Understanding permits, tax registration, and local zoning laws.</p></div>
          <div className="modal-card"><h4>🧯 Fire & Carbon Monoxide</h4><p>Essential smoke alarms, fire extinguishers, and first-aid protocols.</p></div>
        </div>
      </>
    ),
  },
  class: {
    icon: <BookOpen size={28} />,
    badge: 'Free workshop',
    title: 'Join a free hosting class',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    content: (
      <>
        <p>Join a live interactive webinar hosted by seasoned Superhosts.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🎓 Free 45-Min Session</h4><p>Learn photography, listing setup, pricing secrets, and guest vetting.</p></div>
          <div className="modal-card"><h4>🙋 Live Q&A</h4><p>Get personalized answers to your hosting questions.</p></div>
        </div>
      </>
    ),
  },
  cohost: {
    icon: <UserCheck size={28} />,
    badge: 'Hands-off hosting',
    title: 'Find a co-host',
    gradient: 'linear-gradient(135deg,#10b981,#3b82f6)',
    content: (
      <>
        <p>Partner with an experienced Superhost in your neighborhood to manage your listing.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🤝 Full-Service Management</h4><p>Co-hosts handle check-ins, cleaning, messages, and key exchanges.</p></div>
          <div className="modal-card"><h4>💼 Split Payouts</h4><p>Automate custom percentage revenue splits directly through StayAira.</p></div>
        </div>
      </>
    ),
  },
  refer: {
    icon: <Sparkles size={28} />,
    badge: 'Rewards',
    title: 'Refer a host',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    content: (
      <>
        <p>Invite friends to host on StayAira and earn referral bonuses on their first completed booking.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🎁 ₹5,000 Bonus</h4><p>Earn cash credit directly to your bank account for every successful host referral.</p></div>
          <div className="modal-card"><h4>💌 Dedicated Link</h4><p>Share your personal invite link via WhatsApp, email, or social media.</p></div>
        </div>
      </>
    ),
  },
  release: {
    icon: <Megaphone size={28} />,
    badge: 'New features',
    title: '2026 Summer Release',
    gradient: 'linear-gradient(135deg,#E11D48,#f97316)',
    content: (
      <>
        <p>Discover over 50 brand-new upgrades designed to elevate every journey and hosting experience.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🗺️ Live Interactive Map</h4><p>Real-time neighborhood insights, attractions, and transit distance calculators.</p></div>
          <div className="modal-card"><h4>📱 Smart Keyless Entry</h4><p>Unlock doors directly via your smartphone without meeting for keys.</p></div>
          <div className="modal-card"><h4>💎 StayAira Icons</h4><p>Extraordinary stays hosted by the world's most creative minds.</p></div>
        </div>
      </>
    ),
  },
  newsroom: {
    icon: <FileText size={28} />,
    badge: 'Press & Media',
    title: 'Newsroom',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    content: (
      <>
        <p>Official company announcements, media releases, product launches, and hospitality trends.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📰 Press Releases</h4><p>Stay informed on our latest partnerships, funding, and platform metrics.</p></div>
          <div className="modal-card"><h4>📸 Media Kit</h4><p>Official high-resolution brand assets, logos, and executive bios.</p></div>
        </div>
      </>
    ),
  },
  careers: {
    icon: <Briefcase size={28} />,
    badge: 'Join our team',
    title: 'Careers',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    content: (
      <>
        <p>Help us redefine global luxury travel and community-first hospitality.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🚀 Open Positions</h4><p>Engineering, Product Design, Growth Marketing, and Customer Experience roles.</p></div>
          <div className="modal-card"><h4>🌍 Remote-First</h4><p>Work from anywhere in the world with competitive equity, stipends, and travel credits.</p></div>
        </div>
      </>
    ),
  },
  investors: {
    icon: <TrendingUp size={28} />,
    badge: 'Financials',
    title: 'Investors',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    content: (
      <>
        <p>Financial reports, quarterly earnings, governance filings, and investor updates.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📈 Financial Reports</h4><p>Access our annual reports, SEC filings, and quarterly earnings presentations.</p></div>
          <div className="modal-card"><h4>🌱 ESG Commitments</h4><p>Our environmental and community impact initiatives worldwide.</p></div>
        </div>
      </>
    ),
  },
  emergency: {
    icon: <Heart size={28} />,
    badge: 'Philanthropy',
    title: 'StayAira.org emergency stays',
    gradient: 'linear-gradient(135deg,#E11D48,#be123c)',
    content: (
      <>
        <p>Providing free, temporary housing to people displaced by humanitarian crises and natural disasters.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🏡 Disaster Relief</h4><p>Partnering with nonprofits to provide urgent refuge during wildfires, floods, and earthquakes.</p></div>
          <div className="modal-card"><h4>🤝 Host Volunteers</h4><p>Over 100,000 hosts offering free temporary rooms to relief workers and evacuees.</p></div>
        </div>
      </>
    ),
  },
  privacy: {
    icon: <Lock size={28} />,
    badge: 'DPDP Act Compliant',
    title: 'Privacy Policy',
    gradient: 'linear-gradient(135deg,#6366f1,#0ea5e9)',
    content: (
      <>
        <p>Your privacy is paramount. We believe in total transparency regarding how your data is handled.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📋 Information We Collect</h4><p>Account details, booking records, and property data necessary to provide accommodation services.</p></div>
          <div className="modal-card"><h4>🚫 Zero Data Selling</h4><p>StayAira never sells, leases, or monetizes personal information to third parties.</p></div>
          <div className="modal-card"><h4>🔐 Data Security</h4><p>Your data is encrypted at rest and in transit using AES-256 and TLS 1.3 standards.</p></div>
        </div>
      </>
    ),
  },
  terms: {
    icon: <FileText size={28} />,
    badge: 'Updated 2026',
    title: 'Terms of Service',
    gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
    content: (
      <>
        <p>By accessing or using StayAira, you agree to comply with these Terms of Service.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>📜 Acceptance of Terms</h4><p>These terms govern your use of the StayAira platform. Continued use constitutes acceptance.</p></div>
          <div className="modal-card"><h4>🏠 Host & Guest Commitments</h4><p>Accurate listings, respectful communication, and honoring confirmed bookings.</p></div>
          <div className="modal-card"><h4>💳 Payment Security</h4><p>Payments are handled exclusively through PCI-DSS verified cryptographic channels.</p></div>
        </div>
      </>
    ),
  },
  company: {
    icon: <Compass size={28} />,
    badge: 'Legal Entity',
    title: 'Company details',
    gradient: 'linear-gradient(135deg,#E11D48,#7C3AED)',
    content: (
      <>
        <p>Legal corporate details for StayAira Inc. operations.</p>
        <div className="modal-cards">
          <div className="modal-card"><h4>🏢 Corporate Identity</h4><p>StayAira Inc. / StayAira Hospitality Pvt. Ltd.<br />CIN: U72900DL2024PTC123456</p></div>
          <div className="modal-card"><h4>📍 Registered Office</h4><p>DLF Cyber City, Tower B, Phase III, Gurugram, Haryana 122002, India</p></div>
          <div className="modal-card"><h4>📧 Contact</h4><p>Email: manukyadav703@gmail.com<br />Phone: +91 7352966256</p></div>
        </div>
      </>
    ),
  },
};

function FooterModal({ modalKey, onClose }) {
  const data = MODAL_CONTENT[modalKey];
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  if (!data) return null;
  return (
    <div className="footer-modal-overlay" onClick={onClose}>
      <div className="footer-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="footer-modal-header" style={{ background: data.gradient }}>
          <div className="footer-modal-header-icon">{data.icon}</div>
          <div>
            <div className="footer-modal-badge">{data.badge}</div>
            <h2 className="footer-modal-title">{data.title}</h2>
          </div>
          <button className="footer-modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="footer-modal-body">{data.content}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const open = useCallback((key) => setActiveModal(key), []);
  const close = useCallback(() => setActiveModal(null), []);

  const FooterLink = ({ id, label }) => (
    <li>
      <button
        onClick={() => open(id)}
        className="airbnb-footer-link"
      >
        {label}
      </button>
    </li>
  );

  return (
    <>
      <style>{`
        .airbnb-footer {
          background: #F7F7F7;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
          color: var(--text-main);
          font-family: inherit;
        }
        [data-theme="dark"] .airbnb-footer {
          background: #111827;
          border-color: #1F2937;
        }

        .airbnb-footer-inner {
          padding: 3rem 0 1.5rem;
        }

        .airbnb-footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .airbnb-footer-col h3 {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 1rem;
        }

        .airbnb-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .airbnb-footer-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--text-main);
          font-size: 0.88rem;
          font-weight: 400;
          text-align: left;
          font-family: inherit;
          transition: text-decoration 0.15s;
        }
        .airbnb-footer-link:hover {
          text-decoration: underline;
        }

        .airbnb-footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          padding-bottom: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .airbnb-footer-bottom-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .airbnb-footer-dot {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .airbnb-footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .airbnb-footer-locale {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .airbnb-footer-locale:hover {
          text-decoration: underline;
        }

        .airbnb-footer-currency {
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .airbnb-footer-currency:hover {
          text-decoration: underline;
        }

        .airbnb-footer-socials {
          display: flex;
          align-items: center;
          gap: 1.1rem;
        }

        .airbnb-footer-social-icon {
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s;
          text-decoration: none;
        }
        .airbnb-footer-social-icon:hover {
          opacity: 0.7;
        }

        @media (max-width: 820px) {
          .airbnb-footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 2rem;
            margin-bottom: 1.5rem;
          }
          .airbnb-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            border-top: none;
            padding-top: 0;
            gap: 1.25rem;
          }
          .airbnb-footer-bottom-right {
            width: 100%;
            justify-content: space-between;
          }
        }

        .footer-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fmo-in 0.2s ease;
        }
        @keyframes fmo-in { from { opacity:0 } to { opacity:1 } }
        .footer-modal-box {
          background: var(--card-bg, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 24px;
          width: 100%; max-width: 600px;
          max-height: 88vh; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px rgba(0,0,0,0.45);
          animation: fmb-in 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        [data-theme="dark"] .footer-modal-box {
          background: #151C2C;
          border-color: #27354A;
        }
        @keyframes fmb-in { from { opacity:0; transform:scale(0.88) translateY(24px) } to { opacity:1; transform:scale(1) translateY(0) } }
        .footer-modal-header {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.4rem 1.6rem; color: #fff; flex-shrink: 0;
        }
        .footer-modal-header-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(255,255,255,0.2); display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .footer-modal-badge {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; opacity: 0.85; margin-bottom: 4px;
        }
        .footer-modal-title { font-size: 1.35rem; font-weight: 800; margin: 0; color: #fff; }
        .footer-modal-close {
          margin-left: auto; background: rgba(255,255,255,0.2); border: none;
          border-radius: 50%; width: 36px; height: 36px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff; transition: background 0.2s; flex-shrink: 0;
        }
        .footer-modal-close:hover { background: rgba(255,255,255,0.35); }
        .footer-modal-body {
          padding: 1.6rem; overflow-y: auto;
          font-size: 0.95rem; line-height: 1.7;
          color: var(--text-main, #0F172A);
          display: flex; flex-direction: column; gap: 1rem;
        }
        [data-theme="dark"] .footer-modal-body { color: #F1F5F9; }
        .modal-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;
        }
        .modal-card {
          background: var(--bg-secondary, #F8FAFC);
          border: 1.5px solid var(--border-color, #E2E8F0);
          border-radius: 16px; padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .modal-card h4 {
          font-size: 0.88rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main);
        }
        .modal-card p {
          font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.5;
        }
        [data-theme="dark"] .modal-card {
          background: #1E293B !important;
          border: 1.5px solid #2D3D54 !important;
        }
        [data-theme="dark"] .modal-card h4 { color: #FFFFFF !important; }
        [data-theme="dark"] .modal-card p { color: #CBD5E1 !important; }
        @media (max-width: 480px) { .modal-cards { grid-template-columns: 1fr; } }
      `}</style>

      <footer className="airbnb-footer">
        <div className="stayaira-container">
          <div className="airbnb-footer-inner">

            <div className="airbnb-footer-grid">
              <div className="airbnb-footer-col">
                <h3>Support</h3>
                <ul className="airbnb-footer-list">
                  <FooterLink id="help" label="Help Centre" />
                  <FooterLink id="safety" label="Get help with a safety issue" />
                  <FooterLink id="aircover" label="StayAira Shield" />
                  <FooterLink id="antidiscrimination" label="Anti-discrimination" />
                  <FooterLink id="disability" label="Disability support" />
                  <FooterLink id="cancellation" label="Cancellation options" />
                  <FooterLink id="neighbourhood" label="Report neighbourhood concern" />
                </ul>
              </div>

              <div className="airbnb-footer-col">
                <h3>Hosting</h3>
                <ul className="airbnb-footer-list">
                  <FooterLink id="listings_new" label="StayAira your home" />
                  <FooterLink id="experience" label="StayAira your experience" />
                  <FooterLink id="service" label="StayAira your service" />
                  <FooterLink id="insurance" label="Host Protection Guarantee" />
                  <FooterLink id="resources" label="Hosting resources" />
                  <FooterLink id="community" label="Community forum" />
                  <FooterLink id="responsibly" label="Hosting responsibly" />
                  <FooterLink id="class" label="Join a free hosting class" />
                  <FooterLink id="cohost" label="Find a co-host" />
                  <FooterLink id="refer" label="Refer a host" />
                </ul>
              </div>

              <div className="airbnb-footer-col">
                <h3>StayAira</h3>
                <ul className="airbnb-footer-list">
                  <FooterLink id="release" label="2026 Summer Release" />
                  <FooterLink id="newsroom" label="Newsroom" />
                  <FooterLink id="careers" label="Careers" />
                  <FooterLink id="investors" label="Investors" />
                  <FooterLink id="emergency" label="StayAira.org emergency stays" />
                </ul>
              </div>
            </div>

            <div className="airbnb-footer-bottom">
              <div className="airbnb-footer-bottom-left">
                <span>© 2026 StayAira, Inc.</span>
                <span className="airbnb-footer-dot">·</span>
                <button onClick={() => open('privacy')} className="airbnb-footer-link">Privacy</button>
                <span className="airbnb-footer-dot">·</span>
                <button onClick={() => open('terms')} className="airbnb-footer-link">Terms</button>
                <span className="airbnb-footer-dot">·</span>
                <button onClick={() => open('company')} className="airbnb-footer-link">Company details</button>
              </div>

              <div className="airbnb-footer-bottom-right">
                <span className="airbnb-footer-locale" onClick={() => open('help')}>
                  <Globe size={16} />
                  <span>English (IN)</span>
                </span>
                <span className="airbnb-footer-currency" onClick={() => open('help')}>
                  ₹ INR
                </span>

                <div className="airbnb-footer-socials">
                  <a href="https://www.facebook.com/profile.php?id=61564811584644" target="_blank" rel="noopener noreferrer" className="airbnb-footer-social-icon" aria-label="Facebook" title="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="airbnb-footer-social-icon" aria-label="X">
                    <XIcon />
                  </a>
                  <a href="https://www.instagram.com/stayaira_official" target="_blank" rel="noopener noreferrer" className="airbnb-footer-social-icon" aria-label="Instagram (@stayaira_official)" title="Instagram (@stayaira_official)">
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {activeModal && <FooterModal modalKey={activeModal} onClose={close} />}
    </>
  );
}
