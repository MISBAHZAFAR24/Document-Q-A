function AnswerBox({ answer }) {
  if (!answer) {
    return null;
  }

  return (
    <div className="answer-box">
      <h3>🤖 AI Answer</h3>

      <p className="answer-text">
        {answer}
      </p>
    </div>
  );
}

export default AnswerBox;