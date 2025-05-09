import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import WelcomePage          from './pages/WelcomePage';
import LoginPage            from './pages/LoginPage';
import RegisterCompanyPage  from './pages/CompanyRegistration';
import StudentHome          from './pages/StudentHome';
import CompanyHome          from './pages/CompanyHome';
import AdminHome            from './pages/AdminHome';
import FacultyHome          from './pages/FacultyHome';
import StudentProfile       from './pages/StudentProfile';
import AllInternships       from './pages/AllInternships';
import InternshipListing    from './pages/InternshipListing';
import StudentApplications  from './pages/StudentApplications';
import CompanyPosts         from './pages/CompanyPosts';
import CompanyApplications from './pages/CompanyApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import CompanyInterns from './pages/CompanyInterns';
import InternDetails from './pages/InternDetails';
import StudentInternships from './pages/StudentInternships';
import InternshipEvaluation from './pages/InternshipEvaluation';
import AdminCompanies from './pages/AdminCompanies';
import CompanyDetails from './pages/CompanyDetails';

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // whenever the URL changes, show the loading overlay for 150ms
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(id);
  }, [location]);

  if (loading) {
    return (
      <div className="page-loading">
        Loading…
      </div>
    );
  }

  return (
    <div className="page-content">
      <Routes>
        <Route path="/"                     element={<WelcomePage />} />
        <Route path="/login"                element={<LoginPage />} />
        <Route path="/register-company"     element={<RegisterCompanyPage />} />
        <Route path="/student-home"         element={<StudentHome />} />
        <Route path="/company-home"         element={<CompanyHome />} />
        <Route path="/admin-home"           element={<AdminHome />} />
        <Route path="/faculty-home"         element={<FacultyHome />} />
        <Route path="/student-profile"      element={<StudentProfile />} />
        <Route path="/all-internships"      element={<AllInternships />} />
        <Route path="/internship/:id"       element={<InternshipListing />} />
        <Route path="/student-applications" element={<StudentApplications />} />
        <Route path="/company-posts"        element={<CompanyPosts />} />
        <Route path="/company-applications" element={<CompanyApplications />} />
        <Route path="/company-applications/:id"    element={<ApplicationDetails />} />
        <Route path="/company-interns/:id"    element={<InternDetails />} />
        <Route path="/company-interns" element={<CompanyInterns />} />
        <Route path="/student-internships" element={<StudentInternships />} />
        <Route path="/student-internships/:id"       element={<InternshipEvaluation />} />
        <Route path="/admin-home/companies" element={<AdminCompanies />} />
        <Route path="/admin-home/companies/:id" element={<CompanyDetails />} />
        <Route path="*"                     element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
