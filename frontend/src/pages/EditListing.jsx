import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditListing() {
  const { id } = useParams();
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

  useEffect(() => {
    axios.get('/api/listings/' + id).then(res => {
      if (res.data.success) {
        const l = res.data.listing;
        setFormData({
          title: l.title || '',
          description: l.description || '',
          price: l.price || '',
          location: l.location || '',
          country: l.country || '',
          category: l.category || 'Luxury Villas'
        });
      }
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const res = await axios.put('/api/listings/' + id, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate('/listings/' + id);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stayaira-container" style={{ maxWidth: '780px', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>Edit Listing</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Title</label>
            <input type="text" name="title" className="stayaira-input" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Description</label>
            <textarea name="description" rows="4" className="stayaira-input" value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Replace Image (optional)</label>
            <input type="file" accept="image/*" className="stayaira-input" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Price / Night (₹)</label>
              <input type="number" name="price" className="stayaira-input" value={formData.price} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Location</label>
              <input type="text" name="location" className="stayaira-input" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Country</label>
              <input type="text" name="country" className="stayaira-input" value={formData.country} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary-stayaira" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem', marginTop: '1rem' }}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
