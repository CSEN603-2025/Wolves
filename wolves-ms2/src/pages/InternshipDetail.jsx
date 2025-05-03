import React from 'react';
import { useParams } from 'react-router-dom';

const InternshipDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Internship Detail Page</h1>
      <p>Showing details for internship ID: {id}</p>
    </div>
  );
};

export default InternshipDetail;
