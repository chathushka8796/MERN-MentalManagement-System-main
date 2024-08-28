import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NextPage.css';

const NextPage = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const navigate = useNavigate();

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleNextClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/emojis', { emoji: selectedEmoji });
      console.log('Selected emoji saved:', response.data);
      navigate('/'); // Navigate to home page or another page as needed
    } catch (error) {
      console.error('There was an error saving the emoji!', error);
    }
  };

  const emojis = ['😭', '😞','😐', '🙂', '😄'];

  return (
    <div className="app">
      <div className="activities-header">
        <h1>Activities</h1>
      </div>
      <div className="activity-container">
        <div className="question-box">
          <h2>How are you feeling today?</h2>
          <p>Choose an emoji that best represents your current mood:</p>
        </div>
        <div className="emoji-container">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className={`emoji-button ${selectedEmoji === emoji ? 'selected' : ''}`}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
        <button
          className="next-button"
          disabled={selectedEmoji === null}
          onClick={handleNextClick}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default NextPage;
