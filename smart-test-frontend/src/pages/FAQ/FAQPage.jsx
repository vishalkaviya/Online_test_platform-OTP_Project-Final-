import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './FAQPage.css'; // ✅ Import external CSS

const faqData = [
  { question: 'How are questions categorized?', answer: 'Questions are categorized by difficulty levels: Easy, Medium, and Hard.' },    
  { question: 'How are correct and incorrect attempts tracked?', answer: 'Two fields: correct_count and incorrect_count are incremented per answer attempt.' },
  { question: 'How can I show analytics (charts) to admin?', answer: 'Use chart libraries like Recharts or Chart.js in React and feed data from Django API (e.g., total questions by difficulty).' },   
  { question: 'Can the test adapt to a user’s performance?', answer: 'Yes. The adaptive logic adjusts question difficulty based on previous answers.' },
  { question: 'How are options stored in the database?', answer: 'In a JSONField like:{ "A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4" }' },
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <p className="faq-subheading">
        Find answers to the most common questions about our platform, services, and support.
      </p>

      <div className="faq-grid">
        <div className="flex justify-center">
          <img
            src="/faq-illustration.png"
            alt="FAQ Illustration"
            className="faq-image"
          />
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item">
              <button onClick={() => toggleAnswer(index)} className="faq-button">
                <span>{item.question}</span>
                <span>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="faq-back-button-container">
        <button className="faq-back-button" onClick={() => navigate('/')}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}

export default FAQPage;