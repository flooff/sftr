import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useVideos } from "../../../hooks/useVideos";

export default function VideosTab() {
  const { videos, loading, refresh } = useVideos();
  const [title, setTitle]   = useState("");
  const [ytId, setYtId]     = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("videos").insert({ title, youtube_id: ytId });
    setTitle(""); setYtId("");
    await refresh();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("videos").delete().eq("id", id);
    await refresh();
  };

  return (
    <div>
      <div className="admin-section-title">
        Videos
        {videos.length > 0 && <span className="admin-count">{videos.length} total</span>}
      </div>

      <form className="admin-form" onSubmit={handleAdd}>
        <div className="admin-form-title">Add Video</div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">Title</label>
            <input
              className="admin-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Live at The Paramount"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">YouTube ID</label>
            <input
              className="admin-input"
              value={ytId}
              onChange={e => setYtId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              required
            />
          </div>
        </div>
        <p style={{ fontSize: "0.7rem", color: "rgba(137,55,251,0.4)", letterSpacing: "0.05em" }}>
          The YouTube ID is the part after ?v= — e.g. youtube.com/watch?v=<strong style={{ color: "var(--purple)" }}>dQw4w9WgXcQ</strong>
        </p>
        <div className="admin-form-actions">
          <button className="admin-submit" type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add Video"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : videos.length === 0 ? (
        <div className="admin-empty">No videos yet. Add one above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>YouTube ID</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {videos.map(v => (
                <tr key={v.id}>
                  <td>
                    <img
                      className="admin-thumb"
                      src={`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`}
                      alt={v.title}
                    />
                  </td>
                  <td>{v.title}</td>
                  <td><span className="admin-badge">{v.youtube_id}</span></td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(v.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="admin-delete" onClick={() => handleDelete(v.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
