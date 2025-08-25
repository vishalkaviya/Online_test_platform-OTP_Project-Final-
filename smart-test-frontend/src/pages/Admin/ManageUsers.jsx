import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import "../../styles/ManageUsers.css";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortType, setSortType] = useState("recent");

  useEffect(() => {
    api
      .get("all-users/")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  const filteredUsers = allUsers
    .filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const searchMatch = username.includes(searchTerm.toLowerCase());

      const gender = user.profile?.gender || "Other";
      const genderMatch = genderFilter === "All" || gender === genderFilter;

      return searchMatch && genderMatch;
    })
    .sort((a, b) => {
      if (sortType === "az") return a.username.localeCompare(b.username);
      if (sortType === "za") return b.username.localeCompare(a.username);
      return new Date(b.date_joined) - new Date(a.date_joined); // recent
    });

  const handleCardClick = (user) => {
    const fullName = `${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`.trim();
    const gender = user.profile?.gender || "Other";
    const dob = user.profile?.dob || "N/A";
    const email = user.email || "N/A";
    const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : "Never";

    alert(
      `👤 ${user.username}\n\nFull Name: ${fullName}\nEmail: ${email}\nDOB: ${dob}\nGender: ${gender}\nLast Login: ${lastLogin}`
    );
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>

      <div className="user-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="gender-filter"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="gender-filter"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="recent">Sort by: Recent</option>
          <option value="az">Sort A-Z</option>
          <option value="za">Sort Z-A</option>
        </select>
      </div>

      <div className="user-card-grid">
        {filteredUsers.map((user) => {
          const image = user.profile?.image;
          const profileImage = image ? `http://localhost:8000${image}` : null;
          const gender = user.profile?.gender || "Other";

          return (
            <div
              className="user-card"
              key={user.id}
              onClick={() => handleCardClick(user)}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <FaUserCircle className="user-icon" />
              )}
              <div className="user-info">
                <h3>{user.username}</h3>
                <p className="user-gender">{gender}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageUsers;
