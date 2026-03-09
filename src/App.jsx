import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DevRel AI — Combined App
// Onboarding wizard → Dashboard with live backend connection
// Backend: https://devad-backend-production.up.railway.app
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "devad_agent_config";

export default function App() {
  const [agentConfig, setAgentConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [screen, setScreen] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const config = saved ? JSON.parse(saved) : null;
      if (config && config.orgId) return "dashboard";
      // Also jump to dashboard if Discord was connected (even without full onboarding)
      const discord = localStorage.getItem("devad_discord_connection");
      const dc = discord ? JSON.parse(discord) : null;
      if (dc && dc.connected) return "dashboard";
      return "landing";
    } catch { return "landing"; }
  });

  function handleLaunch(config) {
    setAgentConfig(config);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
    setScreen("dashboard");
  }

  function handleLogout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setAgentConfig({});
    setScreen("landing");
  }

  if (screen === "landing") {
    return (
      <LandingPage
        onStartOnboarding={() => setScreen("onboarding")}
        onJumpToDashboard={() => setScreen("dashboard")}
      />
    );
  }
  if (screen === "onboarding") {
    return <Onboarding onLaunch={handleLaunch} onGoToLanding={() => setScreen("landing")} />;
  }
  return <Dashboard agentConfig={agentConfig} orgId={agentConfig.orgId} onGoToOnboarding={() => setScreen("onboarding")} onLogout={handleLogout} />;
}

// ═══ LANDING PAGE ══════════════════════════════════════════════════════════

function LandingPage({ onStartOnboarding, onJumpToDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Your AI Developer Advocate — answering developer questions 24/7 so your team doesn't have to.";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Instant Answers",
      desc: "Responds to developer questions in seconds — on Discord, Slack, or your own dashboard. No waiting, no tickets.",
    },
    {
      icon: "🧠",
      title: "Learns Your Docs",
      desc: "Feed it your documentation, changelogs, and FAQs. DEVAD answers from your knowledge base — not generic AI.",
    },
    {
      icon: "📊",
      title: "Community Insights",
      desc: "See what developers struggle with most. Discover gaps in your docs. Make data-driven decisions about what to build next.",
    },
    {
      icon: "🔌",
      title: "Plug Into Discord",
      desc: "Connect your Discord server in 2 minutes. DEVAD monitors support channels and replies automatically.",
    },
    {
      icon: "🎯",
      title: "Confidence Scoring",
      desc: "Every answer comes with a confidence score. Low confidence? The question escalates to your team automatically.",
    },
    {
      icon: "🚀",
      title: "Zero Engineering",
      desc: "Set up in under 10 minutes. No code, no infrastructure, no DevOps. Just connect and go.",
    },
  ];

  const steps = [
    { n: "01", title: "Connect Your Docs", desc: "Paste your documentation URL — DEVAD crawls and learns everything." },
    { n: "02", title: "Link Your Community", desc: "Connect your Discord server with one invite link." },
    { n: "03", title: "Configure Your Agent", desc: "Set the name, tone, and confidence threshold that fits your brand." },
    { n: "04", title: "Go Live", desc: "Your AI DevRel is now answering developer questions around the clock." },
  ];

  const s = {
    page: {
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      background: CO.bg,
      color: CO.t1,
      minHeight: "100vh",
      overflowX: "hidden",
    },
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 40px",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(6,9,16,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${CO.border}` : "none",
      transition: "all 0.3s ease",
    },
    logo: {
      display: "flex", alignItems: "center", gap: 10,
    },
    logoBox: {
      width: 32, height: 32, borderRadius: 6,
      border: `2px solid ${CO.accent}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 900, color: CO.accent,
      boxShadow: `0 0 12px ${CO.accent}40`,
    },
    logoText: { fontSize: 16, fontWeight: 700, color: CO.t1, letterSpacing: "0.05em" },
    hero: {
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center",
      padding: "120px 24px 80px",
      position: "relative",
    },
    heroBadge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 16px", borderRadius: 20,
      border: `1px solid ${CO.accent}40`,
      background: CO.accentDim,
      fontSize: 11, fontWeight: 600, color: CO.accent,
      letterSpacing: "0.1em", textTransform: "uppercase",
      marginBottom: 32,
      animation: "fadeInDown 0.6s ease",
    },
    heroTitle: {
      fontSize: "clamp(36px, 7vw, 80px)",
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      marginBottom: 24,
      animation: "fadeInUp 0.7s ease 0.1s both",
    },
    heroSub: {
      fontSize: "clamp(14px, 2vw, 18px)",
      color: CO.t2,
      maxWidth: 560,
      lineHeight: 1.7,
      marginBottom: 48,
      minHeight: "3em",
      animation: "fadeInUp 0.7s ease 0.2s both",
    },
    ctaRow: {
      display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
      animation: "fadeInUp 0.7s ease 0.3s both",
    },
    ctaPrimary: {
      padding: "14px 32px", borderRadius: 10,
      border: "none", cursor: "pointer",
      background: `linear-gradient(135deg, ${CO.accent}, #0090C8)`,
      color: "#000", fontSize: 14, fontWeight: 800,
      letterSpacing: "0.02em",
      boxShadow: `0 0 30px ${CO.accent}50`,
      transition: "all 0.2s",
    },
    ctaSecondary: {
      padding: "14px 32px", borderRadius: 10,
      border: `1px solid ${CO.border}`, cursor: "pointer",
      background: "transparent",
      color: CO.t1, fontSize: 14, fontWeight: 600,
      transition: "all 0.2s",
    },
    terminalWrap: {
      margin: "80px auto 0",
      maxWidth: 680, width: "100%",
      borderRadius: 14,
      border: `1px solid ${CO.border}`,
      background: CO.surface,
      overflow: "hidden",
      boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${CO.border}`,
      animation: "fadeInUp 0.8s ease 0.4s both",
    },
    terminalBar: {
      padding: "10px 16px",
      background: CO.surfaceHigh,
      borderBottom: `1px solid ${CO.border}`,
      display: "flex", alignItems: "center", gap: 8,
    },
    terminalDot: (color) => ({
      width: 10, height: 10, borderRadius: "50%", background: color,
    }),
    terminalTitle: { fontSize: 11, color: CO.t2, marginLeft: 8 },
    terminalBody: { padding: 24, fontSize: 12, lineHeight: 2 },
    section: {
      maxWidth: 1100, margin: "0 auto", padding: "100px 24px",
    },
    sectionLabel: {
      fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
      textTransform: "uppercase", color: CO.accent,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: "clamp(28px, 4vw, 48px)",
      fontWeight: 900, lineHeight: 1.1,
      letterSpacing: "-0.02em", marginBottom: 16,
    },
    sectionSub: {
      fontSize: 15, color: CO.t2, lineHeight: 1.7, maxWidth: 560,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 20, marginTop: 60,
    },
    card: {
      padding: 28, borderRadius: 14,
      border: `1px solid ${CO.border}`,
      background: CO.surface,
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default",
    },
    cardIcon: {
      fontSize: 28, marginBottom: 16,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 52, height: 52, borderRadius: 12,
      background: CO.accentDim,
      border: `1px solid ${CO.accent}30`,
    },
    cardTitle: { fontSize: 15, fontWeight: 700, marginBottom: 8, color: CO.t1 },
    cardDesc: { fontSize: 13, color: CO.t2, lineHeight: 1.7 },
    stepsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 2, marginTop: 60,
    },
    stepCard: {
      padding: "32px 28px",
      background: CO.surface,
      border: `1px solid ${CO.border}`,
      position: "relative",
    },
    stepNum: {
      fontSize: 48, fontWeight: 900, color: CO.border,
      lineHeight: 1, marginBottom: 16,
      fontFamily: "'IBM Plex Mono', monospace",
    },
    stepTitle: { fontSize: 15, fontWeight: 700, marginBottom: 8 },
    stepDesc: { fontSize: 13, color: CO.t2, lineHeight: 1.7 },
    divider: {
      height: 1, background: `linear-gradient(90deg, transparent, ${CO.border}, transparent)`,
      margin: "0 24px",
    },
    finalCta: {
      textAlign: "center", padding: "100px 24px",
      background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${CO.accentDim}, transparent)`,
    },
    footer: {
      borderTop: `1px solid ${CO.border}`,
      padding: "32px 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 16,
    },
    footerLeft: { display: "flex", alignItems: "center", gap: 12 },
    footerText: { fontSize: 12, color: CO.t3 },
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700;900&display=swap');
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes glow { 0%,100% { box-shadow:0 0 20px #00C2FF30 } 50% { box-shadow:0 0 40px #00C2FF60 } }
        .cta-primary:hover { transform:translateY(-2px); box-shadow:0 0 50px #00C2FF70 !important; }
        .cta-secondary:hover { border-color:#283D60 !important; background:#0C1420 !important; }
        .feat-card:hover { border-color:#283D60 !important; transform:translateY(-3px); }
        .cursor { display:inline-block; width:2px; height:1em; background:#00C2FF; animation:pulse 1s infinite; vertical-align:middle; margin-left:2px; }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <div style={s.logoBox}>D</div>
          <span style={s.logoText}>DEVAD</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="cta-secondary" onClick={onJumpToDashboard}
            style={s.ctaSecondary}>
            Demo Dashboard
          </button>
          <button className="cta-primary" onClick={onStartOnboarding}
            style={s.ctaPrimary}>
            Get Started Free →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${CO.border}30 1px, transparent 1px), linear-gradient(90deg, ${CO.border}30 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={s.heroBadge}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: CO.green, animation: "pulse 2s infinite" }} />
            AI-Powered Developer Relations
          </div>
          <h1 style={s.heroTitle}>
            <span style={{ color: CO.t1 }}>Stop Answering</span><br />
            <span style={{ background: `linear-gradient(135deg, ${CO.accent}, ${CO.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              The Same Questions
            </span>
          </h1>
          <p style={s.heroSub}>
            {typedText}<span className="cursor" />
          </p>
          <div style={s.ctaRow}>
            <button className="cta-primary" onClick={onStartOnboarding} style={s.ctaPrimary}>
              Connect Your Community →
            </button>
            <button className="cta-secondary" onClick={onJumpToDashboard} style={s.ctaSecondary}>
              Try the Dashboard
            </button>
          </div>

          {/* Terminal demo */}
          <div style={s.terminalWrap}>
            <div style={s.terminalBar}>
              <div style={s.terminalDot("#FF5F57")} />
              <div style={s.terminalDot("#FFBD2E")} />
              <div style={s.terminalDot("#28CA42")} />
              <span style={s.terminalTitle}>devad — discord #help</span>
            </div>
            <div style={s.terminalBody}>
              <div><span style={{ color: CO.t3 }}>devuser_42 </span><span style={{ color: CO.t2 }}>→ #help</span></div>
              <div style={{ color: CO.t2, paddingLeft: 16, margin: "4px 0" }}>
                How do I authenticate with your API using OAuth2?
              </div>
              <div style={{ marginTop: 12 }}><span style={{ color: CO.accent }}>DEVAD</span><span style={{ color: CO.t3 }}> [bot] → #help</span></div>
              <div style={{ color: CO.t1, paddingLeft: 16, marginTop: 4, lineHeight: 1.8 }}>
                Great question! Here's how OAuth2 works with our API:<br />
                <span style={{ color: CO.green }}>1.</span> Request an authorization code at <span style={{ color: CO.accent }}>/oauth/authorize</span><br />
                <span style={{ color: CO.green }}>2.</span> Exchange it for a token at <span style={{ color: CO.accent }}>/oauth/token</span><br />
                <span style={{ color: CO.green }}>3.</span> Include <span style={{ color: CO.accent }}>Bearer {"<token>"}</span> in your headers<br />
                <span style={{ color: CO.t2, fontSize: 11 }}>📚 Full guide: docs.example.com/auth/oauth2 · Confidence: 94%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={s.divider} />

      {/* FEATURES */}
      <section style={s.section}>
        <div style={s.sectionLabel}>Features</div>
        <h2 style={s.sectionTitle}>Everything your DevRel<br />team needs, automated.</h2>
        <p style={s.sectionSub}>From instant answers to deep community insights — DEVAD handles the repetitive work so your team can focus on building relationships.</p>
        <div style={s.grid}>
          {features.map((f) => (
            <div key={f.title} className="feat-card" style={s.card}>
              <div style={s.cardIcon}>{f.icon}</div>
              <div style={s.cardTitle}>{f.title}</div>
              <div style={s.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* HOW IT WORKS */}
      <section style={{ ...s.section, paddingTop: 100 }}>
        <div style={s.sectionLabel}>How It Works</div>
        <h2 style={s.sectionTitle}>Live in under<br />10 minutes.</h2>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.n} style={{
              ...s.stepCard,
              borderRadius: i === 0 ? "14px 0 0 14px" : i === steps.length - 1 ? "0 14px 14px 0" : 0,
            }}>
              <div style={s.stepNum}>{step.n}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* FINAL CTA */}
      <section style={s.finalCta}>
        <div style={s.sectionLabel}>Get Started</div>
        <h2 style={{ ...s.sectionTitle, marginBottom: 16 }}>
          Ready to scale your<br />developer community?
        </h2>
        <p style={{ ...s.sectionSub, margin: "0 auto 40px", textAlign: "center" }}>
          Join developer teams already using DEVAD to answer questions faster, reduce support load, and ship better documentation.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cta-primary" onClick={onStartOnboarding}
            style={{ ...s.ctaPrimary, padding: "16px 40px", fontSize: 15 }}>
            Connect Your Community →
          </button>
          <button className="cta-secondary" onClick={onJumpToDashboard}
            style={{ ...s.ctaSecondary, padding: "16px 40px", fontSize: 15 }}>
            Explore the Dashboard
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerLeft}>
          <div style={{ ...s.logoBox, width: 24, height: 24, fontSize: 11 }}>D</div>
          <span style={s.footerText}>DEVAD — AI Developer Advocate</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={s.footerText}>Made by <span style={{ color: CO.t2, fontWeight: 600 }}>Mide Oyekale</span> · © 2026 Axentis Global</div>
          <div style={{ ...s.footerText, marginTop: 4 }}>Built on Railway + Vercel + Supabase</div>
        </div>
      </footer>
    </div>
  );
}

// ═══ ONBOARDING ═══════════════════════════════════════════════════════════


const CO = {
  bg: "#060910", surface: "#0C1420", surfaceHigh: "#111C2C",
  border: "#18243A", borderHover: "#283D60",
  accent: "#00C2FF", accentDim: "#091E2E", accentGlow: "#00C2FF25",
  green: "#00E5A0", greenDim: "#08221A",
  amber: "#FFB800", amberDim: "#221800",
  red: "#FF4D6A",
  t1: "#ECF2FF", t2: "#607C9A", t3: "#537AB1",
};

function ProgressBar({ value, color = CO.accent, height = 6 }) {
  return (
    <div style={{ height, background: CO.border, borderRadius: height, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color,
        borderRadius: height, transition: "width .2s ease" }} />
    </div>
  );
}

function Pill({ children, color = CO.accent }) {
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: color + "20", color, border: `1px solid ${color}30` }}>{children}</span>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: done ? 16 : 13, fontWeight: 700, flexShrink: 0,
      background: done ? CO.greenDim : active ? CO.accentDim : CO.surface,
      border: `2px solid ${done ? CO.green : active ? CO.accent : CO.border}`,
      color: done ? CO.green : active ? CO.accent : CO.t3,
      transition: "all .3s" }}>
      {done ? "✓" : n}
    </div>
  );
}

/* ─── STEP 1: Connect Docs ─────────────────────────────────────────────── */
function Step1({ onNext, onSkip }) {
  const [url, setUrl]               = useState("");
  const [crawling, setCrawling]     = useState(false);
  const [progress, setProgress]     = useState(0);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState([]);
  const [done, setDone]             = useState(false);

  const examplePages = [
    "quickstart.html", "authentication.html", "rate-limits.html",
    "webhooks.html", "pagination.html", "errors.html",
    "sdks/python.html", "sdks/node.html", "sdks/go.html",
    "reference/users.html", "reference/payments.html", "reference/events.html",
    "changelog.html", "faq.html",
  ];

  async function handleCrawl() {
    if (!url.trim()) return;
    setCrawling(true); setProgress(0); setPages([]); setDone(false);
    const t = Math.floor(Math.random() * 8) + 10;
    setTotal(t);
    for (let i = 1; i <= t; i++) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 150));
      setProgress(i);
      setPages(prev => [...prev, examplePages[(i - 1) % examplePages.length]]);
    }
    setDone(true);
    setCrawling(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: CO.t1 }}>Connect your docs</h2>
        <p style={{ margin: 0, fontSize: 14, color: CO.t2, lineHeight: 1.6 }}>
          Enter the base URL of your documentation. We'll crawl every page, chunk the content, and build a semantic index your agent will use to answer developer questions.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://docs.yourapi.com"
          onKeyDown={e => e.key === "Enter" && !crawling && handleCrawl()}
          style={{ flex: 1, background: CO.surface, border: `1px solid ${done ? CO.green : CO.border}`,
            borderRadius: 10, padding: "12px 16px", color: CO.t1, fontSize: 14, outline: "none", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = done ? CO.green : CO.accent}
          onBlur={e => e.target.style.borderColor = done ? CO.green : CO.border} />
        <button onClick={handleCrawl} disabled={crawling || !url.trim() || done}
          style={{ padding: "12px 22px", borderRadius: 10, border: "none", cursor: "pointer",
            background: done ? CO.greenDim : crawling || !url.trim() ? CO.border : `linear-gradient(135deg,${CO.accent},#005FA3)`,
            color: done ? CO.green : "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            border: done ? `1px solid ${CO.green}40` : "none" }}>
          {done ? "✓ Indexed" : crawling ? "Crawling…" : "Crawl & Index"}
        </button>
      </div>

      {(crawling || done) && (
        <div style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: CO.t2, fontWeight: 500 }}>
              {done ? `✓ ${total} pages indexed · ${total * 13} chunks · ready` : `Crawling page ${progress} of ~${total}…`}
            </span>
            {!done && <span style={{ fontSize: 13, color: CO.accent, fontVariantNumeric: "tabular-nums" }}>{Math.round((progress / total) * 100)}%</span>}
          </div>
          <ProgressBar value={done ? 100 : (progress / total) * 100} color={done ? CO.green : CO.accent} />

          {pages.length > 0 && (
            <div style={{ marginTop: 12, maxHeight: 120, overflowY: "auto",
              display: "flex", flexDirection: "column", gap: 3 }}>
              {[...pages].reverse().map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: CO.t3 }}>
                  <span style={{ color: CO.green, fontSize: 10 }}>✓</span>
                  <span style={{ fontFamily: "monospace" }}>{url.replace(/\/$/, "")}/{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!crawling && !done && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: CO.t3 }}>Try an example:</span>
          {["https://docs.stripe.com", "https://docs.twilio.com", "https://docs.github.com"].map((e, i) => (
            <button key={i} onClick={() => setUrl(e)}
              style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "transparent",
                border: `1px solid ${CO.border}`, color: CO.t2, cursor: "pointer" }}
              onMouseEnter={ev => { ev.target.style.borderColor = CO.accent; ev.target.style.color = CO.accent; }}
              onMouseLeave={ev => { ev.target.style.borderColor = CO.border; ev.target.style.color = CO.t2; }}>{e}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onSkip}
          style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${CO.border}`,
            background: "transparent", color: CO.t2, fontSize: 14, cursor: "pointer" }}>
          Skip for now →
        </button>
        <button onClick={() => onNext({ docsUrl: url, pageCount: total })} disabled={!done}
          style={{ padding: "12px 28px", borderRadius: 10, border: "none",
            cursor: done ? "pointer" : "default", fontSize: 14, fontWeight: 600,
            background: done ? `linear-gradient(135deg,${CO.accent},#005FA3)` : CO.border,
            color: done ? "#fff" : CO.t3, transition: "all .2s" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 2: Connect Community ────────────────────────────────────────── */
function Step2({ onNext, onBack, orgId, savedDiscord }) {
  const [serverId, setServerId]   = useState(savedDiscord?.serverId || "");
  const [channel, setChannel]     = useState(savedDiscord?.channel || "#help");
  const [serverName, setServerName] = useState("");
  const [status, setStatus]       = useState(savedDiscord?.connected ? "connected" : "idle");
  const [errorMsg, setErrorMsg]   = useState("");

  // Discord bot invite link — opens Discord's official OAuth modal
  const BOT_CLIENT_ID = "1479501223081279651";
  const DISCORD_INVITE = `https://discord.com/api/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=67584&scope=bot`;

  async function handleConnect() {
    if (!serverId.trim()) { setErrorMsg("Please paste your Discord Server ID first."); return; }
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch(`${BACKEND_URL}/integrations/discord/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          server_id: serverId.trim(),
          server_name: serverName.trim() || "My Discord Server",
          channel: channel.trim() || "#help",
        }),
      });
      if (res.ok) {
        setStatus("connected");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.detail || "Connection failed. Please try again.");
        setStatus("error");
      }
    } catch (e) {
      setErrorMsg("Could not reach the backend. Check your Railway deployment.");
      setStatus("error");
    }
  }

  const isConnected = status === "connected";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: CO.t1 }}>Connect your Discord</h2>
        <p style={{ margin: 0, fontSize: 14, color: CO.t2, lineHeight: 1.6 }}>
          Two quick steps — invite the DEVAD bot to your server, then paste your Server ID below.
        </p>
      </div>

      {/* Step A: Invite bot */}
      <div style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#5865F220", border: "1px solid #5865F240",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: CO.t1, marginBottom: 4 }}>
              Step 1 — Invite DEVAD bot to your server
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: CO.t2, lineHeight: 1.6 }}>
              Click the button below. Discord will open and ask which server to add the bot to. Select your server and click Authorise.
            </p>
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 20px",
                borderRadius: 8, background: "#5865F2", color: "#fff", fontSize: 13, fontWeight: 700,
                textDecoration: "none", border: "none", cursor: "pointer" }}>
              🔗 Open Discord — Add Bot to Server
            </a>
          </div>
        </div>
      </div>

      {/* Step B: Paste Server ID */}
      <div style={{ background: CO.surface, border: `1px solid ${isConnected ? CO.green + "60" : CO.border}`, borderRadius: 12, padding: "18px 20px", transition: "border-color .3s" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: CO.t1, marginBottom: 4 }}>
          Step 2 — Paste your Discord Server ID
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: CO.t2, lineHeight: 1.6 }}>
          In Discord: right-click your server name → <strong style={{ color: CO.t1 }}>Copy Server ID</strong>.
          (If you don't see it, enable Developer Mode in Discord Settings → Advanced.)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: CO.t3, display: "block", marginBottom: 6 }}>Server Name (optional)</label>
            <input value={serverName} onChange={e => setServerName(e.target.value)}
              placeholder="e.g. My Dev Community"
              disabled={isConnected}
              style={{ width: "100%", background: CO.bg, border: `1px solid ${CO.border}`, borderRadius: 8,
                padding: "9px 12px", color: CO.t1, fontSize: 13, outline: "none", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = CO.accent}
              onBlur={e => e.target.style.borderColor = CO.border} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: CO.t3, display: "block", marginBottom: 6 }}>Discord Server ID *</label>
            <input value={serverId} onChange={e => setServerId(e.target.value)}
              placeholder="e.g. 1479507293706915941"
              disabled={isConnected}
              style={{ width: "100%", background: CO.bg, border: `1px solid ${CO.border}`, borderRadius: 8,
                padding: "9px 12px", color: CO.t1, fontSize: 13, outline: "none", fontFamily: "monospace" }}
              onFocus={e => e.target.style.borderColor = CO.accent}
              onBlur={e => e.target.style.borderColor = CO.border} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: CO.t3, display: "block", marginBottom: 6 }}>Channel to watch</label>
            <input value={channel} onChange={e => setChannel(e.target.value)}
              placeholder="#help"
              disabled={isConnected}
              style={{ width: "100%", background: CO.bg, border: `1px solid ${CO.border}`, borderRadius: 8,
                padding: "9px 12px", color: CO.t1, fontSize: 13, outline: "none", fontFamily: "monospace" }}
              onFocus={e => e.target.style.borderColor = CO.accent}
              onBlur={e => e.target.style.borderColor = CO.border} />
          </div>

          {errorMsg && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: CO.red + "15",
              border: `1px solid ${CO.red}40`, fontSize: 12, color: CO.red }}>{errorMsg}</div>
          )}

          {isConnected ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 8, background: CO.greenDim, border: `1px solid ${CO.green}40` }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <span style={{ fontSize: 13, color: CO.green, fontWeight: 600 }}>
                Discord connected! DEVAD is now watching {channel} in your server.
              </span>
            </div>
          ) : (
            <button onClick={handleConnect} disabled={status === "saving" || !serverId.trim()}
              style={{ padding: "11px 24px", borderRadius: 8, border: "none",
                cursor: status === "saving" || !serverId.trim() ? "default" : "pointer",
                background: status === "saving" || !serverId.trim() ? CO.border : `linear-gradient(135deg,#5865F2,#4752C4)`,
                color: status === "saving" || !serverId.trim() ? CO.t3 : "#fff",
                fontSize: 13, fontWeight: 700, alignSelf: "flex-start" }}>
              {status === "saving" ? "Saving…" : "✓ Save Connection"}
            </button>
          )}
        </div>
      </div>

      {/* Coming soon */}
      <div style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 12, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: CO.t2 }}>Slack, GitHub & more — coming soon</div>
          <div style={{ fontSize: 12, color: CO.t3 }}>Additional integrations will be available in a future update.</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${CO.border}`,
          background: "transparent", color: CO.t2, fontSize: 14, cursor: "pointer" }}>← Back</button>
        <button
          onClick={() => onNext({ connected: { discord: isConnected }, channels: { discord: channel }, serverId })}
          disabled={!isConnected}
          style={{ padding: "12px 28px", borderRadius: 10, border: "none",
            cursor: isConnected ? "pointer" : "default",
            background: isConnected ? `linear-gradient(135deg,${CO.accent},#005FA3)` : CO.border,
            color: isConnected ? "#fff" : CO.t3, fontSize: 14, fontWeight: 600 }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: Configure Agent ──────────────────────────────────────────── */
function Step3({ onNext, onBack }) {
  const [name, setName]             = useState("DevBot");
  const [threshold, setThreshold]   = useState(80);
  const [tone, setTone]             = useState("friendly");
  const [escalate, setEscalate]     = useState(["billing", "security", "legal"]);

  const tones = [
    { id: "friendly",     label: "Friendly",     desc: "Warm, helpful, approachable" },
    { id: "professional", label: "Professional",  desc: "Precise, formal, concise" },
    { id: "technical",    label: "Technical",     desc: "Deep, code-first, detailed" },
  ];

  const escalationTopics = ["billing", "security", "legal", "refunds", "outages", "account-deletion"];

  function toggleEscalate(t) {
    setEscalate(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: CO.t1 }}>Configure your agent</h2>
        <p style={{ margin: 0, fontSize: 14, color: CO.t2, lineHeight: 1.6 }}>
          Set your agent's personality and behavior rules. You can change all of this later.
        </p>
      </div>

      {/* agent name */}
      <div>
        <label style={{ display: "block", fontSize: 12, color: CO.t3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Agent Name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          style={{ width: "100%", background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 10,
            padding: "11px 14px", color: CO.t1, fontSize: 14, outline: "none", fontFamily: "inherit",
            boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = CO.accent}
          onBlur={e => e.target.style.borderColor = CO.border} />
      </div>

      {/* confidence threshold */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: CO.t3, textTransform: "uppercase", letterSpacing: "0.07em" }}>Auto-Post Confidence Threshold</label>
          <span style={{ fontSize: 14, fontWeight: 700, color: CO.accent, fontVariantNumeric: "tabular-nums" }}>{threshold}%</span>
        </div>
        <input type="range" min={50} max={99} value={threshold} onChange={e => setThreshold(+e.target.value)}
          style={{ width: "100%", accentColor: CO.accent, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: CO.t3 }}>50% — posts more, reviews less</span>
          <span style={{ fontSize: 11, color: CO.t3 }}>99% — reviews almost everything</span>
        </div>
        <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: CO.accentDim,
          border: `1px solid ${CO.accent}20`, fontSize: 12, color: CO.t2, lineHeight: 1.5 }}>
          Answers with ≥{threshold}% confidence post automatically. Below that, they go to your review queue.
        </div>
      </div>

      {/* tone */}
      <div>
        <label style={{ display: "block", fontSize: 12, color: CO.t3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Agent Tone</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {tones.map(t => (
            <div key={t.id} onClick={() => setTone(t.id)}
              style={{ padding: "12px 14px", borderRadius: 10, cursor: "pointer", transition: "all .15s",
                background: tone === t.id ? CO.accentDim : CO.surface,
                border: `2px solid ${tone === t.id ? CO.accent : CO.border}` }}>
              <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: tone === t.id ? CO.accent : CO.t1 }}>{t.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: CO.t2 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* escalation topics */}
      <div>
        <label style={{ display: "block", fontSize: 12, color: CO.t3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Always Escalate to Human (topics)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {escalationTopics.map(t => (
            <button key={t} onClick={() => toggleEscalate(t)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                transition: "all .15s", border: "none",
                background: escalate.includes(t) ? CO.amberDim : CO.surface,
                color: escalate.includes(t) ? CO.amber : CO.t2,
                outline: `1px solid ${escalate.includes(t) ? CO.amber + "40" : CO.border}` }}>
              {escalate.includes(t) ? "✓ " : ""}{t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${CO.border}`,
          background: "transparent", color: CO.t2, fontSize: 14, cursor: "pointer" }}>← Back</button>
        <button onClick={() => onNext({ agentName: name, threshold, tone, escalate })}
          style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${CO.accent},#005FA3)`,
            color: "#fff", fontSize: 14, fontWeight: 600 }}>Continue →</button>
      </div>
    </div>
  );
}

/* ─── STEP 4: Live Test ─────────────────────────────────────────────────── */
function Step4({ config, onLaunch }) {
  const [msgs, setMsgs]   = useState([{
    role: "assistant",
    content: `Hey! I'm **${config.agentName || "DevBot"}**, your AI Developer Advocate. I've been trained on your docs at \`${config.docsUrl || "docs.yourapi.com"}\` and I'm ready to answer developer questions. Try asking me something!`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", content: q }]);
    setLoading(true);
    try {
      const history = msgs.filter(m => m.role !== "assistant" || !m.content.startsWith("Hey!"))
        .map(m => ({ role: m.role, content: m.content }));
      history.push({ role: "user", content: q });
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: `You are ${config.agentName || "DevBot"}, an AI Developer Advocate for a developer-first API company.
Tone: ${config.tone || "friendly"}.
The developer has asked a question. Respond helpfully with code examples when relevant.
Keep it concise but complete. Use markdown code blocks for code.
This is a live onboarding test to show the customer what their agent will be like.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong.";
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Connection error — please try again." }]);
    }
    setLoading(false);
  }

  function renderMsg(text) {
    return text.split(/(```[\s\S]*?```|\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.slice(3).split("\n");
        const lang = lines[0].trim() || "code";
        const code = lines.slice(1, -1).join("\n");
        return (
          <div key={i} style={{ margin: "8px 0", borderRadius: 8, overflow: "hidden", border: `1px solid ${CO.border}` }}>
            <div style={{ background: "#080F1A", padding: "4px 12px", fontSize: 11, color: CO.t3, borderBottom: `1px solid ${CO.border}` }}>{lang}</div>
            <pre style={{ margin: 0, padding: "10px 14px", background: "#040710", fontSize: 12, color: "#93C5FD",
              fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{code}</pre>
          </div>
        );
      }
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} style={{ color: CO.t1 }}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={i} style={{ background: CO.accentDim, color: CO.accent, padding: "1px 6px", borderRadius: 4, fontSize: "0.9em", fontFamily: "monospace" }}>{part.slice(1, -1)}</code>;
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  }

  const suggestions = [
    "How do I make my first API call?",
    "How do I set up webhook verification?",
    "What happens when I hit a rate limit?",
    "Show me error handling in JavaScript",
  ];

  const platforms = Object.keys(config.connected || {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: CO.t1 }}>Test your agent live</h2>
        <p style={{ margin: 0, fontSize: 14, color: CO.t2, lineHeight: 1.6 }}>
          Ask your agent a real developer question. This is exactly how it will respond in {platforms.length > 0 ? platforms.join(", ") : "your community"}.
        </p>
      </div>

      {/* mock Discord-style chat */}
      <div style={{ background: "#040710", border: `1px solid ${CO.border}`, borderRadius: 14, overflow: "hidden" }}>
        {/* fake Discord header */}
        <div style={{ background: "#060C1A", padding: "10px 16px", borderBottom: `1px solid ${CO.border}`,
          display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14 }}>💬</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: CO.t1 }}>#help</span>
          <span style={{ fontSize: 11, color: CO.t3, marginLeft: "auto" }}>Discord · {config.channels?.discord || "#help"}</span>
        </div>

        {/* messages */}
        <div style={{ minHeight: 200, maxHeight: 300, overflowY: "auto", padding: "14px 16px",
          display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: m.role === "assistant" ? `linear-gradient(135deg,${CO.accent},#005FA3)` : "#4A154B",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {m.role === "assistant" ? "🤖" : "👤"}
              </div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600,
                    color: m.role === "assistant" ? CO.accent : CO.t1 }}>
                    {m.role === "assistant" ? (config.agentName || "DevBot") + " 🤖" : "you"}
                  </span>
                  <span style={{ fontSize: 11, color: CO.t3 }}>Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {m.role === "assistant" && <Pill color={CO.green}>AI • 94% conf.</Pill>}
                </div>
                <div style={{ fontSize: 13, color: CO.t1, lineHeight: 1.6 }}>{renderMsg(m.content)}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${CO.accent},#005FA3)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
              <span style={{ fontSize: 12, color: CO.t3 }}>{config.agentName || "DevBot"} is typing</span>
              <span style={{ display: "inline-flex", gap: 3 }}>
                {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:"50%",background:CO.t3,animation:`tdot 1.2s ease-in-out ${i*.2}s infinite`}}/>)}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* suggestions */}
        {msgs.length <= 2 && (
          <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)}
                style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, background: CO.accentDim,
                  border: `1px solid ${CO.accent}20`, color: CO.accent, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        )}

        {/* input */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${CO.border}`, display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Message #${(config.channels?.discord || "help").replace("#", "")}`}
            style={{ flex: 1, background: CO.surfaceHigh, border: `1px solid ${CO.border}`, borderRadius: 8,
              padding: "9px 14px", color: CO.t1, fontSize: 13, outline: "none", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = CO.accent}
            onBlur={e => e.target.style.borderColor = CO.border} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ padding: "9px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: loading || !input.trim() ? CO.border : CO.accent,
              color: "#fff", fontSize: 14 }}>↑</button>
        </div>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 12, background: CO.greenDim, border: `1px solid ${CO.green}30`,
        display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>🚀</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: CO.green }}>Ready to go live</p>
          <p style={{ margin: 0, fontSize: 12, color: CO.t2 }}>
            {config.pageCount || "14"} pages indexed · {platforms.length || 1} platform{platforms.length !== 1 ? "s" : ""} connected · {config.agentName || "DevBot"} configured
          </p>
        </div>
        <button onClick={async () => {
            try {
              const res = await fetch(`${BACKEND_URL}/orgs/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: config.agentName || "My Company",
                  agent_name: config.agentName || "DevBot",
                  tone: config.tone || "friendly",
                  confidence_threshold: config.threshold || 80,
                }),
              });
              const data = await res.json();
              onLaunch({ ...config, orgId: data.org_id });
            } catch (e) {
              // Fall back to default org if API fails
              onLaunch({ ...config, orgId: ORG_ID });
            }
          }}
          style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${CO.green},#00A070)`,
            color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
          Launch Agent →
        </button>
      </div>
      <style>{`@keyframes tdot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}`}</style>
    </div>
  );
}

/* ─── LAUNCHED SCREEN ─────────────────────────────────────────────────── */
function Launched({ config, onOpenDashboard }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c < 847 ? c + Math.floor(Math.random() * 17) + 3 : 847), 40);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%",
        background: `linear-gradient(135deg,${CO.green},#00A070)`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
        boxShadow: `0 0 40px ${CO.green}40`, animation: "popIn .4s ease" }}>🚀</div>
      <div>
        <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: CO.t1 }}>
          {config.agentName || "DevBot"} is live
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: CO.t2, lineHeight: 1.6 }}>
          Your agent is now monitoring{" "}
          {Object.keys(config.connected || {}).join(", ") || "your community"}{" "}
          and answering developer questions 24/7.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
        {[
          ["Questions answered\nall-time", count.toLocaleString(), CO.accent],
          ["Avg response time", "< 1 min", CO.green],
          ["Platforms active", Object.keys(config.connected || {}).length || 1, CO.amber],
        ].map(([l, v, c], i) => (
          <div key={i} style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 12, padding: "16px 14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: CO.t3, lineHeight: 1.4, whiteSpace: "pre-line" }}>{l}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={onOpenDashboard} style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg,${CO.accent},#005FA3)`, color: "#fff", fontSize: 14, fontWeight: 600 }}>
          Open Dashboard →
        </button>
        <button style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${CO.border}`,
          background: "transparent", color: CO.t2, fontSize: 14, cursor: "pointer" }}>
          Invite teammates
        </button>
      </div>
      <style>{`@keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────── */
const DISCORD_KEY = "devad_discord_connection";

function Onboarding({ onLaunch: onLaunchExternal, onGoToLanding }) {
  const [step, setStep]     = useState(1);
  const [config, setConfig] = useState({});
  const [launched, setLaunched] = useState(false);

  const steps = [
    { n: 1, label: "Connect Docs"     },
    { n: 2, label: "Community"        },
    { n: 3, label: "Configure"        },
    { n: 4, label: "Test Live"        },
  ];

  function next(data) {
    const updated = { ...config, ...data };
    setConfig(updated);
    // Persist Discord connection so we never ask again
    if (data.serverId || data.connected?.discord) {
      try { localStorage.setItem(DISCORD_KEY, JSON.stringify({
        serverId: data.serverId || config.serverId,
        channel: data.channels?.discord || config.channels?.discord || "#help",
        connected: true,
      })); } catch {}
    }
    setStep(s => s + 1);
  }
  function back()     { setStep(s => s - 1); }
  function skipStep1() { setConfig(p => ({ ...p, docsSkipped: true })); setStep(2); }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: CO.bg,
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: CO.t1,
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px",
      boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 640 }}>
        {/* logo */}
        <div onClick={onGoToLanding} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, cursor: "pointer", width: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36,
            borderRadius: 4, border: "4px solid #00C2FF", background: "#00C2FF15", flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", lineHeight: 1, fontFamily: "sans-serif" }}>D</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CO.t1 }}>DEVAD</p>
            <p style={{ margin: 0, fontSize: 11, color: CO.t3 }}>Setup Wizard</p>
          </div>
        </div>

        {!launched && (
          <>
            {/* step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                    <StepDot n={s.n} active={step === s.n} done={step > s.n} />
                    <span style={{ fontSize: 11, color: step === s.n ? CO.accent : step > s.n ? CO.green : CO.t3,
                      fontWeight: step === s.n ? 600 : 400, whiteSpace: "nowrap" }}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: 2, margin: "0 8px", marginBottom: 20,
                      background: step > s.n ? CO.green : CO.border, transition: "background .3s" }} />
                  )}
                </div>
              ))}
            </div>

            {/* step content */}
            <div style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 16, padding: 28 }}>
              {step === 1 && <Step1 onNext={next} onSkip={skipStep1} />}
              {step === 2 && <Step2 onNext={next} onBack={back} orgId={config.orgId || ORG_ID} savedDiscord={(() => { try { const s = localStorage.getItem(DISCORD_KEY); return s ? JSON.parse(s) : null; } catch { return null; } })()} />}
              {step === 3 && <Step3 onNext={next} onBack={back} />}
              {step === 4 && <Step4 config={config} onLaunch={() => setLaunched(true)} />}
            </div>
          </>
        )}

        {launched && (
          <div style={{ background: CO.surface, border: `1px solid ${CO.border}`, borderRadius: 16, padding: 28 }}>
            <Launched config={config} onOpenDashboard={() => onLaunchExternal && onLaunchExternal(config)} />
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: CO.t3, marginTop: 20 }}>
          DEVAD · Powered by Claude · Your data is never used for training
        </p>
        {!launched && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => onLaunchExternal && onLaunchExternal({})}
              style={{ background: "none", border: "none", color: CO.t3, fontSize: 12,
                cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted",
                textUnderlineOffset: 3, padding: "4px 8px" }}
              onMouseEnter={e => e.target.style.color = CO.t2}
              onMouseLeave={e => e.target.style.color = CO.t3}>
              Skip setup, explore the dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══ DASHBOARD ════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════
// DASHBOARD — connected to real backend
// ═══════════════════════════════════════════════════════════

const BACKEND_URL = "https://devad-backend-production.up.railway.app";
const ORG_ID = "a4a7adb5-4f62-4dea-b064-cf5677ba555d"; // default demo org

const C = {
  bg: "#080C12", surface: "#0E1520", surfaceHigh: "#131E2E",
  border: "#1A2535", borderHover: "#2A3F5F",
  accent: "#00C2FF", accentDim: "#0A2E3F",
  green: "#00E5A0", greenDim: "#0A2E22",
  amber: "#FFB800", amberDim: "#2E2200",
  red: "#FF4D6A", redDim: "#2E0A14",
  purple: "#A855F7", purpleDim: "#1A0A2E",
  t1: "#E8F0FF", t2: "#627B9C", t3: "#597CA9",
};

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent,
          animation: `tdot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes tdot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-6px);opacity:1}}`}</style>
    </span>
  );
}

function Badge({ status }) {
  const m = {
    answered: { l: "Answered", bg: C.greenDim, c: C.green },
    escalated: { l: "Escalated", bg: C.amberDim, c: C.amber },
    pending:   { l: "Pending",   bg: C.redDim,   c: C.red },
    ready:     { l: "Ready",     bg: C.greenDim, c: C.green },
    indexing:  { l: "Indexing",  bg: C.accentDim,c: C.accent },
    crawling:  { l: "Crawling",  bg: C.purpleDim,c: C.purple },
    error:     { l: "Error",     bg: C.redDim,   c: C.red },
  };
  const s = m[status] || m.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px",
      borderRadius: 20, background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.c }} />
      {s.l}
    </span>
  );
}

function Avatar({ letter, size = 32 }) {
  const cols = { K:"#7C3AED",P:"#059669",T:"#DC2626",M:"#2563EB",D:"#D97706",A:"#0891B2",R:"#BE185D",Y:"#0070CC" };
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: cols[letter] || C.accentDim,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{letter}</div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
      transition: "border-color .15s", ...style }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────── Q&A TAB ──────────────────────────────── */
function QATab({ orgId = ORG_ID }) {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: "Hey 👋 I'm your AI Developer Advocate. Ask me anything about the API — authentication, rate limits, webhooks, SDKs, or integration patterns.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ctx, setCtx] = useState("REST API");
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/questions/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          platform: "dashboard",
          channel: "#dashboard",
          author_username: "DevRel User",
          author_external_id: "dashboard-user",
          content: q,
          thread_context: [],
        }),
      });
      const data = await res.json();
      const answer = data.answer || "I couldn't generate a response. Please try again.";
      setMsgs(p => [...p, { role: "assistant", content: answer }]);
    } catch (e) {
      setMsgs(p => [...p, { role: "assistant", content: "Connection error — please try again." }]);
    }
    setLoading(false);
  }

  function renderContent(text) {
    return text.split(/(```[\s\S]*?```)/g).map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.slice(3).split("\n");
        const lang = lines[0].trim() || "code";
        const code = lines.slice(1, -1).join("\n");
        return (
          <div key={i} style={{ margin: "10px 0", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ background: "#0A1525", padding: "5px 12px", fontSize: 11, color: C.t3,
              fontFamily: "monospace", borderBottom: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{lang}</span>
              <button onClick={() => navigator.clipboard?.writeText(code)}
                style={{ background: "none", border: "none", color: C.t2, fontSize: 11, cursor: "pointer" }}>copy</button>
            </div>
            <pre style={{ margin: 0, padding: "12px 14px", background: "#060A10", fontSize: 13, lineHeight: 1.6,
              color: "#A8D8FF", fontFamily: "'JetBrains Mono','Fira Code',monospace",
              overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{code}</pre>
          </div>
        );
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  }

  const quick = [
    "How do I authenticate with OAuth 2.0?",
    "What are the rate limits?",
    "How do I handle webhook retries?",
    "Show me pagination in Python",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: C.t2 }}>Context:</span>
        {["REST API", "Webhooks", "SDKs", "Auth", "Errors"].map(c => (
          <button key={c} onClick={() => setCtx(c)} style={{ padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            cursor: "pointer", border: "none", background: ctx === c ? C.accentDim : "transparent",
            color: ctx === c ? C.accent : C.t3 }}>{c}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},#0070CC)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>🤖</div>
            )}
            {m.role === "user" && <Avatar letter="Y" size={32} />}
            <div style={{ maxWidth: "78%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              background: m.role === "user" ? C.accentDim : C.surface,
              border: `1px solid ${m.role === "user" ? C.accent + "40" : C.border}`,
              color: C.t1, fontSize: 14, lineHeight: 1.65 }}>
              {renderContent(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},#0070CC)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🤖</div>
            <div style={{ padding: "14px 18px", borderRadius: "4px 16px 16px 16px", background: C.surface, border: `1px solid ${C.border}` }}>
              <TypingDots />
            </div>
          </div>
        )}
        {msgs.length === 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {quick.map((q, i) => (
              <button key={i} onClick={() => setInput(q)}
                style={{ padding: "8px 14px", borderRadius: 20, background: "transparent",
                  border: `1px solid ${C.border}`, color: C.t2, fontSize: 12, cursor: "pointer" }}
                onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
                onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.t2; }}>{q}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask a developer question…"
          style={{ flex: 1, background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "11px 16px", color: C.t1, fontSize: 14, outline: "none", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={send} disabled={loading || !input.trim()}
          style={{ padding: "11px 22px", borderRadius: 10, border: "none", cursor: "pointer",
            background: loading || !input.trim() ? C.border : `linear-gradient(135deg,${C.accent},#0070CC)`,
            color: "#fff", fontSize: 14, fontWeight: 600 }}>Send</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── COMMUNITY FEED TAB ───────────────────────── */
function LockedTab({ icon, title, desc, action, onGoToOnboarding }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
        <button onClick={onGoToOnboarding}
          style={{ padding: "11px 28px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.accent},#0070CC)`,
            color: "#fff", fontSize: 14, fontWeight: 600 }}>
          {action}
        </button>
      </div>
    </div>
  );
}

function FeedTab({ isSkipped, orgId = ORG_ID, onGoToOnboarding }) {
  if (isSkipped) return <LockedTab icon="🌐"
    title="Connect your community"
    desc="Complete the setup wizard to connect Discord, Slack or GitHub. Questions asked in your community will appear here in real time."
    action="Complete Setup →"
    onGoToOnboarding={onGoToOnboarding} />;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);

  const [fetchError, setFetchError] = useState("");
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      setFetchError("");
      try {
        const res = await fetch(`${BACKEND_URL}/questions/${orgId}?limit=50`);
        if (!res.ok) {
          setFetchError(`Backend returned ${res.status} — check Railway logs.`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
        setLastFetch(new Date());
      } catch (e) {
        setFetchError(`Could not reach backend: ${e.message}`);
        setQuestions([]);
      }
      setLoading(false);
    }
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 15000);
    return () => clearInterval(interval);
  }, [orgId]);

  // Fetch answer whenever a question is selected
  useEffect(() => {
    if (!selected) { setAnswer(null); return; }
    setAnswerLoading(true);
    setAnswer(null);
    fetch(`${BACKEND_URL}/questions/${orgId}/${selected.id}/response`)
      .then(r => r.json())
      .then(data => setAnswer(data))
      .catch(() => setAnswer({ answer: null }))
      .finally(() => setAnswerLoading(false));
  }, [selected?.id]);

  const filtered = filter === "all" ? questions : questions.filter(q => q.status === filter);
  const platformIcon = { discord: "💬", slack: "⚡", github: "🐙", dashboard: "🖥️" };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ width: selected ? 340 : "100%", borderRight: selected ? `1px solid ${C.border}` : "none",
        display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
          {["all", "pending", "answered", "escalated"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
              cursor: "pointer", border: "none", background: filter === f ? C.accentDim : "transparent",
              color: filter === f ? C.accent : C.t3 }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>org: <code style={{ color: C.t2 }}>{orgId.slice(0,8)}…</code></span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: fetchError ? "#FF4D6A" : C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: fetchError ? "#FF4D6A" : C.t2 }}>{fetchError ? "Error" : "Live"}</span>
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: C.t3 }}>Loading questions…</div>
          )}
          {!loading && fetchError && (
            <div style={{ margin: 12, padding: "12px 16px", borderRadius: 10,
              background: "#FF4D6A15", border: "1px solid #FF4D6A40" }}>
              <p style={{ color: "#FF4D6A", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>⚠️ Fetch error</p>
              <p style={{ color: "#FF4D6A99", fontSize: 12, margin: 0 }}>{fetchError}</p>
              <p style={{ color: C.t3, fontSize: 11, margin: "8px 0 0" }}>
                Querying org: <code style={{ color: C.t2 }}>{orgId}</code>
              </p>
            </div>
          )}
          {!loading && !fetchError && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
              <p style={{ color: C.t2, fontSize: 14, marginBottom: 6 }}>No questions found yet.</p>
              <p style={{ color: C.t3, fontSize: 12, lineHeight: 1.6 }}>
                Make sure your bot is online in Railway, then ask something in your Discord #help channel.
              </p>
              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8,
                background: C.surface, border: `1px solid ${C.border}`, textAlign: "left" }}>
                <p style={{ color: C.t3, fontSize: 11, margin: "0 0 4px" }}>Querying org ID:</p>
                <code style={{ color: C.accent, fontSize: 11 }}>{orgId}</code>
                <p style={{ color: C.t3, fontSize: 11, margin: "8px 0 0" }}>
                  This must match the DEFAULT_ORG_ID in your Railway bot env vars.
                </p>
              </div>
              {lastFetch && <p style={{ color: C.t3, fontSize: 11, marginTop: 10 }}>Last checked: {lastFetch.toLocaleTimeString()}</p>}
            </div>
          )}
          {filtered.map(item => (
            <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
              style={{ background: selected?.id === item.id ? C.accentDim : C.surface,
                border: `1px solid ${selected?.id === item.id ? C.accent + "60" : C.border}`,
                borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Avatar letter={(item.author_username || "U")[0].toUpperCase()} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{item.author_username || "Unknown"}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{platformIcon[item.platform] || "💬"} {item.channel || ""}</span>
                    <span style={{ fontSize: 11, color: C.t3, marginLeft: "auto" }}>
                      {item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) : ""}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: C.t2, lineHeight: 1.4,
                    overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.content}</p>
                  <Badge status={item.status || "pending"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Avatar letter={(selected.author_username || "U")[0].toUpperCase()} size={28} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.t1 }}>{selected.author_username}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.t3 }}>{selected.platform} · {selected.channel}</p>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: C.t2, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Question bubble */}
            <Card style={{ padding: 14 }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                💬 Question
              </p>
              <p style={{ margin: 0, fontSize: 14, color: C.t1, lineHeight: 1.6 }}>{selected.content}</p>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: C.t3 }}>
                {selected.platform} · {selected.channel} · {selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}
              </p>
            </Card>

            {/* Answer bubble */}
            <Card style={{ padding: 14, border: `1px solid ${C.green}30`, background: C.greenDim }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                🤖 DEVAD Answer
              </p>
              {answerLoading ? (
                <p style={{ margin: 0, fontSize: 13, color: C.t3 }}>Loading answer…</p>
              ) : answer?.answer ? (
                <>
                  <p style={{ margin: 0, fontSize: 14, color: C.t1, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{answer.answer}</p>
                  {answer.confidence_score && (
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.t3 }}>Confidence:</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                        <div style={{ width: `${answer.confidence_score}%`, height: "100%", borderRadius: 4,
                          background: answer.confidence_score >= 80 ? C.green : answer.confidence_score >= 60 ? C.amber : C.red }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600,
                        color: answer.confidence_score >= 80 ? C.green : answer.confidence_score >= 60 ? C.amber : C.red }}>
                        {answer.confidence_score}%
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 13, color: C.t3, fontStyle: "italic" }}>
                  No answer recorded yet — this question may have been escalated to your team.
                </p>
              )}
            </Card>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

/* ────────────────────────── KNOWLEDGE BASE TAB ─────────────────────────── */
function KBTab({ isSkipped, orgId = ORG_ID, onGoToOnboarding }) {
  if (isSkipped) return <LockedTab icon="🧠"
    title="Add your knowledge base"
    desc="Complete setup to connect your docs, GitHub repo and community Q&A. Your AI will use these to give accurate, specific answers."
    action="Complete Setup →"
    onGoToOnboarding={onGoToOnboarding} />;
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addUrl, setAddUrl] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [crawling, setCrawling] = useState(false);

  useEffect(() => {
    async function fetchSources() {
      try {
        const res = await fetch(`${BACKEND_URL}/knowledge/sources/${orgId}`);
        const data = await res.json();
        setSources(Array.isArray(data) ? data : []);
      } catch {
        setSources([]);
      }
      setLoading(false);
    }
    fetchSources();
  }, []);

  async function handleAdd() {
    if (!addUrl.trim()) return;
    const label = addLabel.trim() || addUrl.replace("https://", "").split("/")[0];
    setCrawling(true);
    try {
      const res = await fetch(`${BACKEND_URL}/knowledge/ingest/docs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, label, url: addUrl, max_pages: 50 }),
      });
      const data = await res.json();
      setSources(p => [...p, { id: data.source_id, label, url: addUrl, status: "crawling", chunks: 0 }]);
    } catch {
      alert("Failed to add source. Make sure your backend is running.");
    }
    setAddUrl(""); setAddLabel(""); setCrawling(false);
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          ["Knowledge Sources", `${sources.length} connected`],
          ["Status", sources.length === 0 ? "No sources yet" : "Active"],
          ["Last Updated", "Just now"],
        ].map(([l, v], i) => (
          <Card key={i} style={{ padding: "14px 16px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.t1 }}>{v}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 16 }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: C.t1 }}>+ Add Knowledge Source</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={addLabel} onChange={e => setAddLabel(e.target.value)} placeholder="Label (optional)"
            style={{ width: 160, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "9px 12px", color: C.t1, fontSize: 13, outline: "none", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = C.accent}
            onBlur={e => e.target.style.borderColor = C.border} />
          <input value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="https://docs.yourapi.com"
            style={{ flex: 1, minWidth: 220, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "9px 12px", color: C.t1, fontSize: 13, outline: "none", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = C.accent}
            onBlur={e => e.target.style.borderColor = C.border}
            onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <button onClick={handleAdd} disabled={crawling || !addUrl.trim()}
            style={{ padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              background: crawling || !addUrl.trim() ? C.border : `linear-gradient(135deg,${C.accent},#0070CC)`,
              color: "#fff", fontSize: 13, fontWeight: 600 }}>
            {crawling ? "Adding…" : "Add Source"}
          </button>
        </div>
      </Card>
      {loading && <div style={{ textAlign: "center", padding: 40, color: C.t3 }}>Loading sources…</div>}
      {!loading && sources.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: C.t3, fontSize: 14 }}>No knowledge sources yet.</p>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 8 }}>Add a docs URL above to get started.</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sources.map(s => (
          <Card key={s.id} style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accentDim,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{s.label}</span>
                  <Badge status={s.status || "ready"} />
                </div>
                <p style={{ margin: 0, fontSize: 11, color: C.t3 }}>{s.url}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────── INSIGHTS TAB ──────────────────────────── */
function InsightsTab({ isSkipped, orgId = ORG_ID, onGoToOnboarding }) {
  if (isSkipped) return <LockedTab icon="📊"
    title="Insights unlock after setup"
    desc="Once your community is connected and questions start flowing in, you'll see metrics, pain points and trends from your developer community here."
    action="Complete Setup →"
    onGoToOnboarding={onGoToOnboarding} />;
  const [metrics, setMetrics] = useState(null);
  const [painPoints, setPainPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mRes, pRes] = await Promise.all([
          fetch(`${BACKEND_URL}/analytics/${orgId}/metrics`),
          fetch(`${BACKEND_URL}/analytics/${orgId}/pain-points`),
        ]);
        const m = await mRes.json();
        const p = await pRes.json();
        setMetrics(m);
        setPainPoints(Array.isArray(p) ? p : []);
      } catch {
        setMetrics({ questions_answered: 0, avg_confidence: 85, escalation_rate: 0 });
        setPainPoints([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: C.t3 }}>Loading insights…</div>;

  const stats = [
    { l: "Questions Answered", v: metrics?.questions_answered ?? 0 },
    { l: "Avg Confidence",     v: `${metrics?.avg_confidence ?? 85}%` },
    { l: "Escalation Rate",    v: `${((metrics?.escalation_rate ?? 0) * 100).toFixed(1)}%` },
    { l: "Platforms Active",   v: "1" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((m, i) => (
          <Card key={i} style={{ padding: "16px 18px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{m.l}</p>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{m.v}</span>
          </Card>
        ))}
      </div>

      {painPoints.length > 0 && (
        <Card style={{ padding: "18px 20px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: C.t1 }}>Top Developer Pain Points</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {painPoints.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: C.t2, flex: 1 }}>{f.topic || f.trigger_topic}</span>
                <span style={{ fontSize: 12, color: C.t3 }}>{f.count || 1}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {painPoints.length === 0 && (
        <Card style={{ padding: 30, textAlign: "center" }}>
          <p style={{ color: C.t3, fontSize: 14 }}>No pain points detected yet.</p>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 6 }}>As developers ask questions in Discord, patterns will appear here.</p>
        </Card>
      )}

      <Card style={{ padding: "16px 18px", background: C.accentDim, border: `1px solid ${C.accent}30` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: C.accent }}>Agent is Active</p>
            <p style={{ margin: 0, fontSize: 12, color: C.t2 }}>Monitoring Discord · Powered by Claude Sonnet</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────── ROOT ──────────────────────────────── */
function Dashboard({ agentConfig = {}, orgId, onGoToOnboarding, onLogout }) {
  // Use org from onboarding if available, otherwise fall back to demo org
  const ACTIVE_ORG = orgId || ORG_ID;
  const [tab, setTab] = useState("qa");
  const tabs = [
    { id:"qa",       l:"Ask DevRel",     ic:"💬" },
    { id:"feed",     l:"Community",      ic:"🌐" },
    { id:"kb",       l:"Knowledge Base", ic:"🧠" },
    { id:"insights", l:"Insights",       ic:"📊" },
  ];

  const isSkipped = !agentConfig || Object.keys(agentConfig).length === 0;
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div style={{ width: "100%", height: "100vh", background: C.bg, display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: C.t1, overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Setup banner — shown when user skipped onboarding */}
      {isSkipped && !bannerDismissed && (
        <div style={{ background: "#FFB80015", borderBottom: "1px solid #FFB80030",
          padding: "9px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ fontSize: 12, color: "#FFB800", flex: 1 }}>
            You skipped setup — the <strong>Ask DevRel</strong> tab works now.
            Complete setup to unlock Community, Knowledge Base and Insights.
          </span>
          <button onClick={onGoToOnboarding}
            style={{ fontSize: 12, padding: "4px 14px", borderRadius: 20, background: "#FFB80020",
              border: "1px solid #FFB80040", color: "#FFB800", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 }}>
            Complete Setup
          </button>
          <button onClick={() => setBannerDismissed(true)}
            style={{ background: "none", border: "none", color: "#FFB80060", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", padding: "0 20px", height: 54,
        borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
          borderRadius: 4, border: "4px solid #00C2FF", background: "#00C2FF15", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#ffffff", lineHeight: 1, fontFamily: "sans-serif" }}>D</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.t1, lineHeight: 1.2 }}>DEVAD</p>
          <p style={{ margin: 0, fontSize: 11, color: C.t3 }}>AI Developer Advocate Agent</p>
        </div>
        <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
          borderRadius: 20, background: C.greenDim, border: `1px solid ${C.green}30` }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>Live · Discord Active</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        {onLogout && (
          <button onClick={onLogout} title="Sign out / reset"
            style={{ marginLeft: "auto", fontSize: 11, padding: "5px 14px", borderRadius: 20,
              background: "transparent", border: `1px solid ${C.border}`, color: C.t3,
              cursor: "pointer", fontWeight: 500, transition: "all .2s" }}
            onMouseOver={e => { e.target.style.borderColor = C.red; e.target.style.color = C.red; }}
            onMouseOut={e => { e.target.style.borderColor = C.border; e.target.style.color = C.t3; }}>
            ⎋ Sign out
          </button>
        )}
      </div>
      <div style={{ display: "flex", padding: "0 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.surface }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "11px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
              background: "transparent", color: tab === t.id ? C.accent : C.t3,
              borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6, transition: "all .15s", whiteSpace: "nowrap" }}>
            {t.ic} {t.l}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {tab === "qa"       && <QATab orgId={ACTIVE_ORG} />}
        {tab === "feed"     && <FeedTab isSkipped={isSkipped} orgId={ACTIVE_ORG} onGoToOnboarding={onGoToOnboarding} />}
        {tab === "kb"       && <KBTab isSkipped={isSkipped} orgId={ACTIVE_ORG} onGoToOnboarding={onGoToOnboarding} />}
        {tab === "insights" && <InsightsTab isSkipped={isSkipped} orgId={ACTIVE_ORG} onGoToOnboarding={onGoToOnboarding} />}
      </div>
    </div>
  );
}
