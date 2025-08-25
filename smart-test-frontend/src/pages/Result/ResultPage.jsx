// src/pages/User/ResultPage.jsx
import React, { useEffect, useState } from "react";
import "../../styles/ResultPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/result/?user_id=${userId}`)
      .then((response) => setResultData(response.data))
      .catch(() => setError("Failed to fetch result. Please try again."));
  }, []);

  const handleBack = () => {
    navigate("/subjects");
  };

  if (error) {
    return (
      <div className="result-page">
        <div className="result-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={handleBack}>
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="result-page">
        <div className="result-container">
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  const {
    username,
    total_questions,
    correct_answers,
    wrong_answers,
    percentage,
    passed,
  } = resultData;

  return (
    <div className="result-page">
      <div className="result-container">
        <h1 className="result-title">
          {passed ? "Excellent Performance!" : "Better Luck Next Time"}
        </h1>
        <p className="result-subtext">
          {passed
            ? "Good job! You've successfully passed your test. Keep up the great work!"
            : "Don't worry! Practice more and you'll pass the next time."}
        </p>

        <div className="result-progress">
          <svg width="160" height="160">
            <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="15" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={passed ? "#22c55e" : "#ef4444"}
              strokeWidth="15"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 440} 440`}
              transform="rotate(-90 80 80)"
              strokeLinecap="round"
            />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="22" fontWeight="bold">
              {percentage}%
            </text>
          </svg>
        </div>

        <div className="stat-grid">
          <div className="stat-box green">
            <p className="stat-value">{total_questions}</p>
            <p className="stat-label">Total Questions</p>
          </div>
          <div className="stat-box blue">
            <p className="stat-value">{correct_answers}</p>
            <p className="stat-label">Correct Answers</p>
          </div>
          <div className="stat-box red">
            <p className="stat-value">{wrong_answers}</p>
            <p className="stat-label">Wrong Answers</p>
          </div>
          <div className="stat-box purple">
            <p className="stat-value">{percentage}%</p>
            <p className="stat-label">Overall Percentage</p>
          </div>
        </div>

        <div className="result-msg">
          {passed ? (
            <div className="success">
              <FaCheckCircle className="status-icon pass" />
              <h2>{username}, You Passed!</h2>
            </div>
          ) : (
            <div className="failure">
              <FaTimesCircle className="status-icon fail" />
              <h2>Sorry {username}, You Failed.</h2>
            </div>
          )}
        </div>

        <button className="back-btn" onClick={handleBack}>
          Back to Subjects
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
