import React, { useEffect, useState } from "react";
import ManageSubjectsPage from "./ManageSubjectsPage";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaQuestionCircle,
  FaChartBar,
  FaListAlt,
  FaUserShield,
  FaSignOutAlt,
  FaUser,
  FaBookOpen,
} from "react-icons/fa";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import ManageUsers from "./ManageUsers";
import ManageQuestions from "./ManageQuestions";
import ViewAnalyticsPage from "./ViewAnalyticsPage";
import "../../styles/AdminDashboard.css";
import api from "../../services/api";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalSubjects: 0,
    testsTakenToday: 0,
  });

  const [userDist, setUserDist] = useState({ active: 0, inactive: 0 });
  const [topSubjects, setTopSubjects] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    api.get("admin/stats/").then((res) => setStats(res.data));
    api.get("admin/user-distribution/").then((res) => setUserDist(res.data));
    api.get("admin/top-subjects/").then((res) => setTopSubjects(res.data));
    api.get("admin/top-new-users/")
      .then((res) => setNewUsers(res.data))
      .catch((err) => console.error("Top new users fetch failed", err));
  }, []);

  const pieData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [userDist.active, userDist.inactive],
        backgroundColor: ["#4FC3F7", "#FF8A65"],
      },
    ],
  };

  const barData = {
    labels: topSubjects.map((s) => s.name),
    datasets: [
      {
        label: "Correct Answers",
        data: topSubjects.map((s) => s.correct_answers),
        backgroundColor: "#5C6BC0",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <FaUser size={40} />
          <h3>Admin Panel</h3>
          <span>Administrator</span>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => setSelectedSection("manage-users")}>
            <FaUsers /> <span>Manage Users</span>
          </li>
          <li onClick={() => setSelectedSection("dashboard")}>
            <FaChartBar /> <span>Dashboard</span>
          </li>
          <li onClick={() => setSelectedSection("manage-subjects")}>
            <FaBookOpen /> <span>Manage Subjects</span>
          </li>
          <li onClick={() => setSelectedSection("manage-questions")}>
            <FaQuestionCircle /> <span>Manage Questions</span>
          </li>
          <li onClick={() => setSelectedSection("analytics")}>
            <FaUserShield /> <span>Update Status</span>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Body */}
      <main className="dashboard-main">
        {selectedSection === "dashboard" && (
          <>
            <h1>Admin Dashboard</h1>

            <div className="dashboard-stats">
              <div className="stat-box box1">
                <FaUsers size={28} />
                <div>
                  <h2>{stats.totalUsers}</h2>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-box box2">
                <FaQuestionCircle size={28} />
                <div>
                  <h2>{stats.totalQuestions}</h2>
                  <p>Total Questions</p>
                </div>
              </div>
              <div className="stat-box box3">
                <FaListAlt size={28} />
                <div>
                  <h2>{stats.totalSubjects}</h2>
                  <p>Total Subjects</p>
                </div>
              </div>
              <div className="stat-box box4">
                <FaChartBar size={28} />
                <div>
                  <h2>{stats.testsTakenToday}</h2>
                  <p>Tests Today</p>
                </div>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-box small-chart">
                <h3>User Activity</h3>
                <div style={{ width: "260px", height: "260px", margin: "0 auto" }}>
                  <Pie
                    data={pieData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "bottom" },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="chart-box small-chart">
                <h3>Top Subjects</h3>
                <div style={{ width: "100%", height: "280px" }}>
                  <Bar
                    data={barData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-table">
              <h3>Top New Users</h3>
              {newUsers.length === 0 ? (
                <p>No new users found.</p>
              ) : (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Date Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.date_joined}</td>
                        <td>
                          <span
                            className={`status ${
                              user.is_active ? "active" : "inactive"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        {selectedSection === "analytics" && <ViewAnalyticsPage />} 
        {selectedSection === "manage-users" && <ManageUsers />} 
        {selectedSection === "manage-questions" && <ManageQuestions />} 
        {selectedSection === "manage-subjects" && <ManageSubjectsPage />} 
      </main>
    </div>
  );
};

export default AdminDashboard;
