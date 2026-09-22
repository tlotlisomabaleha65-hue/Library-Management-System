import React, { useState } from 'react';

// UserManagement component handles user login and full CRUD (Create, Read, Update, Delete) for accounts
function UserManagement({ users, currentUser, onLogin, onLogout, onAddUser, onUpdateUser, onDeleteUser }) {
  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // User management form state (Add/Edit)
  const [formData, setFormData] = useState({
    name: '',
    membershipId: '',
    role: 'Member',
    password: ''
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Feedback banner state
  const [feedback, setFeedback] = useState(null);

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.membershipId.toLowerCase() === loginId.trim().toLowerCase() && u.password === loginPassword
    );

    if (user) {
      onLogin(user);
      setFeedback({ type: 'success', text: `Welcome back, ${user.name}! You are logged in as ${user.role}.` });
      setLoginId('');
      setLoginPassword('');
    } else {
      setFeedback({ type: 'error', text: 'Invalid Membership ID or password. Please try again.' });
    }
  };

  // Quick Demo Login helper for the lecturer/evaluator
  const handleQuickLogin = (demoUser) => {
    onLogin(demoUser);
    setFeedback({ type: 'success', text: `Logged in as ${demoUser.name} (${demoUser.role}).` });
  };

  // Handle User Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add or Update User
  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.membershipId.trim() || !formData.password.trim()) {
      setFeedback({ type: 'error', text: 'Please fill in Name, Membership ID, and Password.' });
      return;
    }

    if (editingUserId) {
      // Update existing user
      onUpdateUser({
        id: editingUserId,
        name: formData.name.trim(),
        membershipId: formData.membershipId.trim().toUpperCase(),
        role: formData.role,
        password: formData.password
      });
      setFeedback({ type: 'success', text: `User "${formData.name}" was updated successfully!` });
      resetUserForm();
    } else {
      // Check for duplicate Membership ID
      const exists = users.some(
        (u) => u.membershipId.toUpperCase() === formData.membershipId.trim().toUpperCase()
      );
      if (exists) {
        setFeedback({ type: 'error', text: `A user with Membership ID "${formData.membershipId}" already exists.` });
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        membershipId: formData.membershipId.trim().toUpperCase(),
        role: formData.role,
        password: formData.password
      };

      onAddUser(newUser);
      setFeedback({ type: 'success', text: `User "${newUser.name}" added successfully!` });
      resetUserForm();
    }
  };

  // Start editing a user
  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
      password: user.password
    });
    setFeedback({ type: 'info', text: `Editing user "${user.name}". Make changes and click "Save User Changes".` });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Cancel edit mode
  const resetUserForm = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      membershipId: '',
      role: 'Member',
      password: ''
    });
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    if (currentUser && currentUser.id === user.id) {
      alert('You cannot delete your own currently logged-in account!');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete user "${user.name}" (${user.membershipId})?`);
    if (confirmDelete) {
      onDeleteUser(user.id);
      if (editingUserId === user.id) {
        resetUserForm();
      }
      setFeedback({ type: 'success', text: `User "${user.name}" has been deleted.` });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>👥 User Management & Authentication</h1>
        <p>Login to your account or manage registered library users and roles.</p>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`alert-box ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Section 1: User Login */}
      <div className="content-panel">
        <h2 className="panel-title">🔐 User Login</h2>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '15px' }}>
                You are currently logged in as: <strong>{currentUser.name}</strong>
              </p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Membership ID: <code>{currentUser.membershipId}</code> | Role: <span className="badge badge-info">{currentUser.role}</span>
              </p>
            </div>
            <button className="btn btn-danger" onClick={onLogout}>
              🚪 Log Out
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleLoginSubmit} style={{ maxWidth: '500px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Membership ID *</label>
                <input
                  type="text"
                  placeholder="e.g., LIB-001 or STU-101"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>

            {/* Quick Demo Login buttons */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px', marginTop: '15px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                <strong>Quick Demo Logins (Click to test):</strong>
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleQuickLogin(u)}
                  >
                    👤 {u.name} ({u.role})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Admin View - Add/Edit User Form */}
      <div className="content-panel">
        <h2 className="panel-title">
          {editingUserId ? '✏️ Update User Details' : '➕ Add New User (Admin View)'}
        </h2>

        <form onSubmit={handleUserSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Membership ID *</label>
              <input
                type="text"
                name="membershipId"
                placeholder="e.g., MEM-201 or LIB-002"
                value={formData.membershipId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="Member">Member (Student / Reader)</option>
                <option value="Librarian">Librarian (Staff)</option>
                <option value="Admin">Admin (System Manager)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="text"
                name="password"
                placeholder="Create account password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className={editingUserId ? 'btn btn-warning' : 'btn btn-primary'}>
              {editingUserId ? '💾 Save User Changes' : '➕ Register User'}
            </button>
            {editingUserId && (
              <button type="button" className="btn btn-secondary" onClick={resetUserForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Section 3: Registered Users Table */}
      <div className="content-panel">
        <h2 className="panel-title">📋 Registered Users List ({users.length})</h2>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Membership ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Password</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isCurrent = currentUser && currentUser.id === u.id;
                return (
                  <tr key={u.id} style={isCurrent ? { backgroundColor: '#f0f9ff' } : {}}>
                    <td>
                      <code>{u.membershipId}</code>
                      {isCurrent && <span className="badge badge-info" style={{ marginLeft: '6px' }}>Current</span>}
                    </td>
                    <td><strong>{u.name}</strong></td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Librarian' ? 'badge-warning' : 'badge-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td><code>{u.password}</code></td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-warning btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => startEditUser(u)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
