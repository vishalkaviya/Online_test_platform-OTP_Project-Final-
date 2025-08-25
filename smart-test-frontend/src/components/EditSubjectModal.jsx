import React, { useState } from "react";
import "../styles/SubjectsPage.css";

export default function EditSubjectModal({ subject, onClose, onUpdate }) {
  const [name, setName] = useState(subject.name);

  const handleUpdate = () => {
    if (!name.trim()) return alert("Subject name required");
    onUpdate(subject.id, name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit Subject</h3>
        <input
          type="text"
          placeholder="Update subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="save-btn" onClick={handleUpdate}>Update</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
