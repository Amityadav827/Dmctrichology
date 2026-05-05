"use client";
import { useState, useEffect } from 'react';
import { submitLead } from '../services/api';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    code: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Function to generate random 4-digit number
  const generateCaptcha = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(num);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validate Captcha
    if (formData.code !== captcha) {
      setError('Invalid captcha. Please enter the correct code.');
      return;
    }

    setLoading(true);
    try {
      await submitLead(formData);
      setSuccess(true);
      setFormData({ name: '', mobile: '', code: '' });
      // 2. Regenerate captcha after success
      generateCaptcha();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ backgroundColor: '#FFFBF0', borderRadius: '24px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', height: '30px' }}>
        <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#1F3D3F', fontWeight: 'bold' }}>Book a Session</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '15px', height: '50px' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#000', margin: 0, fontFamily: "'Marcellus', serif", whiteSpace: 'nowrap' }}>Request A Call</h2>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', height: '30px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                border: '2px solid #fff', 
                overflow: 'hidden', 
                marginLeft: i > 1 ? '-10px' : '0',
                backgroundColor: '#ddd'
              }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png" alt="Patients" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'left', minWidth: '110px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1F3D3F', whiteSpace: 'nowrap' }}>225+ Patients</div>
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px', height: '10px' }}>
              {[1,2,3,4,5].map(star => <img key={star} src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png" alt="star" style={{ width: '10px', height: '10px' }} />)}
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

        <div className="form-row" style={{ alignItems: 'stretch', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ flex: '0 0 100px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', borderRight: '1px solid #ddd' }}>
            <span style={{ color: '#888', letterSpacing: '4px', fontWeight: 'bold' }}>{captcha}</span>
          </div>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              name="code" 
              placeholder="ENTER CODE" 
              className="form-input" 
              value={formData.code} 
              onChange={handleChange} 
              style={{ backgroundColor: 'transparent', border: 'none', height: '50px', borderRadius: 0, width: '100%' }}
              required 
            />
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', position: 'relative', height: '60px', borderRadius: '50px', padding: '0 24px' }} disabled={loading}>
            <span style={{ fontFamily: "'Marcellus', serif", fontSize: '1.2rem', color: '#000', margin: '0 auto' }}>{loading ? 'Submitting...' : 'Submit'}</span>
            <div className="icon-circle" style={{ position: 'absolute', right: '10px', backgroundColor: '#000', width: '40px', height: '40px' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
