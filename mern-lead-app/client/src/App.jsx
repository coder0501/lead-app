import React from "react";
import { Link } from "react-router-dom";
import "./App.css";  // Importing the App.css file

const App = () => {
  return (
    <div>
      <div className="main-container">
        <h1>Welcome to Lead Management System</h1>
        <p>Please log in or sign up to continue.</p>
        <Link to="/signup">
          <button className="btn">Signup</button>
        </Link>
        <Link to="/login">
          <button className="btn">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default App;
