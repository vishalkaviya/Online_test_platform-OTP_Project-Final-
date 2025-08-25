import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/LoginPage.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login/", {

      username: formData.username,
      password: formData.password,
    });

    const { access, user_id, username } = response.data;

    localStorage.setItem("token", access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("username", username); // ✅ Save username

    // ✅ Redirect based on username
    if (username === "VdartAcademy") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    alert("Invalid credentials.");
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Smart Test Login</h2>
        <p className="subtitle">Welcome back! Please login to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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

          <button type="submit" className="login-btn">Login</button>

          <div className="forgot-password">
            <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
          </div>
        </form>
        <p className="register-redirect">
          Don't have an account? <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
