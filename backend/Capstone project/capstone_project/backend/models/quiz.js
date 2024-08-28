import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  answers: [AnswerSchema],
});

const Quiz = mongoose.model('Quiz', QuizSchema);

export default Quiz;
