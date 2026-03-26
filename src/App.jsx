import { useState } from "react";
import { supabase } from "./lib/supabase";
import StormCanvas from "./components/StormCanvas";
import VideoModal from "./components/VideoModal";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import AdminPanel from "./pages/admin/AdminPanel";
import "./styles/global.css";
import "./styles/landing.css";
import "./styles/main.css";
import "./styles/components.css";
import "./styles/admin.css";

const isAdmin = window.location.pathname === "/admin";

export default function App() {
  const [page, setPage]               = useState("landing");
  const [email, setEmail]             = useState("");
  const [submitted, setSubmitted]     = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await supabase.from("subscribers").upsert({ email });
    setSubmitted(true);
    setEmail("");
  };

  if (isAdmin) return <AdminPanel />;

  return (
    <div className="app">
      <StormCanvas />
      {page === "landing" && (
        <LandingPage
          onEnter={() => setPage("main")}
          email={email} setEmail={setEmail}
          submitted={submitted} onSubmit={handleSubmit}
        />
      )}
      {page === "main" && (
        <MainPage
          onLogoClick={() => setPage("landing")}
          email={email} setEmail={setEmail}
          submitted={submitted} onSubmit={handleSubmit}
          onVideoClick={setActiveVideo}
        />
      )}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}