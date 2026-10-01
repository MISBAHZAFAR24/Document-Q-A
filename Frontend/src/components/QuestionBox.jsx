import { useState } from "react";

function QuestionBox({ onAsk, disabled = false }) {
  const [question, setQuestion] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    await onAsk(question.trim());
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
        disabled={disabled}
      >
        {disabled ? "Answering..." : "🤖 Ask AI"}
      </button>
    </div>
  );
}

export default QuestionBox;