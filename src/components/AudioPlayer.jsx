import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4;
    audio.loop = true;

    const start = () => {
      if (!started) {
        audio.play().catch(() => {});
        setStarted(true);
      }
    };

    // Start on first user interaction
    document.addEventListener("click", start, { once: true });
    document.addEventListener("touchstart", start, { once: true });

    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (muted) {
      audio.play();
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/rain.mp3" preload="none" />
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100,
          background: "rgba(13,3,32,0.7)",
          border: "1px solid rgba(137,55,251,0.4)",
          color: "#8937fb",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </>
  );
}