import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './third.css';

function Third() {
  const location = useLocation();
  const navigate = useNavigate();
  const { branch, semester, userType } = location.state || { branch: 'Unknown', semester: 'Unknown', userType: 'Unknown' };

  const handleCourseClick = (courseType) => {
    navigate('/four', { state: { branch, semester, courseType, userType } });
  };

  const handleHomeClick = () => {
    navigate('/second', { state: { branch, semester, userType } });
  };

  return (
    <div className="third-page">
      <div className="sidebar">
        <h1>RSET NOTES</h1>
        <button className="sidebar-btn" onClick={handleHomeClick}>
          <i className="fas fa-home"></i> HOME
        </button>
        <div className="branch-info">
          <h3>Branch: {branch}</h3>
          <h3>Semester: {semester}</h3>
          <h3>User Type: {userType}</h3>
        </div>
      </div>
      <div className="main-content">
        <button className="course-btn" onClick={() => handleCourseClick('Regular Course')}>
          REGULAR COURSE
        </button>
        <button className="course-btn" onClick={() => handleCourseClick('Minors Course')}>
          MINORS COURSE
        </button>
        <button className="course-btn" onClick={() => handleCourseClick('Honours Course')}>
          HONOURS COURSE
        </button>
        <button className="course-btn" onClick={() => handleCourseClick('Elective Course')}>
          ELECTIVE COURSE
        </button>
      </div>
    </div>
  );
}

export default Third;