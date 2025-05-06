// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';    // <-- new API
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './theme.css';   // your global CSS variables
import './index.css';   // your resets / globals
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
