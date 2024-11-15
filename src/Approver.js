import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Approver.css';

function Approver() {
  const navigate = useNavigate();
  const [pendingNotes, setPendingNotes] = useState([]);
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('notes');

  useEffect(() => {
    // Fetch pending notes, edit suggestions, and users from API
    // This is a placeholder and should be replaced with actual API calls
    setPendingNotes([
      { id: 1, title: 'New Physics Note', content: 'Content of physics note', author: 'Dr. Smith' },
      { id: 2, title: 'Updated Math Formula', content: 'New math formula explanation', author: 'Prof. Johnson' },
    ]);
    setEditSuggestions([
      { id: 1, noteId: 3, content: 'Suggestion to improve chemistry explanation', author: 'Student A' },
      { id: 2, noteId: 4, content: 'Correction in computer science algorithm', author: 'Student B' },
    ]);
    setUsers([
      { id: 1, name: 'John Doe', role: 'Student', status: 'Active' },
      { id: 2, name: 'Jane Smith', role: 'Teacher', status: 'Active' },
      { id: 3, name: 'Bob Johnson', role: 'Student', status: 'Inactive' },
    ]);
  }, []);

  const handleApproveNote = (noteId) => {
    // API call to approve note
    setPendingNotes(pendingNotes.filter(note => note.id !== noteId));
    alert('Note approved successfully!');
  };

  const handleRejectNote = (noteId) => {
    // API call to reject note
    setPendingNotes(pendingNotes.filter(note => note.id !== noteId));
    alert('Note rejected.');
  };

  const handleApproveSuggestion = (suggestionId) => {
    // API call to approve suggestion
    setEditSuggestions(editSuggestions.filter(suggestion => suggestion.id !== suggestionId));
    alert('Edit suggestion approved and applied!');
  };

  const handleRejectSuggestion = (suggestionId) => {
    // API call to reject suggestion
    setEditSuggestions(editSuggestions.filter(suggestion => suggestion.id !== suggestionId));
    alert('Edit suggestion rejected.');
  };

  const handleUpdateUserStatus = (userId, newStatus) => {
    // API call to update user status
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    alert(`User status updated to ${newStatus}.`);
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="approver-page">
      <div className="sidebar">
        <h1>RSET NOTES</h1>
        <button className="sidebar-btn" onClick={handleHomeClick}>
          <i className="fas fa-home"></i> HOME
        </button>
        <button className="sidebar-btn" onClick={() => setSelectedTab('notes')}>
          Pending Notes
        </button>
        <button className="sidebar-btn" onClick={() => setSelectedTab('suggestions')}>
          Edit Suggestions
        </button>
        <button className="sidebar-btn" onClick={() => setSelectedTab('users')}>
          User Management
        </button>
      </div>
      <div className="main-content">
        <h2>Approver Dashboard</h2>
        {selectedTab === 'notes' && (
          <div className="pending-notes">
            <h3>Pending Notes</h3>
            {pendingNotes.map(note => (
              <div key={note.id} className="note-item">
                <h4>{note.title}</h4>
                <p>Author: {note.author}</p>
                <p>{note.content.substring(0, 100)}...</p>
                <button onClick={() => handleApproveNote(note.id)}>Approve</button>
                <button onClick={() => handleRejectNote(note.id)}>Reject</button>
              </div>
            ))}
          </div>
        )}
        {selectedTab === 'suggestions' && (
          <div className="edit-suggestions">
            <h3>Edit Suggestions</h3>
            {editSuggestions.map(suggestion => (
              <div key={suggestion.id} className="suggestion-item">
                <p>Note ID: {suggestion.noteId}</p>
                <p>Author: {suggestion.author}</p>
                <p>{suggestion.content}</p>
                <button onClick={() => handleApproveSuggestion(suggestion.id)}>Approve</button>
                <button onClick={() => handleRejectSuggestion(suggestion.id)}>Reject</button>
              </div>
            ))}
          </div>
        )}
        {selectedTab === 'users' && (
          <div className="user-management">
            <h3>User Management</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => handleUpdateUserStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approver;