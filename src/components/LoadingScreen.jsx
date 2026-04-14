import { useState, useEffect } from "react";
import logo from "../assets/sftr-new.webp";

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 2200);
    const t2 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "#08011a", display: "flex",
      alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "32px",
      opacity: phase === "out" ? 0 : 1,
      transition: "opacity 0.8s ease",
      pointerEvents: phase === "out" ? "none" : "all",
    }}>
      <img src={logo} alt="SFTR" style={{
        width: "min(260px, 65vw)", height: "auto",
        mixBlendMode: "screen",
        filter: "drop-shadow(0 0 60px rgba(137,55,251,0.7))",
        animation: "sftrAppear 1s ease forwards", opacity: 0,
      }} />
      <div style={{
        width: "140px", height: "1px",
        background: "rgba(255,255,255,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #8937fb, #e2c044)",
          animation: "sftrBar 2s ease forwards",
          transformOrigin: "left", transform: "scaleX(0)",
        }} />
      </div>
      <div style={{
        fontFamily: "'Genos', sans-serif", fontSize: "0.65rem",
        letterSpacing: "0.4em", color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        animation: "sftrAppear 1s 0.3s ease forwards", opacity: 0,
      }}>The Perfect Storm</div>
      <style>{`
        @keyframes sftrAppear {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sftrBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
