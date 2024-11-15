import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the password is correct
    if (password !== "123") {
      alert("Invalid password. Please enter the correct password.");
      return;
    }

    // Check email domain to determine role
    if (email.endsWith("@rajagiri.edu.in")) {
      alert("You have logged in as a student!");
      navigate("/dashboard", { state: { userType: "Student" } });
    } else if (email.endsWith("@rajagiri.tech.edu.in")) {
      alert("You have logged in as a teacher!");
      navigate("/dashboard", { state: { userType: "Teacher" } });
    } else {
      alert("Please enter a valid college email ending in '@rajagiri.edu.in' or '@rajagiri.tech.edu.in'");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo-section">
          <h1>RSET NOTES</h1>
          <p>Access your college notes easily</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              required
            />
          </div>
          <div className="input-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="footer-text">
          <p>&copy; 2024 Notes Hub</p>
        </div>
      </div>
    </div>
  );
}

export default App;
