import React, { useEffect, useState } from "react";
import "../../styles/EditProfile.css";
import { FaPen } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Added

export default function EditProfile() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate(); // ✅ Added

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;

      const profileData = {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        gender: user.gender,
        dob: user.dob,
        image: user.image,
      };

      setProfile(profileData);

      if (user.image) {
        setPreview(`http://localhost:8000${user.image}`);
      }
    } catch (err) {
      console.error("Fetch profile error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("first_name", profile.first_name);
      form.append("last_name", profile.last_name);
      form.append("mobile", profile.mobile);
      form.append("gender", profile.gender);
      form.append("dob", profile.dob);

      if (profile.image && typeof profile.image !== "string") {
        form.append("image", profile.image);
      }

      await axios.put("http://localhost:8000/api/edit-profile/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("updated", Date.now());
      alert("Profile updated!");
      navigate("/home");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* Form Section */}
        <div className="edit-form-section">
          <div className="profile-image-wrapper">
            <img
              src={preview || "/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="profileUpload" className="edit-icon">
              <FaPen />
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="name-group">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={profile.first_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={profile.last_name}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              readOnly
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              readOnly
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={profile.mobile}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
            />
            <div className="gender-group">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={profile.gender === g}
                    onChange={handleChange}
                  />{" "}
                  {g}
                </label>
              ))}
            </div>
            <button type="submit" className="save-btn">
              Update Profile
            </button>
          </form>
        </div>

        {/* Right Image Section */}
        <div className="edit-image-section">
          <img
            src="/assets/edit.jpg" // ✅ Use the image you uploaded
            alt="Decor"
            className="side-image"
          />
          <p className="quote-text">
            "Your profile is your identity. Keep it fresh!"
          </p>
          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
