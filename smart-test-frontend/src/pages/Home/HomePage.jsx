import api from "../../services/api";
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaBook, FaChalkboardTeacher, FaUserGraduate, FaPen } from "react-icons/fa";
import { FaQuestionCircle, FaInfoCircle, FaEnvelope } from "react-icons/fa";


import { Link, useNavigate } from "react-router-dom";
import "../../styles/HomePage.css";
import axios from "axios";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.image) {
            setProfileImage(`http://localhost:8000${res.data.image}`);
          }
        });
    }
  }, [localStorage.getItem("updated")]);  // ✅ add this dependency




  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* <img src="/logo.png" alt="Logo" className="logo-img" /> */}
          <h1 className="site-title">TestZoneX</h1>
        </div>

        <div className="header-right">
          {isLoggedIn ? (
            <>
              <img
                src={profileImage || "/default-profile.png"}
                alt="Profile"
                className="nav-profile"
                onClick={() => navigate("/view-profile")}
                style={{ cursor: "pointer" }}
              />

              <button className="auth-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-btn">Login</Link>
              <Link to="/register" className="auth-btn signup">Sign Up</Link>
            </>
          )}
        </div>
      </header>


      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav>


          <ul>



            <li><FaUserGraduate className="icon" /> Dashboard</li>
            <li
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/subjects");
                } else {
                  navigate("/login");
                }
              }}
            >
              <FaBook className="icon" /> Tests
            </li>
            <li onClick={() => navigate("/view-profile")}><FaUserGraduate className="icon" /> View Profile</li>
            <li onClick={() => navigate("/edit-profile")}><FaPen className="icon" /> Edit Profile</li>
            <li onClick={() => navigate("/faq")}><FaQuestionCircle className="icon" /> FAQ</li>
            <li onClick={() => navigate("/about")}><FaInfoCircle className="icon" /> About Us</li>
            <li onClick={() => navigate("/contact")}><FaEnvelope className="icon" /> Contact Us</li>
          </ul>
        </nav>
      </aside>

      <main className="home-main">
        <section className="hero">
          <h2>Welcome to the Future of Learning</h2>
          <p>Take online tests, improve your skills, and achieve your goals!</p>
        </section>

        <section className="features">
          <div className="feature-box">
            <FaBook className="feature-icon" />
            <h3>Variety of Questions</h3>
            <p>Practice easy, medium, and hard level questions to boost your confidence.</p>
          </div>
          <div className="feature-box">
            <FaUserGraduate className="feature-icon" />
            <h3>Track Your Progress</h3>
            <p>Monitor your improvement with real-time analytics and reports.</p>
          </div>
          <div className="feature-box">
            <FaChalkboardTeacher className="feature-icon" />
            <h3>Expert Support</h3>
            <p>Get guidance from top mentors and resolve doubts anytime.</p>
          </div>
        </section>
        <section className="why-choose">
          <h2>Why Choose TestZoneX?</h2>
          <div className="why-cards">
            <div className="why-card">
              <h4>Adaptive Learning</h4>
              <p>Questions and difficulty adjust based on your skill level to personalize your learning journey.</p>
            </div>
            <div className="why-card">
              <h4>Instant Feedback</h4>
              <p>Get real-time answers and explanations right after each test to improve faster.</p>
            </div>
            <div className="why-card">
              <h4>Secure & Reliable</h4>
              <p>Built with secure login and encrypted APIs to keep your data safe.</p>
            </div>
          </div>
        </section>
        <div className="get-started-section">
          <button className="get-started-btn" onClick={() => navigate('/subjects')}>
            Get Started
          </button>
        </div>
        <footer className="site-footer">
          © 2025 TestZoneX. All rights reserved.
        </footer>

      </main>
    </div>
  );
}
