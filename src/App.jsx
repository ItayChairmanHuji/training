import { useState, useEffect } from "react";
import questions from "./questions.json";

export default function DLInterviewTrainer() {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [answered, setAnswered] = useState(() => {
    const stored = localStorage.getItem("answered") || "{}";
    return JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem("answered", JSON.stringify(answered));
  }, [answered]);

  const question = questions[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % questions.length);
    setUserAnswer("");
    setShowSolution(false);
  };

  const handleMark = () => {
    setAnswered((prev) => ({ ...prev, [question.id]: true }));
    setShowSolution(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>{question.id}</h2>
      <p><strong>Topic:</strong> {question.chapter || "N/A"}</p>
      <pre>{question.question}</pre>
      <textarea
        rows={6}
        style={{ width: '100%', marginTop: 8 }}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Write your answer here..."
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleMark} style={{ marginRight: 8 }}>Show Solution</button>
        <button onClick={handleNext}>Next</button>
      </div>
      {showSolution && (
        <div style={{ background: '#eef8ee', padding: 12, marginTop: 12 }}>
          <strong>Solution:</strong>
          <pre>{question.solution}</pre>
        </div>
      )}
    </div>
  );
}
