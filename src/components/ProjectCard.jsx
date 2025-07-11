import React from 'react';
import './ProjectCard.css';

export default function ProjectCard({ title, category, goal_amount, onClick }) {
  return (
    <div className="project-card">
      <div className="project-inner">
        <h2 className="title">{title}</h2>
        <p className="category">{category}</p>
        <p className="goal-text">Ціль: {goal_amount} грн</p>
        <div className="button-container">
          <button className="join-btn" onClick={onClick}>Долучитися</button>
        </div>
      </div>
    </div>
  );
}
