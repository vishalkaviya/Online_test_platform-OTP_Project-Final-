import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/RegisterPage.css";
import regpic from "../../assets/regpic2.png";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
navigate("/login");

    } catch (error) {
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    if (errorData.username) {
      alert(`Username: ${errorData.username[0]}`);
    } else if (errorData.email) {
      alert(`Email: ${errorData.email[0]}`);
    } else {
      alert("Registration failed. Please try again.");
    }
  }
}

  };

  return (
    <div className="reg-bg">
      <div className="reg-wrapper">
        <div className="reg-card">
          <div className="reg-left">
            <img src={regpic} alt="Smart Test" className="reg-img" />
          </div>
          <div className="reg-right">
            <h2>Register</h2>
            <p className="reg-sub">Join Smart Test Today</p>
            <form onSubmit={handleSubmit} className="reg-form">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
            <p className="reg-login">
              Already registered? <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

