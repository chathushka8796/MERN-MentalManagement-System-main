import React, { useState, useEffect } from "react";
import axios from "axios";
import "./quize1.css";
import logoImage3 from "../../assets/sleep.png";
import bgImage3 from "../../assets/quizbg.jpg";

const Quize1 = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [currentAnswerTem, setCurrentAnswerTem] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/quizRouter");
        setQuizzes(response.data);
        setSelectedAnswers(Array(response.data.length).fill(null));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerSelection = (answerIndex) => {
    setCurrentAnswerTem(answerIndex);
    const defaultValues = ["Good", "Excellent", "Not Good", "Bad"];
    if (answerIndex >= 0 && answerIndex < defaultValues.length) {
      setCurrentAnswer(defaultValues[answerIndex]);
    } else {
    }
  };

  const handleNextQuestion = () => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestionIndex] = currentAnswer;
    setSelectedAnswers(updatedSelectedAnswers);

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCurrentAnswer(null);
    setCurrentAnswerTem(null);
  };

  const calculateResult = () => {
    const counts = {
      good: 0,
      excellent: 0,
      "not good": 0,
      bad: 0,
    };

    selectedAnswers.forEach((answer) => {
      if (answer === "Good") {
        counts.good++;
      } else if (answer === "Excellent") {
        counts.excellent++;
      } else if (answer === "Not Good") {
        counts["not good"]++;
      } else if (answer === "Bad") {
        counts.bad++;
      }
    });

    return counts;
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${bgImage3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "130vh",
        display: "flex",
        justifycontent: "center",
        alignitems: "center",
      }}
    >
      <div className="main-rect">
        <div className="sub-rect" src={bgImage3}>
          <h3 className="step" >
            Step {currentQuestionIndex + 1}/{quizzes.length}
          </h3>
          {currentQuestionIndex < quizzes.length ? (
            <>
              <h2 className="quiz-title">
                {quizzes[currentQuestionIndex].title}
              </h2>
              <h2 className="q-1">{quizzes[currentQuestionIndex].question}</h2>
              <div className="answers">
                {quizzes[currentQuestionIndex].answers.map((answer, index) => (
                  <div key={index} className="rect">
                    <img src={logoImage3} className="img2" alt={answer.text} />
                    <button
                      className="answer"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor:
                          currentAnswerTem === index ? "lightblue" : "white",
                        border: "none",
                      }}
                      onClick={() => handleAnswerSelection(index)}
                    >
                      {answer.text}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn"
                disabled={currentAnswer === null}
                onClick={handleNextQuestion}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <h2>Quiz Completed!</h2>
              <p>Results:</p>
              {(() => {
                const result = calculateResult();
                return (
                  <>
                    <p>Good: {result.good}</p>
                    <p>Excellent: {result.excellent}</p>
                    <p>Not Good: {result["not good"]}</p>
                    <p>Bad: {result.bad}</p>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quize1;
