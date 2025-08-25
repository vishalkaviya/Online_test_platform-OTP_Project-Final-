import React from "react";
import { FaPen, FaTrash, FaBook } from "react-icons/fa";
import "../styles/SubjectsPage.css";

export default function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <div className="subject-card" onClick={() => alert(`Viewing ${subject.name}`)}>
      <div className="avatar">{subject.name.charAt(0).toUpperCase()}</div>
      <h4>{subject.name}</h4>
      <p><FaBook /> {subject.total_questions} Questions</p>
      <span className={`status ${subject.active ? "active" : "inactive"}`}>
        {subject.active ? "Active" : "Inactive"}
      </span>

      <div className="actions">
        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
          <FaPen />
        </button>
        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
