import express from 'express';
import Quiz from '../models/quiz.js'; // Adjust the path to where quiz.js is located

const router = express.Router();

// Route to handle creating quizzes
router.post('/', async (req, res) => {
  const { title, answers } = req.body;

  try {
    const newQuiz = new Quiz({ title, answers });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Route to handle fetching quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, answers } = req.body;

  try {
    // Find the quiz by its ID and update its title and answers
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { title, answers }, { new: true });

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

export default router;
