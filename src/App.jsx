import { useState, lazy, Suspense } from "react";
import { supabase } from "./lib/supabase";
import VideoModal from "./components/VideoModal";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import AdminPanel from "./pages/admin/AdminPanel";
import AudioPlayer from "./components/AudioPlayer";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/global.css";
import "./styles/landing.css";
import "./styles/main.css";
import "./styles/components.css";
import "./styles/admin.css";

const StormCanvas = lazy(() => import("./components/StormCanvas"));
const isAdmin = window.location.pathname === "/admin";

export default function App() {
  const [loading, setLoading]         = useState(true);
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
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Suspense fallback={null}>
        <StormCanvas />
      </Suspense>
      {!loading && page === "landing" && (
        <LandingPage
          onEnter={() => setPage("main")}
          email={email} setEmail={setEmail}
          submitted={submitted} onSubmit={handleSubmit}
        />
      )}
      {!loading && page === "main" && (
        <MainPage
          onLogoClick={() => setPage("landing")}
          email={email} setEmail={setEmail}
          submitted={submitted} onSubmit={handleSubmit}
          onVideoClick={setActiveVideo}
        />
      )}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <AudioPlayer />
    </div>
  );
}
