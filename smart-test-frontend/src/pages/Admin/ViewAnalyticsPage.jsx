import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../../styles/ViewAnalyticsPage.css";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#00BCD4", "#9C27B0"];

const ViewAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({});
  const [subject, setSubject] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/get-analytics/")
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;

  if (!analytics || !analytics.subject_stats) {
    return <div className="error">No analytics data found.</div>;
  }

  const subjects = ["All", ...Object.keys(analytics.subject_stats)];
  const currentStats = subject === "All"
    ? { easy: analytics.easy, medium: analytics.medium, hard: analytics.hard }
    : analytics.subject_stats[subject] || { easy: 0, medium: 0, hard: 0 };

  const correct = subject === "All" ? analytics.correct_total : analytics.correct_counts?.[subject] || 0;
  const incorrect = subject === "All" ? analytics.incorrect_total : analytics.incorrect_counts?.[subject] || 0;

  const difficultyData = [
    { name: "Easy", value: currentStats.easy },
    { name: "Medium", value: currentStats.medium },
    { name: "Hard", value: currentStats.hard },
  ];

  const correctIncorrectData = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
  ];

  const genderStats = analytics.gender_stats || {};
  const genderData = Object.entries(genderStats).map(([key, value]) => ({
    name: key,
    value: value.correct + value.incorrect,
  }));

  return (
    <div className="analytics-container">
      <div className="header-row">
        <h1>Analytics Overview</h1>
        <select
          className="subject-dropdown enhanced-dropdown"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {subjects.map((subj, index) => (
            <option key={index} value={subj}>{subj}</option>
          ))}
        </select>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3 className="difficulty-title">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={difficultyData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} label>
                {difficultyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Correct vs Incorrect</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={correctIncorrectData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} label>
                <Cell fill="#4CAF50" />
                <Cell fill="#F44336" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Users by Gender</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} label>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="statistics-summary">
        <h3>Summary</h3>
        <div className="summary-boxes">
          <div className="summary-item item-easy">Total Questions: <strong>{analytics.total_questions}</strong></div>
          <div className="summary-item item-easy">Easy: <strong>{currentStats.easy}</strong></div>
          <div className="summary-item item-medium">Medium: <strong>{currentStats.medium}</strong></div>
          <div className="summary-item item-hard">Hard: <strong>{currentStats.hard}</strong></div>
          <div className="summary-item item-correct">Correct: <strong>{correct}</strong></div>
          <div className="summary-item item-incorrect">Incorrect: <strong>{incorrect}</strong></div>
        </div>
      </div>

      <div className="top-users-section">
        <h2>Recently Active Users</h2>
        <div className="top-users-list">
          {analytics.top_users?.map((user, idx) => (
            <div className="user-card enhanced" key={idx}>
              <div className="user-avatar-wrapper">
                <img
                  src={user.image ? `http://127.0.0.1:8000${user.image}` : "/default-avatar.png"}
                  alt="Profile"
                  className="user-avatar"
                />
              </div>
              <div className="user-info">
                <h4>{user.user}</h4>
                <p><strong>Last Attempt:</strong> {user.last_attempt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAnalyticsPage;
