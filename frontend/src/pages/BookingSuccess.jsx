import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Compass, Calendar, MapPin, Download } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #34D399)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={36} />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Verified & Confirmed</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '6px 0 1rem' }}>Reservation Successful!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Thank you for choosing StayAira. Your booking confirmation and receipt have been registered with the host.
        </p>

        {booking && (
          <div style={{ background: 'var(--light-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <h4 style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '0.75rem' }}>{booking.listing?.title || 'Luxury Accommodation'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Reservation ID: <strong>{booking._id}</strong></p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Dates: <strong>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</strong></p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount Paid: <strong>₹{booking.totalAmount?.toLocaleString('en-IN')}</strong></p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary-stayaira">Explore More Stays</Link>
          <button onClick={() => window.print()} className="btn-outline-stayaira"><Download size={16} /> Print Receipt</button>
        </div>

      </div>
    </div>
  );
}
