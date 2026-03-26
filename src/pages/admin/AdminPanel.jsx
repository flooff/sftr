import { useState } from "react";
import VideosTab from "./tabs/VideosTab";
import ShowsTab from "./tabs/ShowsTab";
import SubscribersTab from "./tabs/SubscribersTab";

const TABS = [
  { key: "videos",      label: "Videos" },
  { key: "shows",       label: "Shows" },
  { key: "subscribers", label: "Subscribers" },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("videos");

  return (
    <div className="admin">
      <div className="admin-topbar">
        <div className="admin-topbar-title">SFTR — Admin</div>
      </div>
      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`admin-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-body">
        {tab === "videos"      && <VideosTab />}
        {tab === "shows"       && <ShowsTab />}
        {tab === "subscribers" && <SubscribersTab />}
      </div>
    </div>
  );
}

