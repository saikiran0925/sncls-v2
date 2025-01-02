import React from 'react';
import '../css/Card.css';

const Card = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">William Smith</h3>
        <span className="card-timestamp">about 1 year ago</span>
      </div>
      <h4 className="card-subtitle">Meeting Tomorrow</h4>
      <p className="card-content">
        Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's...
      </p>
    </div>
  );
};

export default Card;
