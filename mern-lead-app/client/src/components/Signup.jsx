import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasDigit) {
      return "Password must contain at least one digit.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(signupData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        "https://lead-app-rhu2.vercel.app/users/signup",
        signupData
      );
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setError(
        err.response?.data?.error || "Error signing up. Please try again."
      );
    }
  };

  return (
    <div className="signup-form">
      <div className="signup-container">
        <h2>Signup</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="signup-form1" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={signupData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={signupData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={signupData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signupData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
