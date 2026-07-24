import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import './Admin.css';

const API_URL = 'http://localhost:5000/api/projects';
const CONTACT_API_URL = 'http://localhost:5000/api/contact';

function Admin() {
  // ---------- Authentication State ----------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  
  // ---------- State Variables ----------
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // projects or contacts
  
  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    status: 'In Progress',
    image: ''
  });

  // ---------- 1. Load Projects & Contacts ----------
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(CONTACT_API_URL);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  // ---------- Password Verification ----------
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setAuthMessage('');
      setPasswordInput('');
    } else {
      setAuthMessage('❌ Incorrect password!');
      setPasswordInput('');
    }
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // ---------- Image Upload Handler ----------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        setMessage('❌ Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
        setMessage('');
      };
      reader.onerror = () => {
        setMessage('❌ Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage('❌ Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 2. Add / Update Project ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Technologies string එක array එකකට හරවමු
    const techArray = formData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech);

    const projectData = {
      ...formData,
      technologies: techArray
    };

    try {
      let response;
      if (editingId) {
        // Update
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        setMessage('✅ Project updated!');
      } else {
        // Add new
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        setMessage('✅ Project added!');
      }

      resetForm();
      fetchProjects(); // List එක refresh කරමු
    } catch (error) {
      setMessage('❌ Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 3. Edit Project ----------
  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubLink: project.githubLink || '',
      status: project.status,
      image: project.image || ''
    });
    // Form එකට scroll වෙමු
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
  };

  // ---------- 4. Delete Project ----------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setMessage('🗑️ Project deleted!');
      fetchProjects();
    } catch (error) {
      setMessage('❌ Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 5. Delete Contact Message ----------
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    
    setLoading(true);
    try {
      await fetch(`${CONTACT_API_URL}/${id}`, { method: 'DELETE' });
      setMessage('🗑️ Message deleted!');
      fetchContacts();
    } catch (error) {
      setMessage('❌ Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 5. Reset Form ----------
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubLink: '',
      status: 'In Progress',
      image: ''
    });
    setEditingId(null);
  };

  // ---------- Render Admin Panel ----------
  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="login-form">
          <h1>🔐 Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {authMessage && <div className="message">{authMessage}</div>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </div>

      {/* Message Display */}
      {message && <div className="message">{message}</div>}

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          💬 Messages ({contacts.length})
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <>
          {/* ---------- FORM ---------- */}
          <div className="admin-form">
            <h2>{editingId ? '✏️ Edit Project' : '➕ Add New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Technologies * (comma separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  required
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="form-group">
                <label>Project Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>GitHub Link</label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Completed">✅ Completed</option>
                  <option value="Planned">📝 Planned</option>
                </select>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Project')}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}>Cancel</button>
              )}
            </form>
          </div>

          {/* ---------- PROJECTS LIST ---------- */}
          <div className="projects-list">
            <h2>📁 All Projects</h2>
            {loading && <p>Loading...</p>}
            {projects.length === 0 && !loading && (
              <p>No projects found.</p>
            )}
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Technologies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.technologies.join(', ')}</td>
                    <td>{project.status}</td>
                    <td>
                      <button onClick={() => handleEdit(project)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(project._id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="contacts-list">
          <h2>💬 Contact Messages</h2>
          {loading && <p>Loading...</p>}
          {contacts.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#aaa' }}>No messages yet.</p>
          )}
          <div className="contacts-container">
            {contacts.map((contact) => (
              <div className="contact-card" key={contact._id}>
                <div className="contact-header">
                  <div>
                    <h3>{contact.name}</h3>
                    <p className="contact-email">📧 {contact.email}</p>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
                <p className="contact-message">{contact.message}</p>
                <p className="contact-date">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;