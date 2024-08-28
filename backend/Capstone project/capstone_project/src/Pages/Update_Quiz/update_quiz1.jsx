import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import './QuizTable.css';

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [message, setMessage] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/quizRouter'); 
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEdit = (quizIndex) => {
    setEditQuiz(quizzes[quizIndex]);
  };

  const handleCloseModal = () => {
    setEditQuiz(null);
  };

  const handleUpdateQuiz = async () => {
    try {
      await axios.put(`http://localhost:4000/quizRouter/${editQuiz._id}`, editQuiz);
      setEditQuiz(null);
      const response = await axios.get('http://localhost:4000/quizRouter');
      setQuizzes(response.data);
      setMessage('Quiz updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`http://localhost:4000/quizRouter/${quizId}`);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
      setMessage('Quiz deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...editQuiz.answers];
    updatedAnswers[index].text = value;
    setEditQuiz((prev) => ({ ...prev, answers: updatedAnswers }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>
                <ul>
                  {quiz.answers.map((answer, i) => (
                    <li key={i}>{answer.text}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(quiz._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={Boolean(editQuiz)} onClose={handleCloseModal}>
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogContent>
          {editQuiz && (
            <div>
              <TextField
                label="Title"
                name="title"
                value={editQuiz.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <List>
                {editQuiz.answers.map((answer, i) => (
                  <ListItem key={i}>
                    <TextField
                      label={`Answer ${i + 1}`}
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleUpdateQuiz}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default QuizTable;
