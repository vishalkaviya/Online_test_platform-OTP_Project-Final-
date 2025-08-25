import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrash,
  FaChartPie,
} from "react-icons/fa";
import api from "../../services/api";
import Swal from "sweetalert2";
import { Chart } from "chart.js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/ManageSubjectPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    api
      .get("/admin/subjects/")
      .then((res) => {
        console.log("✅ Subjects Data:", res.data);
        setSubjects(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch subjects:", err);
      });
  };

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      subjects.filter((s) => s.name.toLowerCase().includes(term))
    );
  }, [search, subjects]);

  const handleClickSubject = (subject) => {
    Swal.fire({
      title: `${subject.name} Stats`,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <canvas id="chart1" width="380" height="380" style="margin-bottom: 30px;"></canvas>
          <canvas id="chart2" width="320" height="320"></canvas>
        </div>`,
      didOpen: () => {
        setTimeout(() => {
          const ctx1 = document.getElementById("chart1")?.getContext("2d");
          const ctx2 = document.getElementById("chart2")?.getContext("2d");

          if (ctx1) {
            new Chart(ctx1, {
              type: "pie",
              data: {
                labels: ["Easy", "Medium", "Hard"],
                datasets: [{
                  label: "Difficulty",
                  data: [
                    subject.easy_count ?? 0,
                    subject.medium_count ?? 0,
                    subject.hard_count ?? 0,
                  ],
                  backgroundColor: ["#81C784", "#FFB74D", "#E57373"],
                }],
              },
              options: {
                responsive: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            });
          }

          if (ctx2) {
            const correct = subject.correct_count ?? 0;
            const wrong = subject.wrong_count ?? 0;

            if (correct + wrong === 0) {
              document.getElementById("chart2").remove();
              const msg = document.createElement("p");
              msg.innerText = "No accuracy data available.";
              msg.style.textAlign = "center";
              document.querySelector(".swal2-html-container").appendChild(msg);
              return;
            }

            new Chart(ctx2, {
              type: "doughnut",
              data: {
                labels: ["Correct", "Incorrect"],
                datasets: [{
                  label: "Accuracy",
                  data: [correct, wrong],
                  backgroundColor: ["#4CAF50", "#F44336"],
                }],
              },
              options: {
                responsive: false,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            });
          }
        }, 100);
      },
    });
  };

  const handleStatusChart = () => {
    const labels = subjects.map((s) => s.name);
    const data = subjects.map((s) => s.total_questions);

    Swal.fire({
      title: "Subject-wise Question Count",
      html: `<div style="display: flex; justify-content: center;"><canvas id="statusChart" width="420" height="340"></canvas></div>`,
      didOpen: () => {
        setTimeout(() => {
          const ctx = document.getElementById("statusChart")?.getContext("2d");
          if (ctx) {
            new Chart(ctx, {
              type: "doughnut",
              data: {
                labels,
                datasets: [{
                  label: "# of Questions",
                  data,
                  backgroundColor: [
                    "#4DB6AC", "#FFB74D", "#9575CD",
                    "#AED581", "#F06292", "#4DD0E1",
                    "#FFF176", "#BA68C8",
                  ],
                }],
              },
              options: {
                responsive: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            });
          }
        }, 100);
      },
    });
  };

  const handleAddSubject = () => {
    Swal.fire({
      title: "Add Subject",
      html: `<input id="subject-name" class="swal2-input" placeholder="Enter subject name" />`,
      showCancelButton: true,
      confirmButtonText: "Add",
      preConfirm: () => {
        const name = document.getElementById("subject-name").value.trim();
        if (!name) {
          Swal.showValidationMessage("Subject name is required");
          return false;
        }
        return name;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post("/admin/subjects/", { name: result.value })
          .then(fetchSubjects)
          .catch((err) => console.error("❌ Add Subject Error:", err));
      }
    });
  };

  const handleEditSubject = (subject) => {
    Swal.fire({
      title: "Edit Subject",
      html: `<input id="edit-subject-name" class="swal2-input" value="${subject.name}" placeholder="Enter new subject name" />`,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const newName = document.getElementById("edit-subject-name").value.trim();
        if (!newName) {
          Swal.showValidationMessage("Subject name cannot be empty");
          return false;
        }
        return newName;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .put(`admin/subjects/${subject.id}/`, { name: result.value })
          .then(fetchSubjects)
          .catch((err) =>
            console.error("❌ Edit Subject Error:", err)
          );
      }
    });
  };

  return (
    <div className="subject-container">
      <div className="subject-header">
        <h2>Manage Subjects</h2>

        <div className="subject-controls">
          <div className="subject-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-status" onClick={handleStatusChart}>
            <FaChartPie /> Status
          </button>

          <button className="btn-add" onClick={handleAddSubject}>
            <FaPlus /> Add Subject
          </button>
        </div>
      </div>

      <div className="subject-grid">
        {filtered.map((subject) => (
          <div
            className="subject-card"
            key={subject.id}
            onClick={() => handleClickSubject(subject)}
          >
            <div className="subject-initial">{subject.name[0]}</div>
            <div className="subject-info">
              <h4>{subject.name}</h4>
              <p>Total Questions: {subject.total_questions}</p>
            </div>
            <div className="subject-actions">
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSubject(subject);
                }}
              >
                <FaPen />
              </button>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  Swal.fire({
                    icon: "warning",
                    title: "Delete this subject?",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      api
                        .delete(`admin/subjects/${subject.id}/`)
                        .then(fetchSubjects)
                        .catch((err) =>
                          console.error("❌ Delete Subject Error:", err)
                        );
                    }
                  });
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
