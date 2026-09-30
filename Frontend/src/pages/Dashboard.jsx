import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalQuestions: 0,
    aiAnswers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const { data } = await API.get("/dashboard/stats");
        if (active) setStats(data);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load dashboard");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar title="Dashboard" />

        {error && <p className="error-message">{error}</p>}

        <div className="stats-grid" aria-busy={loading}>

          <div className="stat-card">
            <h3>Total Documents</h3>
            <p>{loading ? "..." : stats.totalDocuments}</p>
          </div>

          <div className="stat-card">
            <h3>Total Questions</h3>
            <p>{loading ? "..." : stats.totalQuestions}</p>
          </div>

          <div className="stat-card">
            <h3>AI Answers</h3>
            <p>{loading ? "..." : stats.aiAnswers}</p>
          </div>

        </div>

        <div className="stat-card">
          <h2>Welcome to Document Q&A 👋</h2>

          <p style={{ marginTop: "12px" }}>
            Upload your documents and ask questions
            using Generative AI.
          </p>
        </div>

      </main>

    </div>
  );
}

export default Dashboard;