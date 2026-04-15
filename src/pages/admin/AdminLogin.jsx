import { useState } from "react";

const PASSWORD = "sftr2024";

export default function AdminLogin({ onAuth }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === PASSWORD) {
      sessionStorage.setItem("sftr_admin", "1");
      onAuth();
    } else {
      setError(true);
      setPwd("");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#08011a",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "24px",
    }}>
      <div style={{
        fontFamily: "'Genos', sans-serif",
        fontSize: "1.2rem",
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.6)",
        textTransform: "uppercase",
      }}>Admin Access</div>

      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column",
        gap: "16px", width: "280px",
      }}>
        <input
          type="password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false); }}
          placeholder="Password"
          style={{
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${error ? "#ff4444" : "rgba(255,255,255,0.2)"}`,
            color: "#ffffff",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "1rem",
            padding: "10px 0",
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.2em",
          }}
        />
        {error && (
          <div style={{
            color: "#ff4444", fontSize: "0.72rem",
            letterSpacing: "0.2em", textAlign: "center",
            textTransform: "uppercase",
          }}>Wrong password</div>
        )}
        <button type="submit" style={{
          background: "transparent",
          border: "1px solid rgba(226,192,68,0.6)",
          color: "#e2c044",
          fontFamily: "'Barlow', sans-serif",
          fontSize: "0.72rem",
          fontWeight: "700",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "12px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}>Enter</button>
      </form>
    </div>
  );
}