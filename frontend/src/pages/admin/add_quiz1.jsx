import React, { useState } from 'react';
import axios from 'axios';
import './QuizForm.css'; 

const QuizForm1 = () => {
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');

  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9 ?]*$/;
    return regex.test(value);
  };

  const handleTitleChange = (value) => {
    if (validateInput(value)) {
      setTitle(value);
    }
  };

  const handleAnswerChange = (index, value) => {
    if (validateInput(value)) {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      console.error('Title is required');
      return;
    }
    const newQuiz = { title, answers: answers.map(answer => ({ text: answer })) };
    try {
      await axios.post('http://localhost:4002/quizRouter', newQuiz); 
      setTitle('');
      setAnswers(['', '', '', '']);
      setMessage('Quiz added successfully!');
      setTimeout(() => {
        setMessage('');
      }, 3000); 
    } catch (error) {
      console.error('Error adding quiz:', error);
      setMessage('Error adding quiz. Please try again.');
    }
  };

  return (
    <div>
      <form className="quiz-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => handleTitleChange(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Answers:</label>
          {answers.map((answer, index) => (
            <div key={index} className="answer-group">
              <input 
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <button className="submit-button" type="submit">Add Quiz</button>
        {message && <div className="success-message">{message}</div>}
      </form>
    </div>
  );
};

export default QuizForm1;
