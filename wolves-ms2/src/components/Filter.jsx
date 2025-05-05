import React from 'react';
import './Filter.css';

const Filter = ({ title, value, onChange, children }) => (
  <div className="filter">
    <label className="filter-label">{title}</label>
    <select className="filter-select" value={value} onChange={onChange}>
      {children}
    </select>
  </div>
);

export default Filter;
