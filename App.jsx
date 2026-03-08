import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DevRel AI — Combined App
// Onboarding wizard → Dashboard with live backend connection
// Backend: https://devad-backend-production.up.railway.app/
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [agentConfig, setAgentConfig] = useState({});

  function handleLaunch(config) {
    setAgentConfig(config);
    setScreen("dashboard");
  }

  return screen === "onboarding"
    ? <Onboarding onLaunch={handleLaunch} />
    : <Dashboard agentConfig={agentConfig} />;
}

// ═══ ONBOARDING ═══════════════════════════════════════════════════════════


const CO = {
  bg: "#060910", surface: "#0C1420", surfaceHigh: "#111C2C",
  border: "#18243A", borderHover: "#283D60",
  accent: "#00C2FF", accentDim: "#091E2E", accentGlow: "#00C2FF25",
  green: "#00E5A0", greenDim: "#08221A",
  amber: "#FFB800", amberDim: "#221800",
  red: "#FF4D6A",
  t1: "#ECF2FF", t2: "#5A7490", t3: "#2D4260",
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
function Step1({ onNext }) {
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

      <button onClick={() => onNext({ docsUrl: url, pageCount: total })} disabled={!done}
        style={{ alignSelf: "flex-end", padding: "12px 28px", borderRadius: 10, border: "none",
          cursor: done ? "pointer" : "default", fontSize: 14, fontWeight: 600,
          background: done ? `linear-gradient(135deg,${CO.accent},#005FA3)` : CO.border,
          color: done ? "#fff" : CO.t3, transition: "all .2s" }}>
        Continue →
      </button>
    </div>
  );
}

/* ─── STEP 2: Connect Community ────────────────────────────────────────── */
function Step2({ onNext, onBack }) {
  const [connected, setConnected] = useState({});
  const [connecting, setConnecting] = useState(null);
  const [channels, setChannels]   = useState({ discord: "#help", slack: "#dev-support" });

  const platforms = [
    { id: "discord", name: "Discord", icon: "💬", color: "#5865F2",
      desc: "Monitor channels, auto-answer questions, post responses as a bot",
      channelLabel: "Watch channel", channelPlaceholder: "#help" },
    { id: "slack",   name: "Slack",   icon: "⚡", color: "#4A154B",
      desc: "Respond in workspace channels and DMs",
      channelLabel: "Watch channel", channelPlaceholder: "#dev-support" },
    { id: "github",  name: "GitHub",  icon: "🐙", color: "#24292F",
      desc: "Triage issues, answer discussions, detect docs friction",
      channelLabel: "Repository", channelPlaceholder: "yourorg/your-repo" },
    { id: "stackoverflow", name: "Stack Overflow", icon: "📚", color: "#F48024",
      desc: "Monitor and answer questions tagged with your product",
      channelLabel: "Tag", channelPlaceholder: "your-api-tag" },
  ];

  async function handleConnect(id) {
    setConnecting(id);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setConnected(prev => ({ ...prev, [id]: true }));
    setConnecting(null);
  }

  const connectedCount = Object.keys(connected).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: CO.t1 }}>Connect your community</h2>
        <p style={{ margin: 0, fontSize: 14, color: CO.t2, lineHeight: 1.6 }}>
          Choose where your developers live. Your agent will monitor these channels 24/7 and respond to questions automatically. Connect at least one to continue.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {platforms.map(p => (
          <div key={p.id} style={{ background: CO.surface,
            border: `1px solid ${connected[p.id] ? CO.green + "50" : CO.border}`,
            borderRadius: 12, padding: "14px 16px", transition: "all .2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color + "20",
                border: `1px solid ${p.color}30`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: CO.t1 }}>{p.name}</span>
                  {connected[p.id] && <Pill color={CO.green}>Connected</Pill>}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: CO.t2 }}>{p.desc}</p>
              </div>
              <button
                onClick={() => !connected[p.id] && handleConnect(p.id)}
                disabled={!!connected[p.id] || connecting === p.id}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: connected[p.id] ? "default" : "pointer",
                  background: connected[p.id] ? CO.greenDim : connecting === p.id ? CO.border : p.color + "30",
                  color: connected[p.id] ? CO.green : connecting === p.id ? CO.t3 : p.color,
                  fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
                  border: connected[p.id] ? `1px solid ${CO.green}30` : `1px solid ${p.color}30` }}>
                {connecting === p.id ? "Connecting…" : connected[p.id] ? "✓ Connected" : "Connect"}
              </button>
            </div>

            {connected[p.id] && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${CO.border}`,
                display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: CO.t3, whiteSpace: "nowrap" }}>{p.channelLabel}:</span>
                <input
                  value={channels[p.id] || p.channelPlaceholder}
                  onChange={e => setChannels(prev => ({ ...prev, [p.id]: e.target.value }))}
                  placeholder={p.channelPlaceholder}
                  style={{ flex: 1, background: CO.bg, border: `1px solid ${CO.border}`, borderRadius: 8,
                    padding: "7px 12px", color: CO.t1, fontSize: 12, outline: "none", fontFamily: "monospace" }}
                  onFocus={e => e.target.style.borderColor = CO.accent}
                  onBlur={e => e.target.style.borderColor = CO.border} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${CO.border}`,
          background: "transparent", color: CO.t2, fontSize: 14, cursor: "pointer" }}>← Back</button>
        <button onClick={() => onNext({ connected, channels })} disabled={connectedCount === 0}
          style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: connectedCount > 0 ? "pointer" : "default",
            background: connectedCount > 0 ? `linear-gradient(135deg,${CO.accent},#005FA3)` : CO.border,
            color: connectedCount > 0 ? "#fff" : CO.t3, fontSize: 14, fontWeight: 600 }}>
          Continue → ({connectedCount} connected)
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
        <button onClick={onLaunch}
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
function Onboarding({ onLaunch: onLaunchExternal }) {
  const [step, setStep]     = useState(1);
  const [config, setConfig] = useState({});
  const [launched, setLaunched] = useState(false);

  const steps = [
    { n: 1, label: "Connect Docs"     },
    { n: 2, label: "Community"        },
    { n: 3, label: "Configure"        },
    { n: 4, label: "Test Live"        },
  ];

  function next(data) { setConfig(p => ({ ...p, ...data })); setStep(s => s + 1); }
  function back()     { setStep(s => s - 1); }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: CO.bg,
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: CO.t1,
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px",
      boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 640 }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
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
              {step === 1 && <Step1 onNext={next} />}
              {step === 2 && <Step2 onNext={next} onBack={back} />}
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

const BACKEND_URL = "https://44a06702-3fd9-4728-aeb8-384d921a51ef-00-xu125dii6n5c.riker.replit.dev";
const ORG_ID = "a4a7adb5-4f62-4dea-b064-cf5677ba555d";

const C = {
  bg: "#080C12", surface: "#0E1520", surfaceHigh: "#131E2E",
  border: "#1A2535", borderHover: "#2A3F5F",
  accent: "#00C2FF", accentDim: "#0A2E3F",
  green: "#00E5A0", greenDim: "#0A2E22",
  amber: "#FFB800", amberDim: "#2E2200",
  red: "#FF4D6A", redDim: "#2E0A14",
  purple: "#A855F7", purpleDim: "#1A0A2E",
  t1: "#E8F0FF", t2: "#607898", t3: "#354A65",
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
function QATab() {
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
          org_id: ORG_ID,
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
function LockedTab({ icon, title, desc, action }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
        <button onClick={() => window.location.reload()}
          style={{ padding: "11px 28px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.accent},#0070CC)`,
            color: "#fff", fontSize: 14, fontWeight: 600 }}>
          {action}
        </button>
      </div>
    </div>
  );
}

function FeedTab({ isSkipped }) {
  if (isSkipped) return <LockedTab icon="🌐"
    title="Connect your community"
    desc="Complete the setup wizard to connect Discord, Slack or GitHub. Questions asked in your community will appear here in real time."
    action="Complete Setup →" />;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`${BACKEND_URL}/questions/${ORG_ID}?limit=50`);
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (e) {
        setQuestions([]);
      }
      setLoading(false);
    }
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

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
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: C.t2 }}>Live</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: C.t3 }}>Loading questions…</div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: C.t3, fontSize: 14 }}>No questions yet.</p>
              <p style={{ color: C.t3, fontSize: 12, marginTop: 8 }}>Ask something in Discord #help to see it here!</p>
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
          <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
            <Card style={{ padding: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Question</p>
              <p style={{ margin: 0, fontSize: 14, color: C.t1, lineHeight: 1.6 }}>{selected.content}</p>
            </Card>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

/* ────────────────────────── KNOWLEDGE BASE TAB ─────────────────────────── */
function KBTab({ isSkipped }) {
  if (isSkipped) return <LockedTab icon="🧠"
    title="Add your knowledge base"
    desc="Complete setup to connect your docs, GitHub repo and community Q&A. Your AI will use these to give accurate, specific answers."
    action="Complete Setup →" />;
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addUrl, setAddUrl] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [crawling, setCrawling] = useState(false);

  useEffect(() => {
    async function fetchSources() {
      try {
        const res = await fetch(`${BACKEND_URL}/knowledge/sources/${ORG_ID}`);
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
        body: JSON.stringify({ org_id: ORG_ID, label, url: addUrl, max_pages: 50 }),
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
function InsightsTab({ isSkipped }) {
  if (isSkipped) return <LockedTab icon="📊"
    title="Insights unlock after setup"
    desc="Once your community is connected and questions start flowing in, you'll see metrics, pain points and trends from your developer community here."
    action="Complete Setup →" />;
  const [metrics, setMetrics] = useState(null);
  const [painPoints, setPainPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mRes, pRes] = await Promise.all([
          fetch(`${BACKEND_URL}/analytics/${ORG_ID}/metrics`),
          fetch(`${BACKEND_URL}/analytics/${ORG_ID}/pain-points`),
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
function Dashboard({ agentConfig = {} }) {
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
          <button onClick={() => window.location.reload()}
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
        {tab === "qa"       && <QATab />}
        {tab === "feed"     && <FeedTab isSkipped={isSkipped} />}
        {tab === "kb"       && <KBTab isSkipped={isSkipped} />}
        {tab === "insights" && <InsightsTab isSkipped={isSkipped} />}
      </div>
    </div>
  );
}
