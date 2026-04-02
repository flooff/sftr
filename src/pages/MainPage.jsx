import { useState } from "react";
import EmailForm from "../components/EmailForm";
import { useShows } from "../hooks/useShows";
import { useVideos } from "../hooks/useVideos";
import logo from "../assets/sftr-logo.png";


function Shows() {
  const { shows, loading } = useShows();

  if (loading) return (
    <div style={{ color: "rgba(137,55,251,0.4)", padding: "40px 0",
      letterSpacing: "0.2em", fontSize: "0.8rem" }}>
      Loading...
    </div>
  );

  return (
    <div className="f1">
      <div className="section-heading">Upcoming Shows</div>
      {shows.length === 0 && (
        <div style={{ color: "rgba(250,247,254,0.22)", fontSize: "0.85rem" }}>
          No shows scheduled yet.
        </div>
      )}
      {shows.map(s => (
        <div className="show-row" key={s.id}>
          <div className="show-date">{s.date}</div>
          <div className="show-info">
            <div className="show-venue">{s.venue}</div>
            <div className="show-city">{s.city}</div>
          </div>
          <a className="ticket-link" href={s.link} target="_blank" rel="noreferrer">
            Tickets
          </a>
        </div>
      ))}
    </div>
  );
}

function Media({ onVideoClick, email, setEmail, submitted, onSubmit }) {
  const { videos, loading } = useVideos();

  return (
    <div className="f1">
      <div className="section-heading">Videos</div>
      {loading && (
        <div style={{ color: "rgba(137,55,251,0.4)", padding: "20px 0",
          letterSpacing: "0.2em", fontSize: "0.8rem" }}>
          Loading...
        </div>
      )}
      {!loading && videos.length === 0 && (
        <div style={{ color: "rgba(250,247,254,0.22)", fontSize: "0.85rem",
          marginBottom: "32px" }}>
          No videos yet.
        </div>
      )}
      <div className="videos-grid">
        {videos.map(v => (
          <div className="video-card" key={v.id} onClick={() => onVideoClick(v)}>
            <div className="video-thumb-wrap">
              <img
                className="video-thumb-img"
                src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                alt={v.title}
              />
              <div className="video-overlay">
                <div className="play-circle">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#e2c044">
                    <path d="M4 2l10 6-10 6V2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="video-title">{v.title}</div>
          </div>
        ))}
      </div>
      <div className="email-block">
        <div className="email-block-title">Stay Connected</div>
        <div className="email-block-sub">New shows. New drops. Nothing else.</div>
        <EmailForm
          submitted={submitted} onSubmit={onSubmit}
          email={email} setEmail={setEmail}
          submitLabel="Subscribe"
        />
      </div>
    </div>
  );
}

export default function MainPage({ onLogoClick, email, setEmail, submitted, onSubmit, onVideoClick }) {
  const [section, setSection] = useState("shows");

  return (
    <div className="main">
      <div className="topbar">
        <div className="topbar-logo" onClick={onLogoClick}>
          <img
                      src={logo}
                      alt="Shelter From Tha Rain"
                      className="nav-logo"
                    />
        </div>
        <nav className="topbar-nav">
          <button
            className={`nav-btn ${section === "shows" ? "active" : ""}`}
            onClick={() => setSection("shows")}
          >Upcoming Shows</button>
          <button
            className={`nav-btn ${section === "media" ? "active" : ""}`}
            onClick={() => setSection("media")}
          >Media</button>
        </nav>
      </div>
      <div className="content-wrap">
        <div className="content">
          {section === "shows" && <Shows />}
          {section === "media" && (
            <Media
              onVideoClick={onVideoClick}
              email={email} setEmail={setEmail}
              submitted={submitted} onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}