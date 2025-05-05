// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage   from './pages/LoginPage';
import RegisterCompanyPage from './pages/CompanyRegistration';
import StudentHome from './pages/StudentHome';
import CompanyHome from './pages/CompanyHome';
import AdminHome   from './pages/AdminHome';
import FacultyHome from './pages/FacultyHome';
import InternshipDetail from './pages/InternshipDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-company" element={<RegisterCompanyPage />} />
      <Route path="/student-home" element={<StudentHome />} />
      <Route path="/company-home" element={<CompanyHome />} />
      <Route path="/admin-home" element={<AdminHome />} />
      <Route path="/faculty-home" element={<FacultyHome />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
