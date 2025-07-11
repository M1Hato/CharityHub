import React from 'react';
import './MainProjectCard.css';

export default function MainProjectCard({ title, category, description, onClick }) {
  return (

    <div className="main-project-card">
      <div className='inf-card'>
        <div className="main-info">
          <h2 className="main-title">{title}</h2>
          <p className="main-category">{category}</p>
          <p className="main-description">{description}</p>
          <button className="details-btn" onClick={onClick}>Детальніше</button>
        </div>
      </div>

    </div>

  );
}
