// File: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError]   = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please enter a valid email.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setFormError('');
      return;
    }
    setFieldErrors({});

    // Credential routing + setting context
    if (email === 'admin@guc.edu.eg' && password === 'admin') {
      setUser({ role: 'admin', name: 'Site Admin' });
      return navigate('/admin-home');
    }
    if (email === 'jobs@microsoft.com' && password === 'pass') {
      setUser({ 
        id:3,
        role: 'company', 
        name: 'Microsoft',
        email:'jobs@microsoft.com',
        status:'Pro',
        viewCount:true
         });
      return navigate('/company-home');
    }
    if (email === 'yahia.yahia@guc.edu.eg' && password === 'pass') {
      setUser({
        role: 'student',
        id: '1',
        name: 'Yahia Hesham',
        email: 'yahia.yahia@guc.edu.eg',
        password: 'pass',
        major: 'MET',
        status: 'Pro',
        completedMonths: 3,
        totalMonths: 3,
        profilePicture: 'icons/pp.png',
        profileUrl:'/student-profile'
      });
      return navigate('/student-home');
    }
    if (email === 'ahmed.ibrahim@guc.edu.eg' && password === 'pass') {
      setUser({
        role: 'student',
        id: '2',
        name: 'Ahmed Ibrahim',
        email: 'ahmed.ibrahim@guc.edu.eg',
        password: 'pass',
        major: 'Management',
        status: 'Basic',
        completedMonths: 1,
        totalMonths: 1,
        profileUrl: '/profile/stu002',
        profilePicture: 'icons/bmo.jpg'
      });
      return navigate('/student-home');
    }
    if (email === 'faculty@guc.edu.eg' && password === 'pass') {
      setUser({ role: 'faculty', name: 'Faculty Member' });
      return navigate('/faculty-home');
    }

    setFormError('Invalid email or password.');
  };

  return (
    <div className="login-page">
      <TopBar showSearch={false}>
        <Link to="/register-company" className="topbar-employer-btn">
          Become an Employer
        </Link>
      </TopBar>

      <div className="login-main">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2>Sign In</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="button-primary">
            Login
          </button>

          {formError && (
            <div className="form-message error">{formError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
