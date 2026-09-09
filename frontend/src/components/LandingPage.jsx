import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Add appointments in seconds with smart validation and conflict detection built-in.",
  },
  {
    icon: "🛡",
    title: "No Double Booking",
    desc: "Our time-slot conflict engine ensures no two appointments ever overlap.",
  },
  {
    icon: "🗂",
    title: "Kanban Board",
    desc: "Visualize your schedule across Scheduled, Completed, and Cancelled columns.",
  },
  {
    icon: "🔍",
    title: "Smart Filters",
    desc: "Filter appointments by date or status to find exactly what you need.",
  },
  {
    icon: "✏️",
    title: "Full Control",
    desc: "Edit, complete, or cancel any appointment with real-time UI feedback.",
  },
  {
    icon: "🔔",
    title: "Live Feedback",
    desc: "Toast notifications confirm every action so you're always in the loop.",
  },
];

export default function LandingPage({ onEnter }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

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

    const STAR_COUNT = 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.65 + 0.1,
      speed: Math.random() * 0.004 + 0.001,
      offset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      stars.forEach((s) => {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed * 80 + s.offset));
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

  const handleEnter = () => {
    setVisible(false);
    setTimeout(onEnter, 400);
  };

  return (
    <div className={`landing ${visible ? "landing--visible" : ""}`}>
      <canvas ref={canvasRef} className="landing-canvas" />

      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <span className="logo-icon">🗓</span>
          <span className="logo-text">appoint<span className="logo-accent">.io</span></span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How it Works</a>
        </div>
        <button className="btn-nav-cta" onClick={handleEnter}>
          Open Board →
        </button>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          Full Stack Appointment System
        </div>

        <h1 className="hero-title">
          Schedule Smarter.<br />
          <span className="hero-title-accent">Stay In Control.</span>
        </h1>

        <p className="hero-subtitle">
          A powerful appointment board for your team. Book, manage, and track
          every meeting — with zero double-booking, ever.
        </p>

        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={handleEnter}>
            Open Board →
          </button>
          <a href="#features" className="btn-hero-secondary">
            See Features
          </a>
        </div>

        <div className="hero-badges">
          <div className="hero-badge">
            <span className="badge-dot green" />
            FastAPI Backend
          </div>
          <div className="hero-badge">
            <span className="badge-dot blue" />
            React Frontend
          </div>
          <div className="hero-badge">
            <span className="badge-dot purple" />
            PostgreSQL
          </div>
        </div>
      </section>

      <section className="stats-row">
        {[
          { num: "100%", label: "No double bookings" },
          { num: "Real-time", label: "UI feedback" },
          { num: "3-column", label: "Kanban board" },
          { num: "REST", label: "API powered" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="features" id="features">
        <div className="section-header">
          <div className="section-eyebrow">What it does</div>
          <h2 className="section-title">Everything you need to manage appointments</h2>
          <p className="section-sub">
            Built with a clean full-stack architecture. No unnecessary complexity.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={f.title} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-header">
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-title">From open to booked in seconds</h2>
        </div>
        <div className="steps">
          {[
            { n: "01", title: "Open the Board", desc: "See all your existing appointments at a glance in a Kanban layout." },
            { n: "02", title: "Add Appointment", desc: "Fill in the title, description, date, and time. Conflicts are caught instantly." },
            { n: "03", title: "Manage & Track", desc: "Edit, complete, or cancel appointments anytime. Filtered views keep things clean." },
          ].map((step) => (
            <div className="step" key={step.n}>
              <div className="step-num">{step.n}</div>
              <div className="step-body">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-glow" />
        <h2 className="cta-title">Ready to manage your schedule?</h2>
        <p className="cta-sub">Jump into the board and start booking right away.</p>
        <button className="btn-hero-primary" onClick={handleEnter}>
          Open Appointment Board →
        </button>
      </section>

      <footer className="landing-footer">
        <div className="footer-logo">
          <span className="logo-icon">🗓</span>
          <span className="logo-text">appoint<span className="logo-accent">.io</span></span>
        </div>
        <p className="footer-note">
          Built for the Appening Infotech Full Stack Intern assignment · React + FastAPI + PostgreSQL
        </p>
      </footer>
    </div>
  );
}
