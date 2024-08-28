import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css';

const QuizFormg = () => {
  const [questionText, setQuestionText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [message, setMessage] = useState('');
  const [quizId, setQuizId] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get('http://localhost:5001/quiz');
      if (response.data.length > 0) {
        const quiz = response.data[0];
        setQuestionText(quiz.questionText);
        setNewQuestionText(quiz.questionText); // Prefill the input with the existing question
        setQuizId(quiz._id); // Store the quiz ID for updating
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9 ?]*$/;
    return regex.test(value);
  };

  const handleNewQuestionTextChange = (value) => {
    if (validateInput(value)) {
      setNewQuestionText(value);
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      console.error('Question text is required');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/quiz/${quizId}`, {
        questionText: newQuestionText
      });
      setMessage('Quiz updated successfully!');
      fetchQuiz(); // Fetch the updated quiz list
    } catch (error) {
      console.error('Error updating quiz:', error);
      setMessage('Failed to update quiz.');
    }
  };

  return (
    <div>

      <form className="quiz-form" onSubmit={handleUpdateQuiz}>
        <div className="form-group">
          <label>Update Question :</label>
          <input 
            type="text" 
            value={newQuestionText} 
            onChange={(e) => handleNewQuestionTextChange(e.target.value)} 
            required
          />
        </div>
        <button className="submit-button" type="submit">Add Quiz</button>
      </form>

      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default QuizFormg;
