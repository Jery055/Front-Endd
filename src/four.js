import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './four.css';

function Four() {
  const location = useLocation();
  const navigate = useNavigate();
  const { branch, semester, courseType, userType } = location.state || { branch: 'Unknown', semester: 'Unknown', courseType: 'Unknown', userType: 'Unknown' };

  // Retrieve subjects from localStorage or use default subjects
  const initialSubjects = JSON.parse(localStorage.getItem('subjects')) || ['Maths', 'Physics', 'Chemistry', 'Computer Science', 'Data Structures', 'Operating Systems', 'Electronics'];
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    // Update subjects in localStorage whenever the subjects state changes
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectClick = (subject) => {
    navigate('/five', { state: { branch, semester, courseType, subject, userType } });
  };

  const handleHomeClick = () => {
    navigate('/second', { state: { branch, semester, userType } });
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject(''); // Clear the input after adding
    } else {
      alert("Please enter a unique and valid subject name.");
    }
  };

  const handleDeleteSubject = (subjectToDelete) => {
    const updatedSubjects = subjects.filter(subject => subject !== subjectToDelete);
    setSubjects(updatedSubjects);
  };

  return (
    <div className="four-page">
      <div className="sidebar">
        <h1>RSET NOTES</h1>
        <button className="sidebar-btn" onClick={handleHomeClick}>
          <i className="fas fa-home"></i> HOME
        </button>
        <button className="sidebar-btn dark-mode-btn">
          <i className="fas fa-moon"></i> DARK MODE
        </button>
        <div className="branch-info">
          <h3>Branch: {branch}</h3>
          <h3>Semester: {semester}</h3>
          <h3>Course: {courseType}</h3>
          <h3>User Type: {userType}</h3>
        </div>
      </div>
      <div className="main-content">
        <input
          type="text"
          className="search-bar"
          placeholder="Search Subjects..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {userType === 'Teacher' && (
          <div className="add-subject-section">
            <input
              type="text"
              className="search-bar"
              placeholder="Enter new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button className="sidebar-btn" onClick={handleAddSubject}>Add Subject</button>
          </div>
        )}
        <div className="subject-list">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <div key={index} className="subject-item">
                <button
                  className="subject-btn"
                  onClick={() => handleSubjectClick(subject)}
                >
                  {subject}
                </button>
                {userType === 'Teacher' && (
                  <button className="subject-delete-btn" onClick={() => handleDeleteSubject(subject)}>Delete</button>
                )}
              </div>
            ))
          ) : (
            <p>No subjects found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Four;
