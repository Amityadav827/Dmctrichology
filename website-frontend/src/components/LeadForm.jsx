"use client";
import { useState } from 'react';
import { submitLead } from '../services/api';
import { ArrowUpRight } from 'lucide-react';

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
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#000', margin: 0 }}>Request A Call</h2>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', position: 'relative', width: '80px', height: '30px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e2e8f0', position: 'absolute', left: 0, border: '2px solid white' }}></div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#cbd5e1', position: 'absolute', left: '15px', border: '2px solid white' }}></div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#94a3b8', position: 'absolute', left: '30px', border: '2px solid white' }}></div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#64748b', position: 'absolute', left: '45px', border: '2px solid white' }}></div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333' }}>225+ Satisfied Patients</div>
            <div style={{ color: '#E4B753', fontSize: '10px' }}>★★★★★</div>
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
              <ArrowUpRight />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
