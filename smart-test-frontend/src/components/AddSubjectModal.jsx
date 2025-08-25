import React, { useState } from "react";
import "../styles/SubjectsPage.css";

export default function AddSubjectModal({ onClose, onSave }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return alert("Subject name required");
    onSave(name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add New Subject</h3>
        <input
          type="text"
          placeholder="Enter subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="save-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
