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
    <div className="form-container" style={{ backgroundColor: '#FFFBF0', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '1px', backgroundColor: '#E4B753' }}></div>
        <div style={{ width: '12px', height: '12px', backgroundColor: '#E4B753', borderRadius: '50%' }}></div>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#1F3D3F', fontWeight: 'bold' }}>Book a Session</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '20px' }}>
        <h2 style={{ fontSize: '2.8rem', color: '#000', margin: 0, fontFamily: "'Marcellus', serif", whiteSpace: 'nowrap' }}>Request A Call</h2>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                border: '2px solid #fff', 
                overflow: 'hidden', 
                marginLeft: i > 1 ? '-12px' : '0',
                backgroundColor: '#ddd'
              }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png" alt="Patients" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1F3D3F', whiteSpace: 'nowrap' }}>225+ Satisfied Patients</div>
            <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
              {[1,2,3,4,5].map(star => <img key={star} src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png" alt="star" style={{ width: '12px', height: '12px' }} />)}
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
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px' }}
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
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px' }}
              required 
            />
          </div>
        </div>

        <div className="form-row" style={{ alignItems: 'stretch' }}>
          <div className="form-group" style={{ flex: '0 0 100px', marginBottom: '0' }}>
            <div className="form-input" style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', padding: 0 }}>
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
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: '50px', borderRadius: '12px' }}
              required 
            />
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '50px', padding: '16px' }} disabled={loading}>
            <span>{loading ? 'Submitting...' : 'Submit'}</span>
            <div className="icon-circle" style={{ marginLeft: '12px', backgroundColor: '#000' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" style={{ width: '12px', height: '12px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
