import { useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import QuestionBox from "../components/QuestionBox";
import ChatMessage from "../components/ChatMessage";
import CitationCard from "../components/CitationCard";
import API from "../services/api";

function DocumentQA() {

  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (question) => {
    if (!id || id === "undefined") {
      setError("This document link is invalid. Please return to Documents and open it again.");
      return;
    }

    try {
      setError("");
      setIsAsking(true);
      const { data } = await API.post(`/chat/${id}`, { question });
      setMessages((current) => [
        ...current,
        {
          id: data._id || `${Date.now()}-${question}`,
          question,
          answer: data.answer,
          citation: data.citation,
        },
      ]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to answer question");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar title={`Document #${id}`} />

        <QuestionBox onAsk={handleAsk} disabled={isAsking} />

        {error && <p className="error-message">{error}</p>}

        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage question={message.question} answer={message.answer} />
            <CitationCard citation={message.citation} />
          </div>
        ))}

      </main>

    </div>
  );
}

export default DocumentQA;