import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Upload, MapPin, DollarSign, Tag } from 'lucide-react';

export default function NewListing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    category: 'Luxury Villas'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('listing[title]', formData.title);
      data.append('listing[description]', formData.description);
      data.append('listing[price]', formData.price);
      data.append('listing[location]', formData.location);
      data.append('listing[country]', formData.country);
      data.append('listing[category]', formData.category);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await axios.post('/api/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate('/listings/' + res.data.listing._id);
      }
    } catch (err) {
      console.error('Create listing error:', err);
      alert('Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stayaira-container" style={{ maxWidth: '780px', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>StayAira Host Academy</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '4px 0 8px' }}>List your place on StayAira</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join thousands of luxury hosts sharing unique villas and earning global travelers.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Listing Title</label>
            <input 
              type="text" 
              name="title" 
              className="stayaira-input" 
              placeholder="e.g. Whispering Palms Oceanfront Villa" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Category</label>
            <select name="category" className="stayaira-input" value={formData.category} onChange={handleChange}>
              <option value="Luxury Villas">Luxury Villas</option>
              <option value="Beachfront">Beachfront</option>
              <option value="Mountains">Mountains</option>
              <option value="Amazing Pools">Amazing Pools</option>
              <option value="Iconic Cities">Iconic Cities</option>
              <option value="Castles">Castles</option>
              <option value="Camping">Camping</option>
              <option value="Countryside">Countryside</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Description</label>
            <textarea 
              name="description" 
              rows="4" 
              className="stayaira-input" 
              placeholder="Describe what makes your space extraordinary..." 
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Upload Cover Photograph</label>
            <input 
              type="file" 
              accept="image/*" 
              className="stayaira-input" 
              onChange={(e) => setImageFile(e.target.files[0])} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Price / Night (₹)</label>
              <input 
                type="number" 
                name="price" 
                className="stayaira-input" 
                placeholder="4500" 
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>City / Location</label>
              <input 
                type="text" 
                name="location" 
                className="stayaira-input" 
                placeholder="Candolim, Goa" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Country</label>
              <input 
                type="text" 
                name="country" 
                className="stayaira-input" 
                placeholder="India" 
                value={formData.country} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary-stayaira" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem', marginTop: '1rem' }}
          >
            {loading ? 'Publishing to StayAira...' : 'Publish Listing'}
          </button>

        </form>

      </div>
    </div>
  );
}
