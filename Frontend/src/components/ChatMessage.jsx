function ChatMessage({ question, answer }) {
  return (
    <div className="answer-box">
      <p>
        <strong>You:</strong> {question}
      </p>

      <br />

      <p>
        <strong>AI:</strong> {answer}
      </p>
    </div>
  );
}

export default ChatMessage;