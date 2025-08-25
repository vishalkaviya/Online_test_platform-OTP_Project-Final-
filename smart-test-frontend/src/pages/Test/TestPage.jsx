import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/TestPage.css';
import { useNavigate, useParams } from 'react-router-dom';

const TestPage = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const questionLimit = 8;

  const navigate = useNavigate();
  const { subjectId } = useParams();
  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    startTest();
  }, []);

  const startTest = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/start-test/', {
        user_id: userId,
        subject_id: subjectId,
      });
      fetchNextQuestion();
    } catch (err) {
      console.error("Start test failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/get-question/?user_id=${userId}`
      );
      setQuestion(res.data);
      setSelectedOption(null);
    } catch (err) {
      if (err.response?.data?.finished) {
        navigate('/result');
      } else {
        console.error("Fetch question error", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !question) {
      alert("Please select an option.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/submit-answer/', {
        user_id: userId,
        question_id: question.id,
        selected_option_id: selectedOption,
      });

      if (res.data.finished) {
        navigate('/result');
      } else {
        setCurrentProgress((prev) => prev + 1);
        fetchNextQuestion();
      }
    } catch (err) {
      console.error("Submit answer failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !question) {
    return <div className="loading-container">Loading Question...</div>;
  }

  return (
    <div className="body">
      <div className="test-container">
        <div className="question-card">
          <div className="question-header">
            <h2>MOCK TEST</h2>
          </div>

          <div className="question-body">
            <div className="question-box">
              <p className="question-text">{question.question_text}</p>
            </div>
            <div className="options-list">
              {question.options.map((opt, index) => {
                const labels = ['A', 'B', 'C', 'D'];
                return (
                  <label
                    key={opt.id}
                    className={`option-item ${selectedOption === opt.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={opt.id}
                      checked={selectedOption === opt.id}
                      onChange={() => setSelectedOption(opt.id)}
                      hidden
                    />
                    <div className={`option-label label-${labels[index]}`}>{labels[index]}</div>
                    <div className="option-text">{opt.text}</div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="question-footer">
            <button className="submit-btn" onClick={handleSubmitAnswer}>
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
