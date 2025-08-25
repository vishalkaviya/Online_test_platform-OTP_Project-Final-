// src/pages/Admin/AddQuestionPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddQuestionPage.css';

const AddQuestionPage = () => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/subjects/")
      .then(res => {
        setSubjects(res.data);
        if (res.data.length > 0) setSubjectId(res.data[0].id);
      });
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = field === "is_correct" ? value === "true" : value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    const data = {
      question_text: questionText,
      subject: subjectId,
      difficulty,
      correct_count: parseInt(correctCount),
      wrong_count: parseInt(wrongCount),
      options: options,
    };

    try {
      await axios.post("http://localhost:8000/api/add-question/", data);
      alert("✅ Question added successfully!");
      setQuestionText("");
      setOptions([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
      setCorrectCount(0);
      setWrongCount(0);
    } catch (err) {
      console.error(err);
      alert("❌ Error adding question.");
    }
  };

  return (
    <div className="add-question-page">
      <div className="add-question-container">
        <div className="header">
          <FaQuestionCircle className="icon" />
          <h2>Add New Question</h2>
        </div>

        <div className="form">
          <div className="form-group">
            <label>Question Text</label>
            <textarea
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Enter the question here..."
              rows={3}
            />
          </div>

          {options.map((opt, index) => (
            <div key={index} className="option-group">
              <input
                type="radio"
                name="correct"
                value="true"
                checked={opt.is_correct}
                onChange={() => {
                  const updated = options.map((o, i) => ({
                    ...o,
                    is_correct: i === index
                  }));
                  setOptions(updated);
                }}
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt.text}
                onChange={e => handleOptionChange(index, "text", e.target.value)}
              />
            </div>
          ))}

          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Correct Count</label>
              <input
                type="number"
                value={correctCount}
                onChange={e => setCorrectCount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Wrong Count</label>
              <input
                type="number"
                value={wrongCount}
                onChange={e => setWrongCount(e.target.value)}
              />
            </div>
          </div>

          <div className="submit-container">
            <button onClick={handleSubmit}>
              <FaPlus className="btn-icon" />
              Add Question
            </button>
            <button onClick={() => navigate('/admin-dashboard')} className="secondary-button">
              <FaArrowLeft className="btn-icon" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;
