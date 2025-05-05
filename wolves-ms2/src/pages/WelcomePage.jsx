// File: src/pages/WelcomePage.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './WelcomePage.css';

const companyLogos = [
  'deloitte-logo.png','etisalat-logo.png','henkel-logo.png','IBM-logo.png',
  'microsoft-logo.png','nestle-logo.png','pfizer-logo.png','pwc-logo.png',
  'QNB-logo.png','schneider-logo.png','siemens-logo.png','valeo-logo.png'
];

const WelcomePage = () => {
  const marqueeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const track = marqueeRef.current;
    let scroll = 0;
    const speed = 0.3;
    function step() {
      scroll += speed;
      if (scroll >= track.scrollWidth / 2) scroll = 0;
      track.style.transform = `translateX(-${scroll}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, []);

  const logos = [...companyLogos, ...companyLogos];

  return (
    <div className="welcome-wrapper">
      <TopBar showSearch={false}>
        <button
          className="nav-login-btn"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="nav-login-btn"
          onClick={() => navigate('/register-company')}
        >
          Become an Employer
        </button>
      </TopBar>

      <main className="welcome-main">
        <div className="text-block">
          <h1>Launch Your Internship Journey!</h1>
          <p>
            Connect with leading companies, discover tailored opportunities,
            and propel your career forward.
          </p>
          <div className="cta-group">
            <button
              className="cta-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="cta-secondary"
              onClick={() => navigate('/register-company')}
            >
              Become an Employer
            </button>
          </div>
          <div className="bubble bubble-1" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-3" />
        </div>

        <div className="visual-block">
          <div className="circle large" />
          <div className="circle medium" />
          <div className="circle small" />
        </div>
      </main>

      <div className="logo-marquee-container">
        <div className="logo-marquee" ref={marqueeRef}>
          {logos.map((logo, idx) => (
            <img
              key={idx}
              src={require(`../assets/companies/${logo}`)}
              alt={logo.replace('-logo.png', '')}
              className="marquee-logo"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
