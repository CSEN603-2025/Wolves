import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './EditInternshipPost.css';

const EditInternshipPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    industry: '',
    duration: '',
    paid: false,
    salary: '',
    description: ''
  });

  useEffect(() => {
    // Load the post data from sessionStorage
    const savedPost = sessionStorage.getItem('editingPost');
    if (savedPost) {
      const postData = JSON.parse(savedPost);
      // Ensure we're editing the correct post
      if (String(postData.id) === String(id)) {
        setFormData({
          title: postData.title || '',
          company: postData.company || '',
          location: postData.location || '',
          industry: postData.industry || '',
          duration: postData.duration || '',
          paid: postData.paid || false,
          salary: postData.salary || '',
          description: postData.description || ''
        });
      } else {
        // If IDs don't match, redirect back to posts
        navigate('/company-posts');
      }
    } else {
      // If no saved post data, redirect back to posts
      navigate('/company-posts');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get current posts from sessionStorage
    const savedPosts = sessionStorage.getItem('companyPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      
      // Update the post
      const updatedPosts = posts.map(post => 
        String(post.id) === String(id) ? { ...post, ...formData } : post
      );
      
      // Save back to sessionStorage
      sessionStorage.setItem('companyPosts', JSON.stringify(updatedPosts));
    }
    
    // Navigate back to posts page
    navigate('/company-posts');
  };

  return (
    <div className="dashboard-container">
      <TopBar>
        <button className="topbar-button" onClick={() => navigate('/company-posts')}>
          Back to Posts
        </button>
      </TopBar>

      <div className="main-content">
        <div className="edit-post-container">
          <h2>Edit Internship Post</h2>
          
          <form onSubmit={handleSubmit} className="edit-post-form">
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={formData.paid}
                  onChange={handleChange}
                />
                Paid Position
              </label>
            </div>

            {formData.paid && (
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/company-posts')} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInternshipPost; 