"use client";
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function HairTransplantClinicHero({ data = {} }) {
  const {
    backgroundImage = "",
    doctorImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    mainHeading = "PREMIUM HAIR TRANSPLANT CLINIC IN DELHI",
    doctorName = "DMC Trichology",
    degreeText = "Advanced Hair Restoration Sciences",
    descriptionParagraph = "Transform your confidence with Delhi’s most advanced, premium hair transplant procedures. Combining world-class US-FDA approved technologies with the artistic precision of board-certified clinical specialists, DMC Trichology delivers natural-looking, high-density results that last a lifetime.",
    namePlaceholder = "Name*",
    phonePlaceholder = "Mobile Number*",
    emailPlaceholder = "E-Mail Address*",
    datePlaceholder = "Select Preferred Date*",
    messagePlaceholder = "Enter Your Message Here",
    captchaPlaceholder = "Code*",
    submitButtonText = "Request A Call Back",
    backgroundColor = "#0b132b",
    overlayOpacity = 0.6
  } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    appointmentDate: '',
    message: '',
    captchaInput: ''
  });

  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const generateCaptcha = () => {
    setCaptcha(createCaptcha());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile || !/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.appointmentDate) {
      setError('Please select a preferred date.');
      return;
    }
    if (!formData.captchaInput.trim() || formData.captchaInput.trim() !== captcha) {
      setError('Invalid verification code.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/hair-transplant-clinic-in-delhi/lead', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        appointmentDate: formData.appointmentDate,
        message: formData.message.trim(),
        service: "Hair Transplant Clinic In Delhi Lead"
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        appointmentDate: '',
        message: '',
        captchaInput: ''
      });
      generateCaptcha();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`
  } : {};

  return (
    <EditableSection sectionId="hair-clinic-hero" label="Hair Transplant Clinic Hero">
      <section className="hair-clinic-hero-section hair-clinic-fade-in" style={bgStyle}>
        <div className="hair-clinic-hero-overlay" style={{ opacity: overlayOpacity }} />

        <div className="hair-clinic-hero-grid">
          {/* LEFT PORTRAIT */}
          <div className="hair-clinic-doctor-portrait-box">
            <div className="hair-clinic-portrait-holder">
              <img src={doctorImage} alt={`${doctorName} Profile`} />
            </div>
          </div>

          {/* RIGHT EDITORIAL BLOCK & FORM */}
          <div className="hair-clinic-hero-content">
            <span className="hair-clinic-hero-badge">
              <EditableText sectionId="hair-clinic-hero" fieldPath="mainHeading" tag="span">
                {mainHeading}
              </EditableText>
            </span>

            <h1 className="hair-clinic-hero-title">
              <EditableText sectionId="hair-clinic-hero" fieldPath="doctorName" tag="span">
                {doctorName}
              </EditableText>
            </h1>

            <span className="hair-clinic-hero-degree">
              <EditableText sectionId="hair-clinic-hero" fieldPath="degreeText" tag="span">
                {degreeText}
              </EditableText>
            </span>

            <p className="hair-clinic-hero-desc">
              <EditableText sectionId="hair-clinic-hero" fieldPath="descriptionParagraph" tag="span">
                {descriptionParagraph}
              </EditableText>
            </p>

            {/* Callback Request Form */}
            <div className="hair-clinic-paper-form" id="appointment-form">
              <h3>Request Consultation</h3>

              {success && (
                <div className="hair-clinic-alert hair-clinic-alert-success">
                  <strong>✓ Consultation request received! Our clinic desk will contact you shortly.</strong>
                </div>
              )}

              {error && (
                <div className="hair-clinic-alert hair-clinic-alert-error">
                  <strong>⚠️ {error}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="hair-clinic-form-grid">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={namePlaceholder}
                    className="hair-clinic-input"
                    disabled={loading}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={emailPlaceholder}
                    className="hair-clinic-input"
                    disabled={loading}
                    required
                  />

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder={phonePlaceholder}
                    className="hair-clinic-input"
                    disabled={loading}
                    required
                  />

                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    placeholder={datePlaceholder}
                    className="hair-clinic-input"
                    disabled={loading}
                    required
                  />

                  <div className="hair-clinic-captcha-box">
                    <div
                      className="hair-clinic-captcha-badge"
                      onClick={generateCaptcha}
                      title="Click to refresh verification code"
                    >
                      {captcha}
                    </div>

                    <input
                      type="text"
                      name="captchaInput"
                      value={formData.captchaInput}
                      onChange={handleChange}
                      placeholder={captchaPlaceholder}
                      className="hair-clinic-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={messagePlaceholder}
                    className="hair-clinic-textarea"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="hair-clinic-submit-btn"
                >
                  <EditableText sectionId="hair-clinic-hero" fieldPath="submitButtonText" tag="span">
                    {loading ? "Submitting Request..." : submitButtonText}
                  </EditableText>
                  
                  <div className="hair-clinic-arrow-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
                      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#0b132b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
