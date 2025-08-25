import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ForgotPassword.css'; // Make sure this CSS file exists

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.detail || 'Password reset successful.');
        setForm({ email: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.detail || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-box">
        <h2>🔐 Reset Password</h2>
        <p className="instruction">Enter your email and new password.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            placeholder="Enter new password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter password"
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="btn-submit">Reset Password</button>

          <div className="back-to-login">
            <Link to="/login">← Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
