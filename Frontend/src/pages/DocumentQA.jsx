import { useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import QuestionBox from "../components/QuestionBox";
import AnswerBox from "../components/AnswerBox";
import CitationCard from "../components/CitationCard";
import API from "../services/api";

function DocumentQA() {

  const { id } = useParams();

  const [answer, setAnswer] = useState("");
  const [citation, setCitation] = useState(null);
  const [error, setError] = useState("");

  const handleAsk = async (question) => {
    if (!id || id === "undefined") {
      setError("This document link is invalid. Please return to Documents and open it again.");
      return;
    }

    try {
      setError("");
      const { data } = await API.post(`/chat/${id}`, { question });
      setAnswer(data.answer);
      setCitation(data.citation);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to answer question");
    }
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar title={`Document #${id}`} />

        <QuestionBox onAsk={handleAsk} />

        {error && <p className="error-message">{error}</p>}

        <AnswerBox answer={answer} />

        <CitationCard citation={citation} />

      </main>

    </div>
  );
}

export default DocumentQA;