import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, Snackbar, Alert, InputAdornment } from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SearchIcon from '@mui/icons-material/Search';
import './QuizTable.css';

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/quizRouter');
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const handleEdit = (quizIndex) => {
    setEditQuiz(filteredQuizzes[quizIndex]);
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
      setFilteredQuizzes(response.data);
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
      setFilteredQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
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

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const input = document.querySelector('.quiz-table');

    await html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('quizzes_report.pdf');
    });
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" color="primary" onClick={downloadPDF}>Download PDF Report</Button>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map((quiz, index) => (
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
