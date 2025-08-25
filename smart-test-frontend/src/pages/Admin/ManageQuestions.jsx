import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../../styles/ManageQuestions.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);

  const fetchQuestions = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedSubject) params.subject = selectedSubject;
    if (difficulty) params.difficulty = difficulty;

    api
      .get("admin/questions/", { params })
      .then((res) => setQuestions(res.data))
      .catch(console.error);
  };

  const fetchSubjects = () => {
    api
      .get("admin/subjects/")
      .then((res) => setSubjects(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSubjects();
    fetchQuestions();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm, selectedSubject, difficulty]);

  const handleDelete = (id) => {
  api.delete(`admin/questions-detail/${id}/`)
    .then(() => fetchQuestions())
    .catch((err) => {
      console.error("Delete error:", err);
    });
};

  const openChart = (q) => {
    setChartData({
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          label: "Answers",
          data: [q.correct_count, q.wrong_count],
          backgroundColor: ["#4CAF50", "#F44336"],
          borderWidth: 1,
        },
      ],
    });
    setShowChart(true);
  };

  return (
    <div className="mq-container">
      <div className="mq-header">
        <h2>Manage Questions</h2>
        <div className="mq-controls">
          <div className="mq-search">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="mq-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="mq-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            className="btn-add"
            onClick={() => (window.location.href = "/admin/add-question")}
          >
            <FaPlus /> Add Question
          </button>
        </div>
      </div>

      <div className="mq-list">
        {questions.length === 0 && (
          <p className="no-results">No questions found.</p>
        )}
        {questions.map((q) => (
          <div key={q.id} className="mq-card">
            <div className="mq-left">
              <div className="mq-subject">{q.subject?.name || "Unknown"}</div>
              <div className="mq-text">{q.question_text}</div>
              <div className="mq-stats">
                <span>Difficulty: {q.difficulty}</span>
                <span>
                  ✔ {q.correct_count} | ✘ {q.wrong_count}
                </span>
              </div>
            </div>

            <div className="mq-actions">
              <button
                className="status-btn"
                onClick={() => openChart(q)}
                title="View Pie Chart"
              >
                ✅ {q.correct_count} | ❌ {q.wrong_count}
              </button>
              <FaEdit
                title="Edit"
                onClick={() =>
                  (window.location.href = `/admin/edit-question/${q.id}`)
                }
              />
              <FaTrash title="Delete" onClick={() => handleDelete(q.id)} />
            </div>
          </div>
        ))}
      </div>

      {showChart && (
        <div className="chart-modal">
          <div className="chart-box">
            <h3>Question Analysis</h3>
            <Pie data={chartData} />
            <button className="close-btn" onClick={() => setShowChart(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
