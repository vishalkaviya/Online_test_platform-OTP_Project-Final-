import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      <style>{`
        .about-header {
          text-align: center;
          background-color: #e49febff;
          color: #333;
          padding: 50px 20px;
          border-radius: 8px;
        }

        .about-header h1 {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .call-button {
          background-color: #c834dbff;
          color: white;
          padding: 10px 20px;
          margin-top: 15px;
          display: inline-block;
          border-radius: 5px;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .call-button:hover {
          background-color: #2980b9;
        }

        .about-content {
          display: flex;
          justify-content: center;
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .about-text {
          text-align: center;
          max-width: 700px;
        }

        .section-title {
          text-align: center;
          margin: 50px 0 20px;
          font-size: 28px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
          max-width: 1000px;
          margin: 0 auto 60px;
          padding: 0 20px;
        }

        .image-card {
          text-align: center;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background: white;
          transition: transform 0.3s ease;
        }

        .image-card:hover {
          transform: translateY(-5px);
        }

        .image-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .image-card p {
          padding: 10px 0;
          font-weight: bold;
          background-color: #f4f4f4;
          margin: 0;
        }

        .back-button {
          display: block;
          margin: 30px auto 50px;
          background-color: #b728cdff;
          color: white;
          padding: 12px 25px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #a04594ff;
        }
      `}</style>

      {/* Header */}
      <div className="about-header">
        <h1>About Us</h1>
        <p>A Smart Online Test Platform Since 2025</p>
        <a href="tel:+4313503992" className="call-button">Call (+431) 350-3992</a>
      </div>

      {/* About Content */}
      <div className="about-content">
        <div className="about-text">
          <h3>SINCE 2025</h3>
          <h2>We Are A Smart Online Test Platform</h2>
          <p>
            Our platform provides secure, scalable, and user-friendly online exams.
            Institutions and companies can easily conduct tests, manage students, and evaluate performance.
          </p>
          <p>
            <strong>As a trusted testing solution,</strong> we ensure reliability, accuracy, and smooth exam experience.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <h2 className="section-title">Our Services</h2>
      <div className="image-grid">
        <div className="image-card">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
            alt="Online Exam"
          />
          <p>Online Exam</p>
        </div>
        <div className="image-card">
          <img
            src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80"
            alt="Test Preparation"
          />
          <p>Test Preparation</p>
        </div>
        <div className="image-card">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80"
            alt="Student Focused"
          />
          <p>Student Focused</p>
        </div>
        <div className="image-card">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
            alt="Smart Interface"
          />
          <p>Smart Interface</p>
        </div>
      </div>

      {/* Back to Home Button */}
      <button className="back-button" onClick={handleBack}>⬅Back to Home</button>
    </div>
  );
};

export default About;