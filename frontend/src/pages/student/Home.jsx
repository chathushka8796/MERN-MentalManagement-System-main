import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/activities')
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the activities!', error);
      });
  }, []);

  const handleStartConversation = () => {
    navigate('/Student/subjects/next');
  };

  return (
    <div className="container">
      <div className="header-bar"></div>
      <div className="header">
        
      </div>
      <div className="content">
        <h1>Welcome to Mind-Well</h1>
        <p>We're here to support you on your mental health journey. Take a moment to check in and let us know how you're feeling today. Your well-being matters to us.</p>
        <button onClick={handleStartConversation}>Start Conversation</button>
        <div className="activities">
          {activities.map(activity => (
            <div key={activity._id} className="activity-item">
              <h2>{activity.title}</h2>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
