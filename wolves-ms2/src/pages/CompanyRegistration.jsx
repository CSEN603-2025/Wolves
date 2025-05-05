// File: src/pages/CompanyRegistration.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './CompanyRegistration.css';

const CompanyRegistration = () => {
  const [form, setForm] = useState({
    name: '',
    industry: '',
    size: '',
    email: '',
    logo: null,
    documents: null
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: null }));
  };

  const handleFile = e => {
    const { name, files } = e.target;
    setForm(f => ({ ...f, [name]: files[0] || null }));
    setErrors(err => ({ ...err, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())       errs.name      = 'Company name is required.';
    if (!form.industry.trim())   errs.industry  = 'Industry is required.';
    if (!form.size)              errs.size      = 'Please select your company size.';
    if (!form.email.trim())      errs.email     = 'Company email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
                                 errs.email     = 'Please enter a valid email address.';
    if (!form.logo)              errs.logo      = 'Company logo file is required.';
    if (!form.documents)         errs.documents = 'Verification document is required.';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMessage(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setMessage({
        type: 'success',
        text: 'Registration successful! We will review your documents shortly.'
      });
      setForm({
        name: '',
        industry: '',
        size: '',
        email: '',
        logo: null,
        documents: null
      });
    }, 1200);
  };

  return (
    <div className="company-reg-page">
      <TopBar showSearch={false}>
      <Link to="/login" className="topbar-login-btn">Login</Link>
      </TopBar>

      <main className="company-reg-main">
        <form className="company-reg-form" onSubmit={handleSubmit} noValidate>
          <h2>Register Your Company</h2>

          <div className="form-group">
            <label htmlFor="name">Company Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Microsoft"
            />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              name="industry"
              type="text"
              value={form.industry}
              onChange={handleChange}
              placeholder="e.g. Technology"
            />
            {errors.industry && <small className="field-error">{errors.industry}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="size">Company Size</label>
            <select
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
            >
              <option value="">— select size —</option>
              <option value="1-50">Small (1–50 employees)</option>
              <option value="51-200">Medium (51–200 employees)</option>
              <option value="201-500">Large (201–500 employees)</option>
              <option value="500+">Corporate (500+ employees)</option>
            </select>
            {errors.size && <small className="field-error">{errors.size}</small>}
          </div>

          <div className="form-group file-group">
            <label>Company Logo</label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFile}
            />
            {errors.logo && <small className="field-error">{errors.logo}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Official Company Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </div>

          <div className="form-group file-group">
            <label>Verification Documents</label>
            <input
              type="file"
              name="documents"
              onChange={handleFile}
            />
            {errors.documents && <small className="field-error">{errors.documents}</small>}
          </div>

          <button
            type="submit"
            className="button-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Register Company'}
          </button>

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default CompanyRegistration;
