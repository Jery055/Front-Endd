import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './second.css';

function Second() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBranches, setShowBranches] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (location.state) {
      const { branch, semester, userType } = location.state;
      setSelectedBranch(branch || "");
      setSelectedSemester(semester || "");
      setUserType(userType || "");
    }
  }, [location.state]);

  const toggleBranches = () => {
    setShowBranches(!showBranches);
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setShowBranches(false);
  };

  const handleSubjectClick = (semester) => {
    if (selectedBranch && semester) {
      setSelectedSemester(semester);
      navigate("/third", { state: { branch: selectedBranch, semester, userType } });
    } else {
      alert("Please select a branch and a semester.");
    }
  };

  return (
    <div className={`second-page ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <div>Home Page</div>
        <div className="branch-section" onClick={toggleBranches}>
          Branch: {selectedBranch || "Select Branch"}
        </div>
      </div>

      {showBranches && (
        <div className="branches-list">
          <p className={selectedBranch === "Computer Science" ? "selected" : ""} onClick={() => handleBranchClick('Computer Science')}>Computer Science</p>
          <p className={selectedBranch === "Applied Electronics & Instrumentation" ? "selected" : ""} onClick={() => handleBranchClick('Applied Electronics & Instrumentation')}>Applied Electronics & Instrumentation</p>
          <p className={selectedBranch === "Civil" ? "selected" : ""} onClick={() => handleBranchClick('Civil')}>Civil</p>
          <p className={selectedBranch === "Artificial Intelligence & Data Science" ? "selected" : ""} onClick={() => handleBranchClick('Artificial Intelligence & Data Science')}>Artificial Intelligence & Data Science</p>
          <p className={selectedBranch === "Computer Science & Business Systems" ? "selected" : ""} onClick={() => handleBranchClick('Computer Science & Business Systems')}>Computer Science & Business Systems</p>
          <p className={selectedBranch === "Electrical & Electronics" ? "selected" : ""} onClick={() => handleBranchClick('Electrical & Electronics')}>Electrical & Electronics</p>
          <p className={selectedBranch === "Electronics & Communication" ? "selected" : ""} onClick={() => handleBranchClick('Electronics & Communication')}>Electronics & Communication</p>
          <p className={selectedBranch === "Information Technology" ? "selected" : ""} onClick={() => handleBranchClick('Information Technology')}>Information Technology</p>
          <p className={selectedBranch === "Mechanical" ? "selected" : ""} onClick={() => handleBranchClick('Mechanical')}>Mechanical</p>
        </div>
      )}

      <div className="main-content">
        <div className="welcome-message">
          Welcome to RSET Notes!
        </div>

        <div className="selected-branch">
          Selected Branch: {selectedBranch ? selectedBranch : "None"}
        </div>

        <div className="subject-buttons">
          <button className="subject-btn" onClick={() => handleSubjectClick('S1')}>S1</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S2')}>S2</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S3')}>S3</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S4')}>S4</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S5')}>S5</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S6')}>S6</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S7')}>S7</button>
          <button className="subject-btn" onClick={() => handleSubjectClick('S8')}>S8</button>
        </div>
      </div>
    </div>
  );
}

export default Second;