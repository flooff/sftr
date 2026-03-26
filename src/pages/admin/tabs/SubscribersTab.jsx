import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("subscribers").delete().eq("id", id);
    await fetch();
  };

  const handleExport = () => {
    const csv = [
      "email,date",
      ...subscribers.map(s =>
        `${s.email},${new Date(s.created_at).toLocaleDateString()}`
      )
    ].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "subscribers.csv";
    a.click();
  };

  return (
    <div>
      <div className="admin-section-title">
        Subscribers
        {subscribers.length > 0 && (
          <span className="admin-count">{subscribers.length} total</span>
        )}
        {subscribers.length > 0 && (
          <button
            className="admin-export"
            onClick={handleExport}
            style={{ marginLeft: "auto" }}
          >
            Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : subscribers.length === 0 ? (
        <div className="admin-empty">No subscribers yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Date Subscribed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="admin-delete" onClick={() => handleDelete(s.id)}>
                      Remove
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

