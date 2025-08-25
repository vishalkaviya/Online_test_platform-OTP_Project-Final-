import React, { useEffect, useState } from 'react';
import '../../styles/ViewProfile.css';
import {
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaHeart,
  FaPlane,
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewProfile() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch profile', err));
  }, []);

  if (!data) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="view-container">
      <div className="card">
        <div className="left-section">
          <div className="profile-pic-wrapper">
            <img
              src={
                data.image
                  ? `http://localhost:8000${data.image}`
                  : '/default-profile.png'
              }
              alt="User"
              className="profile-pic"
            />
          </div>
          <h2 className="name">
            {data.first_name || ""} {data.last_name || ""}
          </h2>

          <p className="role">{data.username}</p>
          <p className="quote">
            “Learning never stops. Push forward with every test you take.”
          </p>

          <div className="info-enhanced">
            <div className="info-item">
              <FaBirthdayCake className="info-icon" />
              <span><strong>DOB:</strong> {data.dob || "Not set"}</span>
            </div>
            <div className="info-item">
              <FaHeart className="info-icon" />
              <span><strong>Gender:</strong> {data.gender || "Not set"}</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span><strong>Email:</strong> {data.email || "Not set"}</span>
            </div>
            <div className="info-item">
              <FaPlane className="info-icon" />
              <span><strong>Mobile:</strong> {data.mobile || "Not set"}</span>
            </div>
          </div>

          <div className="tags">
            {['Learner', 'Focused', 'Determined'].map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right side image and button */}
        <div className="right-section center-column">
          <img
            src="/assets/view.jpg" // ✅ Make sure this path matches your public folder
            alt="Checklist"
            className="view-side-image"
          />
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
