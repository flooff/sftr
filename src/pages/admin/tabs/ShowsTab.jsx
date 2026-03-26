import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useShows } from "../../../hooks/useShows";

const EMPTY = { date: "", venue: "", city: "", link: "" };

function truncate(str, n) {
  if (str.length > n) return str.slice(0, n).concat("...");
  return str;
}

export default function ShowsTab() {
  const { shows, loading, refresh } = useShows();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("shows").insert(form);
    setForm(EMPTY);
    await refresh();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this show?")) return;
    await supabase.from("shows").delete().eq("id", id);
    await refresh();
  };

  return (
    <div>
      <div className="admin-section-title">
        <span>Shows</span>
        {shows.length !== 0 && <span className="admin-count">{shows.length} total</span>}
      </div>

      <form className="admin-form" onSubmit={handleAdd}>
        <div className="admin-form-title">Add Show</div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">Date</label>
            <input className="admin-input" value={form.date} onChange={e => set("date", e.target.value)} placeholder="APR 04" required />
          </div>
          <div className="admin-field">
            <label className="admin-label">Venue</label>
            <input className="admin-input" value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="The Paramount" required />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label className="admin-label">City</label>
            <input className="admin-input" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Seattle, WA" required />
          </div>
          <div className="admin-field">
            <label className="admin-label">Ticket Link</label>
            <input className="admin-input" value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://tickets.com/..." required />
          </div>
        </div>
        <div className="admin-form-actions">
          <button className="admin-submit" type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add Show"}
          </button>
        </div>
      </form>

      {loading && <div className="admin-loading">Loading...</div>}
      {!loading && shows.length === 0 && <div className="admin-empty">No shows yet. Add one above.</div>}
      {!loading && shows.length !== 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Venue</th>
                <th>City</th>
                <th>Ticket Link</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shows.map(s => (
                <tr key={s.id}>
                  <td><span className="admin-badge">{s.date}</span></td>
                  <td>{s.venue}</td>
                  <td>{s.city}</td>
                  <td><a href={s.link} target="_blank" rel="noreferrer" style={{ color: "#8937fb", fontSize: "0.75rem" }}>{truncate(s.link, 28)}</a></td>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td><button className="admin-delete" onClick={() => handleDelete(s.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}