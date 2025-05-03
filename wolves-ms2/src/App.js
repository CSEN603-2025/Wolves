import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentHome from './pages/StudentHome';
import InternshipDetail from './pages/InternshipDetail'; // You'll need to create this page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentHome />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
    </Routes>
  );
};

export default App;
