import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fafafa' }}>
      {/* Header Section */}
      <div style={{
        backgroundImage: 'url("https://i.pinimg.com/originals/cf/3c/68/cf3c6871cfa17fda7f7db8f823d5f09b.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#fdf2ff',
        padding: '80px 20px 50px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '30px',
          color: '#6a1b9a',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>CONTACT US</h1>

        <p style={{
          fontSize: '18px',
          color: '#333',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Need help with your online exam platform? <br />
          Our team is ready to guide you every step of the way. <br />
          Whether it's test setup or student support, <br />
          we're just a message or call away.
        </p>
      </div>
       

      {/* Contact Info Cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '60px 20px',
        backgroundColor: '#fff',
        textAlign: 'center',
        flexWrap: 'wrap',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Visit */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          margin: '20px',
          padding: '20px',
          backgroundColor: '#f3e5f5',
          borderRadius: '12px'
        }}>
          <i className="fas fa-map-marker-alt" style={{ fontSize: '30px', color: '#6a1b9a' }}></i>
          <h3 style={{ color: '#4a148c' }}>VISIT US</h3>
          <p>No 30, Chennai Theni Highway,<br />Mannarpuram, Tiruchirappalli</p>
          <p style={{ color: '#6a1b9a', fontWeight: 'bold' }}>Tamil Nadu, India - 620020</p>
        </div>

        {/* Call */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          margin: '20px',
          padding: '20px',
          backgroundColor: '#f3e5f5',
          borderRadius: '12px'
        }}>
          <i className="fas fa-phone-alt" style={{ fontSize: '30px', color: '#6a1b9a' }}></i>
          <h3 style={{ color: '#4a148c' }}>CALL US</h3>
          <p>Mon-Fri: 9 AM to 6 PM<br />Weekends: Closed</p>
          <p style={{ color: '#6a1b9a', fontWeight: 'bold' }}>096003 20672</p>
        </div>

        {/* Email */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          margin: '20px',
          padding: '20px',
          backgroundColor: '#f3e5f5',
          borderRadius: '12px'
        }}>
          <i className="fas fa-envelope" style={{ fontSize: '30px', color: '#6a1b9a' }}></i>
          <h3 style={{ color: '#4a148c' }}>EMAIL US</h3>
          <p>Drop us an email anytime<br />We will reply within 24 hours</p>
          <p style={{ color: '#6a1b9a', fontWeight: 'bold' }}>csm@vdartinc.com</p>
        </div>
      </div>

      {/* Google Map */}
      <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
        <iframe
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.226723342908!2d78.68400317481636!3d10.80960708938842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5710e2aa515%3A0x46c34dfc62e6f70f!2sNo%2030%2C%20Chennai%20Theni%20Highway%2C%20Mannarpuram%2C%20Tiruchirappalli%2C%20Tamil%20Nadu%20620020!5e0!3m2!1sen!2sin!4v1722329023971!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Social Icons Footer */}
      <div style={{
        backgroundColor: '#4a148c',
        padding: '30px 0',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        {['fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-linkedin-in'].map((icon, index) => (
          <i
            key={index}
            className={icon}
            style={{
              color: 'white',
              backgroundColor: '#6a1b9a',
              margin: '0 10px',
              padding: '12px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          ></i>
        ))}
      </div>

      {/* Back to Home Button */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <button
          onClick={handleBackHome}
          style={{
            backgroundColor: '#8e24aa',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#6a1b9a'}
          onMouseOut={e => e.target.style.backgroundColor = '#8e24aa'}
        >
         ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
