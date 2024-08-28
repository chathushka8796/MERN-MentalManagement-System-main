import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import quizRouter from './routes/quizRouter.js'; // Adjust path if necessary

const port =  4000;
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/quizRouter', quizRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
