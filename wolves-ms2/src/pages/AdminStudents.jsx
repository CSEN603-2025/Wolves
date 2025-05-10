import React, { useState, useEffect } from 'react';
import './AdminStudents.css';
import StudentCard from '../components/StudentCard';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';

const STATUS_OPTIONS = [
  '',
  'Regular Student',
  'Pro Student'
];

const getMergedStudents = async () => {
  // Load base students from students.json
  const base = await import('../data/students.json').then(m => m.default);
  // Load CRUD/sessionStorage data
  const crud = JSON.parse(sessionStorage.getItem('admin-students') || '[]');
  // Merge: if CRUD has a student with same id, use CRUD data, else base
  const merged = base.map(stu => {
    const updated = crud.find(s => String(s.id) === String(stu.id));
    const mergedStu = { ...stu, ...(updated || {}) };
    // Set status
    mergedStu.status = (mergedStu.completedMonths >= 3) ? 'Pro Student' : 'Regular Student';
    return mergedStu;
  });
  return merged;
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getMergedStudents().then(setStudents);
  }, []);

  const filtered = statusFilter
    ? students.filter(s => s.status === statusFilter)
    : students;

  return (
    <div className="admin-students-page">
      <TopBar showSearch={true} />
      <div className="students-header">
        <h1>All Students</h1>
        <div className="students-filter-bar">
          <Filter
            title="Student Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Regular Student">Regular Student</option>
            <option value="Pro Student">Pro Student</option>
          </Filter>
        </div>
      </div>
      <div className="students-list">
        {filtered.length === 0 ? (
          <div className="no-students">No students found.</div>
        ) : (
          filtered.map(student => (
            <StudentCard
              key={student.id}
              {...student}
              internshipStatus={student.status}
              completedMonths={student.completedMonths}
              totalMonths={3}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStudents; 