import { useEffect, useRef } from "react";

const CLOUDS = [
  { x: 0.05, y: 0.12, drift: 0.00012, puffs: [
    { ox: 0.00, oy: 0.00, rx: 0.22, ry: 0.17, depth: 0 },
    { ox: 0.12, oy:-0.05, rx: 0.18, ry: 0.14, depth: 1 },
    { ox:-0.10, oy: 0.02, rx: 0.16, ry: 0.13, depth: 1 },
    { ox: 0.22, oy: 0.01, rx: 0.13, ry: 0.11, depth: 2 },
    { ox:-0.19, oy:-0.02, rx: 0.12, ry: 0.10, depth: 2 },
    { ox: 0.06, oy: 0.08, rx: 0.20, ry: 0.11, depth: 3 },
    { ox:-0.04, oy:-0.09, rx: 0.14, ry: 0.09, depth: 2 },
    { ox: 0.16, oy: 0.07, rx: 0.11, ry: 0.09, depth: 3 },
  ]},
  { x: 0.42, y: 0.10, drift: 0.00008, puffs: [
    { ox: 0.00, oy: 0.00, rx: 0.30, ry: 0.22, depth: 0 },
    { ox: 0.18, oy:-0.07, rx: 0.24, ry: 0.18, depth: 1 },
    { ox:-0.18, oy:-0.06, rx: 0.22, ry: 0.17, depth: 1 },
    { ox: 0.34, oy:-0.02, rx: 0.18, ry: 0.15, depth: 2 },
    { ox:-0.32, oy:-0.01, rx: 0.17, ry: 0.14, depth: 2 },
    { ox: 0.08, oy: 0.12, rx: 0.26, ry: 0.13, depth: 3 },
    { ox:-0.10, oy: 0.11, rx: 0.22, ry: 0.13, depth: 3 },
    { ox: 0.24, oy: 0.09, rx: 0.16, ry: 0.11, depth: 3 },
    { ox:-0.24, oy: 0.08, rx: 0.15, ry: 0.10, depth: 3 },
    { ox: 0.00, oy:-0.14, rx: 0.20, ry: 0.13, depth: 1 },
    { ox: 0.42, oy: 0.05, rx: 0.13, ry: 0.10, depth: 2 },
    { ox:-0.40, oy: 0.04, rx: 0.12, ry: 0.10, depth: 2 },
  ]},
  { x: 0.78, y: 0.13, drift: 0.00015, puffs: [
    { ox: 0.00, oy: 0.00, rx: 0.20, ry: 0.15, depth: 0 },
    { ox:-0.12, oy:-0.05, rx: 0.16, ry: 0.13, depth: 1 },
    { ox: 0.10, oy: 0.02, rx: 0.14, ry: 0.11, depth: 1 },
    { ox:-0.22, oy: 0.01, rx: 0.12, ry: 0.10, depth: 2 },
    { ox: 0.04, oy: 0.09, rx: 0.18, ry: 0.10, depth: 3 },
    { ox:-0.08, oy:-0.08, rx: 0.13, ry: 0.09, depth: 2 },
  ]},
  { x: 0.28, y: 0.04, drift: 0.0002, puffs: [
    { ox: 0.00, oy: 0.00, rx: 0.13, ry: 0.09, depth: 2 },
    { ox: 0.09, oy: 0.01, rx: 0.10, ry: 0.07, depth: 3 },
    { ox:-0.08, oy: 0.02, rx: 0.09, ry: 0.06, depth: 3 },
  ]},
  { x: 0.68, y: 0.03, drift: 0.00018, puffs: [
    { ox: 0.00, oy: 0.00, rx: 0.12, ry: 0.08, depth: 2 },
    { ox: 0.08, oy: 0.01, rx: 0.09, ry: 0.07, depth: 3 },
    { ox:-0.07, oy: 0.02, rx: 0.08, ry: 0.06, depth: 3 },
  ]},
];

const DEPTH = [
  { r1: [6,2,16],   r2: [14,4,30],  a1: 0.99, a2: 0.88 },
  { r1: [10,3,22],  r2: [20,6,42],  a1: 0.93, a2: 0.76 },
  { r1: [16,5,36],  r2: [30,10,60], a1: 0.80, a2: 0.60 },
  { r1: [24,8,50],  r2: [40,14,75], a1: 0.60, a2: 0.40 },
];

export default function StormCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId, time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawPuff = (px, py, rx, ry, depth, glow) => {
      const W = canvas.width, H = canvas.height;
      const dc = DEPTH[depth];
      const aRx = rx * W * 0.5;
      const aRy = ry * H * 0.9;
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, aRy / aRx);

      const core = ctx.createRadialGradient(0, aRx * 0.15, aRx * 0.1, 0, 0, aRx);
      core.addColorStop(0,    `rgba(${dc.r1},${dc.a1})`);
      core.addColorStop(0.5,  `rgba(${dc.r1},${dc.a1 * 0.92})`);
      core.addColorStop(0.82, `rgba(${dc.r2},${dc.a2 * 0.55})`);
      core.addColorStop(1,    `rgba(${dc.r1},0)`);
      ctx.beginPath(); ctx.arc(0, 0, aRx, 0, Math.PI * 2);
      ctx.fillStyle = core; ctx.fill();

      const rs = 0.07 + (3 - depth) * 0.035;
      const rimX = -aRx * 0.3, rimY = -aRx * 0.32;
      const rim = ctx.createRadialGradient(rimX, rimY, aRx * 0.4, rimX, rimY, aRx * 1.02);
      rim.addColorStop(0,    "rgba(137,55,251,0)");
      rim.addColorStop(0.68, "rgba(137,55,251,0)");
      rim.addColorStop(0.80, `rgba(100,40,180,${rs.toFixed(2)})`);
      rim.addColorStop(0.90, `rgba(137,55,251,${(rs * 1.5).toFixed(2)})`);
      rim.addColorStop(0.96, `rgba(170,110,255,${(rs * 1.2).toFixed(2)})`);
      rim.addColorStop(1,    "rgba(137,55,251,0)");
      ctx.beginPath(); ctx.arc(0, 0, aRx, 0, Math.PI * 2);
      ctx.fillStyle = rim; ctx.fill();

      if (glow > 0.01) {
        const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, aRx * 0.8);
        lg.addColorStop(0,   `rgba(137,55,251,${(glow * 0.3).toFixed(2)})`);
        lg.addColorStop(0.5, `rgba(90,4,211,${(glow * 0.15).toFixed(2)})`);
        lg.addColorStop(1,   "rgba(90,4,211,0)");
        ctx.beginPath(); ctx.arc(0, 0, aRx, 0, Math.PI * 2);
        ctx.fillStyle = lg; ctx.fill();
      }
      ctx.restore();
    };

    let bolts = [], glowAmt = 0, boltTimeout;

    const makeBolt = () => {
      const sx = (0.15 + Math.random() * 0.7) * canvas.width;
      const sy = canvas.height * (0.05 + Math.random() * 0.15);
      const pts = [[sx, sy]];
      let x = sx, y = sy;
      while (y < canvas.height * 0.88) {
        y += 15 + Math.random() * 25;
        x += (Math.random() - 0.5) * 55;
        pts.push([x, y]);
        if (Math.random() < 0.3) {
          const bp = [[x, y]];
          let bx = x, by = y;
          for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
            by += 12 + Math.random() * 18;
            bx += (Math.random() - 0.5) * 40;
            bp.push([bx, by]);
          }
          bolts.push({ pts: bp, alpha: 0.6, branch: true });
        }
      }
      return pts;
    };

    const scheduleBolt = () => {
      boltTimeout = setTimeout(() => {
        bolts.push({ pts: makeBolt(), alpha: 1, branch: false });
        glowAmt = 1;
        setTimeout(() => { bolts = []; scheduleBolt(); }, 180 + Math.random() * 140);
      }, 2000 + Math.random() * 5500);
    };
    scheduleBolt();

    const drawBolt = ({ pts, alpha, branch }) => {
      if (pts.length < 2) return;
      ctx.save();
      ctx.globalAlpha = alpha * (branch ? 0.45 : 0.82);
      ctx.shadowColor = "rgba(137,55,251,0.9)";
      ctx.shadowBlur = branch ? 12 : 28;
      ctx.strokeStyle = branch ? "rgba(137,55,251,0.7)" : "rgba(226,192,68,0.92)";
      ctx.lineWidth = branch ? 1.0 : 2.2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.stroke();
      ctx.shadowBlur = 3;
      ctx.strokeStyle = "rgba(255,248,220,0.96)";
      ctx.lineWidth = branch ? 0.4 : 0.9;
      ctx.stroke();
      ctx.restore();
    };

    const drops = Array.from({ length: 260 }, () => ({
      x: Math.random(), y: Math.random(),
      len: Math.random() * 20 + 9,
      speed: Math.random() * 5 + 3,
      op: Math.random() * 0.15 + 0.03,
    }));

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      if (glowAmt > 0) glowAmt = Math.max(0, glowAmt - 0.025);

      for (let d = 3; d >= 0; d--) {
        CLOUDS.forEach(cloud => {
          const cx = cloud.x * W + Math.sin(time * cloud.drift + cloud.x * 8) * 12;
          const cy = cloud.y * H + Math.cos(time * cloud.drift * 0.7 + cloud.x * 5) * 6;
          cloud.puffs
            .filter(p => p.depth === d)
            .forEach(p => drawPuff(
              cx + p.ox * W * 0.45,
              cy + p.oy * H * 0.7,
              p.rx, p.ry, p.depth, glowAmt
            ));
        });
      }

      bolts.forEach(drawBolt);

      if (glowAmt > 0.1) {
        ctx.save();
        ctx.globalAlpha = glowAmt * 0.03;
        ctx.fillStyle = "#8937fb";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x * W, d.y * H);
        ctx.lineTo(d.x * W - d.len * 0.18, d.y * H + d.len);
        ctx.strokeStyle = `rgba(137,55,251,${d.op})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        d.y += d.speed / H;
        d.x -= d.speed * 0.18 / W;
        if (d.y > 1) { d.y = -d.len / H; d.x = Math.random(); }
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(boltTimeout);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  );
}