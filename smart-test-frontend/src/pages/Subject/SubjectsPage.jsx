import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBars, FaTimes, FaBook, FaChalkboardTeacher, FaUserGraduate, FaPen, FaQuestionCircle, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import '../../styles/SubjectsPage.css';
import '../../styles/HomePage.css';

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8000/api/subjects/")
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Error loading subjects:", err));

    if (isLoggedIn) {
      axios.get("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.image) {
          setProfileImage(`http://localhost:8000${res.data.image}`);
        }
      });
    }
  }, [localStorage.getItem("updated")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleStartTest = (subjectId) => {
    navigate(`/test/${subjectId}`);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
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
              <button className="auth-btn logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="auth-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="auth-btn signup" onClick={() => navigate("/register")}>Sign Up</button>
            </>
          )}
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav>
          <ul>
            <li><FaUserGraduate className="icon" /> Dashboard</li>
            <li onClick={() => navigate("/subjects")}><FaBook className="icon" /> Tests</li>
            <li onClick={() => navigate("/view-profile")}><FaUserGraduate className="icon" /> View Profile</li>
            <li onClick={() => navigate("/edit-profile")}><FaPen className="icon" /> Edit Profile</li>
            <li onClick={() => navigate("/faq")}><FaQuestionCircle className="icon" /> FAQ</li>
            <li onClick={() => navigate("/about")}><FaInfoCircle className="icon" /> About Us</li>
            <li onClick={() => navigate("/contact")}><FaEnvelope className="icon" /> Contact Us</li>
          </ul>
        </nav>
      </aside>

      <main className={`home-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="subject-page-header">
          <h1 className="subject-page-title">Mock Tests</h1>
          <p className="subject-page-subtitle">Choose a subject below to start your test</p>
        </div>

        <div className="subject-page-grid">
          {subjects.map(subject => (
            <div
              key={subject.id}
              className="subject-card-modern"
              onClick={() => handleStartTest(subject.id)}
            >
              <div className="subject-card-icon">
                <FaClipboardList size={30} />
              </div>
              <h2 className="subject-card-title">{subject.name}</h2>
              <p className="subject-card-description">Test your knowledge in this subject.</p>
              <button className="subject-card-button">Take Test</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;