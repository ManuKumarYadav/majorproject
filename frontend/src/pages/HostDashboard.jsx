import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Home, Users, DollarSign, Star, Trash2, Edit } from 'lucide-react';

export default function HostDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/host/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Host dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await axios.delete('/api/listings/' + id);
      fetchDashboard();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return <div className="stayaira-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading Host Dashboard...</div>;
  }

  const stats = data?.stats || { totalListings: 0, totalEarnings: 0, totalBookings: 0, averageRating: '5.0' };
  const listings = data?.listings || [];
  const bookings = data?.bookings || [];

  return (
    <div className="stayaira-container" style={{ padding: '3rem 1.5rem 5rem' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Host Command Center</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '4px 0' }}>Welcome back, {user?.fullName || user?.username}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monitor performance, track reservations, and manage your luxury portfolio.</p>
        </div>
        <Link to="/listings/new" className="btn-primary-stayaira">
          <PlusCircle size={18} /> Add New Villa
        </Link>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Total Earnings</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={18} /></div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>₹{stats.totalEarnings.toLocaleString('en-IN')}</h2>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Active Accommodations</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={18} /></div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{stats.totalListings}</h2>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Total Reservations</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={18} /></div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{stats.totalBookings}</h2>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Average Rating</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={18} /></div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{stats.averageRating} ★</h2>
        </div>

      </div>

      {/* Listings Table */}
      <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Your Accommodations ({listings.length})</h3>
        
        {listings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>You haven't listed any properties yet. Click "Add New Villa" to start hosting!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {listings.map(l => (
              <div key={l._id} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={l.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'} alt={l.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{l.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{l.location}, {l.country} · ₹{l.price?.toLocaleString('en-IN')}/night</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Link to={'/listings/' + l._id} className="btn-outline-stayaira" style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', fontSize: '0.8rem' }}>View</Link>
                    <Link to={'/listings/' + l._id + '/edit'} className="btn-outline-stayaira" style={{ padding: '0.4rem 0.75rem' }}><Edit size={14} /></Link>
                    <button onClick={() => handleDeleteListing(l._id)} className="btn-outline-stayaira" style={{ padding: '0.4rem 0.75rem', color: '#EF4444', borderColor: '#EF4444' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
