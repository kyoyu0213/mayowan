"use client";
import { useState, useEffect, useRef } from "react";

const ageOptions = [
  { v: "", l: "選んでください" },
  { v: "1", l: "0〜1歳" }, { v: "3", l: "2〜3歳" },
  { v: "5", l: "4〜6歳（幼稚園・保育園）" },
  { v: "8", l: "7〜9歳（小学校低学年）" },
  { v: "11", l: "10〜12歳（小学校高学年）" },
  { v: "14", l: "13〜15歳（中学生）" },
  { v: "17", l: "16〜18歳（高校生）" },
  { v: "20", l: "19〜22歳（大学生）" },
  { v: "25", l: "23〜30歳" },
];

const budgetOptions = [
  { v: "", l: "選んでください" },
  { v: "3000", l: "〜3,000円" }, { v: "5000", l: "3,000〜5,000円" },
  { v: "10000", l: "5,000〜10,000円" }, { v: "20000", l: "10,000〜20,000円" },
  { v: "30000", l: "20,000〜30,000円" }, { v: "50000", l: "30,000円以上" },
];

function Sparkles() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: 2 + Math.random() * 3, delay: Math.random() * 4, dur: 2.5 + Math.random() * 2,
    })));
  }, []);
  if (!particles.length) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: `${p.top}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(212,175,105,0.5)",
          animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Ribbon() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" style={{ display: "block", margin: "0 auto" }}>
      <path d="M10 30 Q30 5 60 20 Q90 5 110 30" stroke="url(#rg)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 18 Q60 10 70 18" stroke="url(#rg)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="20" r="4" fill="#D4AF69" />
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9956B" /><stop offset="50%" stopColor="#D4AF69" /><stop offset="100%" stopColor="#C9956B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Mascot({ size = 160 }) {
  return <img src="/mayowan_mascot.png" alt="まよわん" width={size} height={size} style={{ display: "block", margin: "0 auto" }} />;
}

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" /></svg>;
}

function Dots() {
  const [n, setN] = useState(0);
  useEffect(() => { const id = setInterval(() => setN((p) => (p + 1) % 4), 450); return () => clearInterval(id); }, []);
  return <span style={{ display: "inline-block", width: 20, textAlign: "left" }}>{".".repeat(n)}</span>;
}

function Medal({ rank }) {
  const c = { 1: ["#D4AF69","#E8C468","#7A5C1F"], 2: ["#A8B4C0","#C0CCD8","#4A5568"], 3: ["#C49A6C","#D4B08C","#6B4C2A"] }[rank] || ["#C49A6C","#D4B08C","#6B4C2A"];
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
      <path d="M12 0 L18 12 L24 0" stroke={c[0]} strokeWidth="6" fill="none" opacity="0.3" />
      <circle cx="18" cy="24" r="14" fill={c[0]} />
      <circle cx="18" cy="24" r="10.5" fill="none" stroke={c[1]} strokeWidth="1.5" />
      <text x="18" y="29" textAnchor="middle" fontSize="14" fontWeight="800" fill={c[2]}>{rank}</text>
    </svg>
  );
}

const selectStyle = {
  width: "100%", padding: "16px 44px 16px 16px", fontSize: 17,
  border: "2px solid #3A3028", borderRadius: 14,
  background: "#2A2018", color: "#F5EDE4",
  outline: "none", appearance: "none", WebkitAppearance: "none", cursor: "pointer",
  transition: "border-color 0.2s",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%238A7E72'%3E%3Cpath d='M4 7l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
};

export default function Mayowan() {
  const [step, setStep] = useState("form");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const resRef = useRef(null);
  const moreRef = useRef(null);
  const ready = age && gender && budget;

  useEffect(() => {
    if (step === "result" && resRef.current)
      setTimeout(() => resRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }, [step]);

  async function callAPI(exclude = []) {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, gender, budget, exclude }),
    });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  }

  async function submit() {
    if (!ready) return;
    setStep("loading");
    try {
      const parsed = await callAPI();
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("empty");
      setResults(parsed);
      setStep("result");
    } catch (e) {
      console.error(e);
      setError("うまくいきませんでした。もう一度お試しください。");
      setStep("error");
    }
  }

  function reset() { setStep("form"); setResults([]); setAge(""); setGender(""); setBudget(""); }

  async function loadMore() {
    if (!ready || loadingMore) return;
    setLoadingMore(true);
    try {
      const excludeNames = results.map((r) => r.name);
      const parsed = await callAPI(excludeNames);
      if (Array.isArray(parsed) && parsed.length) {
        setResults((prev) => [...prev, ...parsed]);
        setTimeout(() => moreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingMore(false);
  }

  const amazonUrl = (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}&tag=korekae02-22`;
  const rakutenUrl = (q) => `https://hb.afl.rakuten.co.jp/hgc/51bca08c.4386ed49.51bca08d.8a172c50/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encodeURIComponent(q)}%2F`;

  return (
    <div style={{ minHeight: "100vh", background: "#1E1710", fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", color: "#F5EDE4", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0;transform:scale(0.5)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mascotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes unwrap { 0%{opacity:0;transform:scale(0.9) translateY(20px)} 60%{transform:scale(1.02) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        .fade-up{animation:fadeUp .6s ease both}
        .unwrap{animation:unwrap .6s cubic-bezier(.34,1.56,.64,1) both}
        .result-card{transition:transform .25s,box-shadow .25s}
        .result-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3),0 0 20px rgba(212,175,105,.1)}
        .link-btn{transition:all .2s}
        .link-btn:hover{transform:translateY(-1px);filter:brightness(1.1)}
        select:focus{border-color:#D4AF69!important;box-shadow:0 0 0 3px rgba(212,175,105,.2)}
        button:focus-visible{outline:3px solid rgba(212,175,105,.4);outline-offset:2px}
        .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 30px rgba(212,175,105,.3)}
      `}</style>

      <header style={{ position: "relative", textAlign: "center", padding: "48px 24px 36px", background: "linear-gradient(180deg, #2A1F15 0%, #1E1710 100%)", overflow: "hidden" }}>
        <Sparkles />
        <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 500, height: 400, background: "radial-gradient(ellipse, rgba(212,175,105,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ animation: "mascotBounce 3s ease-in-out infinite" }}>
            <Mascot size={140} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 4, marginTop: 12, color: "#A09080" }}>
            プレゼント提案サービス
          </p>
          <div style={{ margin: "16px auto" }}><Ribbon /></div>
          <p style={{ fontSize: 18, lineHeight: 2, fontWeight: 500, maxWidth: 340, margin: "0 auto", color: "#E8DDD0" }}>
            3つ選ぶだけで、<br />
            <span style={{ fontWeight: 800, background: "linear-gradient(135deg, #E8C468, #D4AF69)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>喜ばれるプレゼント</span>が見つかります。
          </p>
          <p style={{ fontSize: 13, color: "#8A7E72", marginTop: 10 }}>
            お孫さんに"ありがとう"って言ってもらえる贈り物を。
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px 80px" }}>

        {(step === "form" || step === "result") && (
          <div>
            {step === "form" && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 36, padding: "16px 0" }}>
                {["年齢を選ぶ", "性別を選ぶ", "予算を選ぶ"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF69, #C49650)", color: "#1E1710", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#8A7E72", whiteSpace: "nowrap" }}>{t}</span>
                    {i < 2 && <span style={{ color: "#3A3028", fontSize: 11, margin: "0 2px" }}>→</span>}
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#D4C4B0" }}>🎂 贈る相手の年齢</label>
              <select value={age} onChange={(e) => { setAge(e.target.value); if (step === "result") setStep("form"); }} style={selectStyle}>
                {ageOptions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#D4C4B0" }}>👤 性別</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[{ v: "male", l: "男の子" }, { v: "female", l: "女の子" }, { v: "other", l: "どちらでも" }].map((g) => {
                  const on = gender === g.v;
                  return (
                    <button key={g.v} onClick={() => { setGender(g.v); if (step === "result") setStep("form"); }} style={{
                      padding: "16px 8px", fontSize: 16, fontWeight: on ? 700 : 500,
                      border: `2px solid ${on ? "#D4AF69" : "#3A3028"}`, borderRadius: 14, cursor: "pointer",
                      background: on ? "rgba(212,175,105,0.12)" : "#2A2018",
                      color: on ? "#E8C468" : "#A09080", transition: "all 0.2s",
                    }}>{g.l}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#D4C4B0" }}>💰 ご予算</label>
              <select value={budget} onChange={(e) => { setBudget(e.target.value); if (step === "result") setStep("form"); }} style={selectStyle}>
                {budgetOptions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <button className="submit-btn" disabled={!ready} onClick={submit} style={{
              width: "100%", padding: "20px", fontSize: 18, fontWeight: 700,
              border: "none", borderRadius: 14, letterSpacing: 1,
              background: ready ? "linear-gradient(135deg, #D4AF69 0%, #C49650 100%)" : "#2A2018",
              color: ready ? "#1E1710" : "#5A5048",
              cursor: ready ? "pointer" : "not-allowed", transition: "all 0.3s",
              boxShadow: ready ? "0 4px 20px rgba(212,175,105,0.25)" : "none",
            }}>🎁 プレゼントを提案してもらう</button>
          </div>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "48px 20px", position: "relative" }}>
            <Sparkles />
            <div style={{ animation: "mascotBounce 1.5s ease-in-out infinite", position: "relative", zIndex: 1 }}>
              <Mascot size={120} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#E8DDD0", marginTop: 16, position: "relative", zIndex: 1 }}>
              ぴったりのプレゼントを探しています<Dots />
            </p>
            <p style={{ fontSize: 14, color: "#8A7E72", marginTop: 8, position: "relative", zIndex: 1 }}>今のトレンドからあなたの条件に合うものを選んでいます</p>
          </div>
        )}

        {step === "error" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Mascot size={100} />
            <p style={{ fontSize: 17, fontWeight: 600, color: "#E8DDD0", marginTop: 16 }}>{error}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24, alignItems: "center" }}>
              <button onClick={submit} style={{ padding: "14px 40px", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 14, background: "linear-gradient(135deg, #D4AF69, #C49650)", color: "#1E1710", cursor: "pointer" }}>もう一度試す</button>
              <button onClick={reset} style={{ padding: "12px 32px", fontSize: 14, fontWeight: 500, border: "none", borderRadius: 14, background: "transparent", color: "#8A7E72", cursor: "pointer" }}>最初からやり直す</button>
            </div>
          </div>
        )}

        {step === "result" && results.length > 0 && (
          <div ref={resRef} style={{ marginTop: 44, position: "relative" }}>
            <Sparkles />
            <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 1 }}>
              <Mascot size={80} />
              <p style={{
                fontSize: 13, fontWeight: 700, letterSpacing: 4, marginTop: 12,
                background: "linear-gradient(135deg, #E8C468, #D4AF69)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>SPECIAL PICKS FOR YOU</p>
              <p style={{ fontSize: 24, fontWeight: 900, marginTop: 8, color: "#F5EDE4" }}>あなたへのおすすめ</p>
              <p style={{ fontSize: 13, color: "#8A7E72", marginTop: 8 }}>あなたの条件にぴったりの贈り物を選びました</p>
            </div>

            {results.map((item, i) => (
              <div key={i} className="unwrap result-card" style={{
                background: "linear-gradient(145deg, #2E2318 0%, #251C14 100%)",
                borderRadius: 18, border: "1px solid #3A3028", marginBottom: 20,
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)", animationDelay: `${i * 0.18}s`, overflow: "hidden",
              }}>
                <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #D4AF69, transparent)" }} />
                <div style={{ padding: "24px 24px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                    <Medal rank={i + 1} />
                    <div style={{ flex: 1, paddingTop: 6 }}>
                      <p style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.4, color: "#F5EDE4" }}>{item.name}</p>
                    </div>
                  </div>
                  <div style={{ background: "rgba(212,175,105,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, borderLeft: "3px solid #D4AF69" }}>
                    <p style={{ fontSize: 14, color: "#D4C4B0", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>💡 {item.reason}</p>
                  </div>
                  <p style={{
                    fontSize: 16, fontWeight: 700, marginBottom: 18,
                    background: "linear-gradient(135deg, #E8C468, #D4AF69)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{item.price}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <a href={amazonUrl(item.searchQuery)} target="_blank" rel="noopener noreferrer" className="link-btn" style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "14px 10px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                      border: "none", borderRadius: 12, background: "#FF9900", color: "#1E1710",
                    }}><SearchIcon /> Amazonで探す</a>
                    <a href={rakutenUrl(item.searchQuery)} target="_blank" rel="noopener noreferrer" className="link-btn" style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "14px 10px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                      border: "none", borderRadius: 12, background: "#BF0000", color: "#FFF",
                    }}><SearchIcon /> 楽天で探す</a>
                  </div>
                </div>
              </div>
            ))}

            <div ref={moreRef} />

            {loadingMore ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ animation: "mascotBounce 1.5s ease-in-out infinite", display: "inline-block" }}>
                  <Mascot size={56} />
                </div>
                <p style={{ fontSize: 14, color: "#8A7E72", marginTop: 8 }}>もっと探しています<Dots /></p>
              </div>
            ) : (
              <button onClick={loadMore} style={{
                width: "100%", padding: "18px", fontSize: 16, fontWeight: 700,
                border: "none", borderRadius: 14,
                background: "linear-gradient(135deg, #D4AF69 0%, #C49650 100%)",
                color: "#1E1710", cursor: "pointer",
                marginTop: 20, transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(212,175,105,0.25)",
              }}>🔍 ほかの候補も見る</button>
            )}

            <button onClick={reset} style={{
              width: "100%", padding: "18px", fontSize: 16, fontWeight: 700,
              border: "2px solid #D4AF69", borderRadius: 14,
              background: "transparent", color: "#D4AF69", cursor: "pointer",
              marginTop: 12, transition: "all 0.2s",
            }}>別の条件で探す</button>
          </div>
        )}
      </main>

      <div style={{ textAlign: "center", padding: "32px 20px", maxWidth: 500, margin: "0 auto" }}>
        <img src="/mayowan_mascot.png" alt="" width={48} height={48} style={{ borderRadius: "50%", marginBottom: 12 }} />
        <p style={{ fontSize: 14, fontWeight: 700, color: "#D4C4B0" }}>子供向け商品の開発経験を持つプロが監修</p>
        <p style={{ fontSize: 12, color: "#8A7E72", marginTop: 6, lineHeight: 1.8 }}>
          子供向け商品の企画開発に携わり、子供が本当に喜ぶものを研究してきた専門家が提案内容を監修しています。
        </p>
      </div>

      <footer style={{ textAlign: "center", padding: "28px 20px 36px", borderTop: "1px solid #2A2018", fontSize: 12, color: "#5A5048", lineHeight: 2 }}>
        <p>※ 提案内容は自動生成です。在庫・価格は各サイトでご確認ください。</p>
        <p>※ Amazon.co.jpアソシエイト / 楽天アフィリエイト</p>
        <p style={{ marginTop: 8, fontSize: 11, opacity: 0.5 }}>© まよわん — プレゼント提案サービス</p>
      </footer>
    </div>
  );
}
