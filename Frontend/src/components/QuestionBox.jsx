import { useState } from "react";

function QuestionBox({ onAsk }) {
  const [question, setQuestion] = useState("");

  const handleAsk = () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    onAsk(question);

    setQuestion("");
  };

  return (
    <div className="question-box">
      <h3>Ask a Question</h3>

      <textarea
        placeholder="Ask something about this document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="ask-btn"
        onClick={handleAsk}
      >
        🤖 Ask AI
      </button>
    </div>
  );
}

export default QuestionBox;