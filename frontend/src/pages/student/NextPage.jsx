import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './NextPage.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download'; // Importing DownloadIcon

const NextPage = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [questionText, setQuestionText] = useState(''); // State to hold the quiz question
  const navi = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get('http://localhost:5001/quiz');
      if (response.data.length > 0) {
        setQuestionText(response.data[0].questionText); // Set the quiz question text
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    console.log('Selected emoji:', emoji);
  };

  const handleNextClick = async () => {
    if (!selectedEmoji) {
      console.error('No emoji selected');
      return;
    }

    try {
      console.log('Sending request to save emoji...');
      const response = await axios.post('http://localhost:5001/emojis', { emoji: selectedEmoji });
      console.log('Selected emoji saved:', response.data);
      navi('/Student/subjects/next/quize1');
    } catch (error) {
      console.error('There was an error saving the emoji!', error);
    }
  };

  const handleDownloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('report.pdf');
    });
  };

  const emojis = ['😭', '😞', '😐', '🙂', '😄'];

  return (
    <div className="app">
      <div className="activity-container" ref={reportRef}>
        <div className="question-box">
          <h2>{questionText || 'Loading question...'}</h2> {/* Display the quiz question */}
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
        <Button
  variant="contained"
  size="small"
  startIcon={<DownloadIcon />}
  onClick={handleDownloadPDF}
  sx={{ mt: 2 }}
  className="download-button" // Add this class
> 
</Button>

      </div>
    </div>
  );
};

export default NextPage;
