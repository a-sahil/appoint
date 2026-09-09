import { useState, useCallback, useEffect, useRef } from "react";
import AppointmentBoard from "./components/AppointmentBoard";
import LandingPage from "./components/LandingPage";
import Toast from "./components/Toast";

let toastId = 0;

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 160;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.003 + 0.001,
      offset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 80 + s.offset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [boardVisible, setBoardVisible] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const goToBoard = useCallback(() => {
    setPage("board");
    setTimeout(() => setBoardVisible(true), 50);
  }, []);

  const goToLanding = useCallback(() => {
    setBoardVisible(false);
    setTimeout(() => setPage("landing"), 350);
  }, []);

  if (page === "landing") {
    return <LandingPage onEnter={goToBoard} />;
  }

  return (
    <>
      <Starfield />
      <div
        className="board-topbar"
        style={{
          opacity: boardVisible ? 1 : 0,
          transform: boardVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <button className="board-back-btn" onClick={goToLanding}>
          ← Back to Home
        </button>
        <div className="board-topbar-logo">
          <span>🗓</span>
          <span className="logo-text">appoint<span className="logo-accent">.io</span></span>
        </div>
      </div>
      <div
        style={{
          opacity: boardVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <AppointmentBoard addToast={addToast} />
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
