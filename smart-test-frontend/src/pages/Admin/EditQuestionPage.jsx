// src/pages/Admin/EditQuestion.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/EditQuestion.css";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get(`admin/questions/${id}/`).then((res) => {
      setQuestion(res.data);
    });
    api.get("admin/subjects/").then((res) => setSubjects(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index][field] = field === "is_correct" ? value === "true" : value;
    setQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`admin/questions/${id}/`, question).then(() =>
      alert("Question updated successfully")
    );
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="edit-question-container">
      <form onSubmit={handleSubmit} className="edit-question-form">
        <h2>Edit Question</h2>

        <select name="subject" value={question.subject} onChange={handleChange}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select name="difficulty" value={question.difficulty} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <textarea
          name="question_text"
          value={question.question_text}
          onChange={handleChange}
          placeholder="Enter question"
        />

        <h4>Options:</h4>
        {question.options.map((opt, idx) => (
          <div key={idx} className="option-group">
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
              placeholder={`Option ${idx + 1}`}
            />
            <select
              value={opt.is_correct ? "true" : "false"}
              onChange={(e) => handleOptionChange(idx, "is_correct", e.target.value)}
            >
              <option value="false">Wrong</option>
              <option value="true">Correct</option>
            </select>
          </div>
        ))}

        <div className="edit-actions">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="back-home-btn" onClick={() => navigate('/admin-dashboard')}>
   Back to Dashbord
</button>

        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
