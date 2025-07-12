import { useState, useEffect } from "react";
import questions from "./questions.json";

// Card and CardContent replacement
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
}

// Button replacement
function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    >
      {children}
    </button>
  );
}

// Textarea replacement
function Textarea({ value, onChange, placeholder = "", className = "" }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
      rows={4}
    />
  );
}

// Badge replacement
function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded ${className}`}
    >
      {children}
    </span>
  );
}


export default function DLInterviewTrainer() {
  const [answered, setAnswered] = useState(() => {
    const stored = localStorage.getItem("answered") || "{}";
    return JSON.parse(stored);
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("answered", JSON.stringify(answered));
  }, [answered]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const unansweredQuestions = questions.filter((q) => !answered[q.id]);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);
  const filteredQuestions = onlyUnanswered ? unansweredQuestions : questions;
  const [index, setIndex] = useState(0);

  const question = filteredQuestions[index] || { id: "", chapter: "", question: "No questions left!", solution: "" };
  const isAnswered = answered[question.id];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleMark = () => {
    setAnswered((prev) => ({ ...prev, [question.id]: true }));
  };

  const progress = Math.round((Object.keys(answered).length / questions.length) * 100);

  return (
    <div className={`p-6 max-w-4xl mx-auto space-y-6 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm">
            Progress: {Object.keys(answered).length} / {questions.length} ({progress}%)
          </p>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyUnanswered}
              onChange={(e) => {
                setOnlyUnanswered(e.target.checked);
                setIndex(0);
              }}
            />
            Show only unanswered
          </label>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            Dark mode
          </label>
        </div>
        <select
          className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {filteredQuestions.map((q, i) => (
            <option key={q.id} value={i}>
              {q.id} - {q.chapter}
            </option>
          ))}
        </select>
      </div>
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{question.id}</h2>
            <Badge variant="outline" className="text-sm font-medium px-3 py-1">{question.chapter || "Unknown Topic"}</Badge>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{question.question}</p>
          <Textarea
            placeholder="Write your answer here..."
            className="min-h-[120px] border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-4 mt-2">
            <Button onClick={handleMark} variant="secondary">
              {isAnswered ? "View Again" : "Show Solution"}
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 text-white hover:bg-blue-700">
              Next Question
            </Button>
          </div>
          {isAnswered && (
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mt-4 border border-green-300 dark:border-green-600">
              <p className="font-semibold">Solution:</p>
              <p className="whitespace-pre-wrap text-sm">{question.solution}</p>
            </div>
          )}
          {isAnswered && !showSolution && (
            <p className="text-xs text-right text-gray-400 italic mt-2">You answered this before</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
