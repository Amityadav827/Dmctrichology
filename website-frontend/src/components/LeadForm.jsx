"use client";
import { useState } from 'react';
import { submitLead } from '../services/api';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitLead(formData);
      setSuccess(true);
      setFormData({ name: '', mobile: '', code: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#E4B753' }}></div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Book a Session</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#000', margin: 0, fontFamily: "'Marcellus', serif" }}>Request A Call</h2>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="http://dmctrichology-1.onrender.com/uploads/gallery/225-satisfed-patients-1777457400392.png" alt="Patients" style={{ height: '30px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333' }}>225+ Satisfied Patients</div>
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
              {[1,2,3,4,5].map(star => <img key={star} src="http://dmctrichology-1.onrender.com/uploads/gallery/star-1777457400392.png" alt="star" style={{ width: '10px', height: '10px' }} />)}
            </div>
          </div>
        </div>
      </div>

      {success && <div style={{ color: 'green', marginBottom: '16px', fontSize: '14px' }}>Request sent successfully!</div>}
      {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              placeholder="YOUR NAME" 
              className="form-input" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              name="mobile" 
              placeholder="MOBILE NUMBER *" 
              className="form-input" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-row" style={{ alignItems: 'stretch' }}>
          <div className="form-group" style={{ flex: '0 0 80px', marginBottom: '0' }}>
            <div className="form-input" style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 0, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
              6534
            </div>
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
            <input 
              type="text" 
              name="code" 
              placeholder="ENTER CODE" 
              className="form-input" 
              value={formData.code} 
              onChange={handleChange} 
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: '100%' }}
              required 
            />
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
            <div className="icon-circle" style={{ marginLeft: '8px' }}>
              <img src="http://dmctrichology-1.onrender.com/uploads/gallery/book-appointment-arrow-1777456775616.png" alt="arrow" style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
