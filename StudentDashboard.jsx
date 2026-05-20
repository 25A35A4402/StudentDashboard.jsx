import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";

const SUBJECTS = ["DMGT", "JAVA", "IDS", "UHV", "ADSAA"];

function getGrade(avg) {
  if (avg >= 90) return { label: "A+", color: "#00e5a0" };
  if (avg >= 80) return { label: "A",  color: "#4fc3f7" };
  if (avg >= 70) return { label: "B",  color: "#aed581" };
  if (avg >= 60) return { label: "C",  color: "#ffb74d" };
  return           { label: "D",  color: "#ef5350" };
}

function processData(raw) {
  const rows = raw.map((r) => {
    const marks = SUBJECTS.map((s) => Number(r[s]) || 0);
    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / SUBJECTS.length;
    const grade = getGrade(avg);
    return { ...r, ...Object.fromEntries(SUBJECTS.map((s, i) => [s, marks[i]])), Total: total, Average: avg, Grade: grade.label, GradeColor: grade.color };
  });
  const sorted = [...rows].sort((a, b) => b.Total - a.Total);
  let rank = 1;
  sorted.forEach((r, i) => {
    if (i > 0 && r.Total < sorted[i - 1].Total) rank = i + 1;
    r.Rank = rank;
  });
  return sorted.sort((a, b) => a.Rank - b.Rank);
}

const SAMPLE_DATA = [
  { Roll_No: 1, Name: "Aarav Sharma",    DMGT: 88, JAVA: 92, IDS: 85, UHV: 90, ADSAA: 94 },
  { Roll_No: 2, Name: "Bhavana Reddy",   DMGT: 76, JAVA: 80, IDS: 78, UHV: 72, ADSAA: 85 },
  { Roll_No: 3, Name: "Charan Kumar",    DMGT: 95, JAVA: 97, IDS: 93, UHV: 96, ADSAA: 98 },
  { Roll_No: 4, Name: "Divya Menon",     DMGT: 60, JAVA: 65, IDS: 58, UHV: 70, ADSAA: 62 },
  { Roll_No: 5, Name: "Esha Patel",      DMGT: 82, JAVA: 88, IDS: 84, UHV: 79, ADSAA: 91 },
  { Roll_No: 6, Name: "Farhan Malik",    DMGT: 55, JAVA: 48, IDS: 62, UHV: 50, ADSAA: 57 },
  { Roll_No: 7, Name: "Geetha Nair",     DMGT: 73, JAVA: 77, IDS: 71, UHV: 68, ADSAA: 80 },
  { Roll_No: 8, Name: "Harsha Varma",    DMGT: 91, JAVA: 89, IDS: 95, UHV: 88, ADSAA: 92 },
  { Roll_No: 9, Name: "Ishaan Joshi",    DMGT: 67, JAVA: 72, IDS: 69, UHV: 74, ADSAA: 70 },
  { Roll_No: 10, Name: "Jaya Lakshmi",   DMGT: 84, JAVA: 86, IDS: 81, UHV: 83, ADSAA: 88 },
];

function ScoreBar({ value, max = 100 }) {
  const pct = (value / max) * 100;
  const color = value >= 80 ? "#00e5a0" : value >= 60 ? "#ffb74d" : "#ef5350";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#aaa", minWidth: 28 }}>{value}</span>
    </div>
  );
}

function MedalIcon({ rank }) {
  if (rank === 1) return <span title="Gold">🥇</span>;
  if (rank === 2) return <span title="Silver">🥈</span>;
  if (rank === 3) return <span title="Bronze">🥉</span>;
  return <span style={{ color: "#555", fontFamily: "monospace", fontSize: 13 }}>#{rank}</span>;
}

export default function App() {
  const [data, setData] = useState(() => processData(SAMPLE_DATA));
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("ranking");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const loadCSV = useCallback((file) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => { setData(processData(res.data)); setSearchResult(null); setSearched(false); }
    });
  }, []);

  const handleFile = (e) => { if (e.target.files[0]) loadCSV(e.target.files[0]); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) loadCSV(f);
  };

  const handleSearch = () => {
    setSearched(true);
    const q = search.trim().toLowerCase();
    if (!q) { setSearchResult(null); return; }
    const num = parseInt(q);
    const found = isNaN(num)
      ? data.filter((r) => String(r.Name || "").toLowerCase().includes(q))
      : data.filter((r) => Number(r.Roll_No) === num);
    setSearchResult(found.length ? found : []);
  };

  const topper = data[0];

  const tabs = [
    { id: "ranking", label: "🏆 Rankings" },
    { id: "all",     label: "📋 All Details" },
    { id: "search",  label: "🔍 Search" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8eaf0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1a1d26; }
        ::-webkit-scrollbar-thumb { background: #2e3245; border-radius: 99px; }
        .tab-btn { border: none; cursor: pointer; padding: 8px 20px; border-radius: 8px; font-family: inherit; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .tab-btn.active { background: #1e90ff; color: #fff; }
        .tab-btn.inactive { background: rgba(255,255,255,0.05); color: #8890aa; }
        .tab-btn.inactive:hover { background: rgba(255,255,255,0.1); color: #c8ccdb; }
        .card { background: #13161f; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; }
        .search-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #e8eaf0; padding: 10px 16px; font-family: inherit; font-size: 14px; outline: none; transition: border 0.2s; }
        .search-input:focus { border-color: #1e90ff; }
        .search-btn { background: #1e90ff; border: none; color: #fff; padding: 10px 22px; border-radius: 10px; cursor: pointer; font-family: inherit; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .search-btn:hover { background: #1677d2; }
        .upload-area { border: 2px dashed rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-area.drag { border-color: #1e90ff; background: rgba(30,144,255,0.06); }
        .upload-area:hover { border-color: rgba(255,255,255,0.3); }
        tr:hover td { background: rgba(255,255,255,0.025) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 3, color: "#1e90ff", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>Academic Analytics</p>
            <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 600, letterSpacing: -0.5 }}>📘 Student Marks Analyzer</h1>
          </div>
          {/* CSV Upload */}
          <div
            className={`upload-area${dragOver ? " drag" : ""}`}
            style={{ minWidth: 200 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
            <div style={{ fontSize: 22, marginBottom: 4 }}>📂</div>
            <p style={{ fontSize: 12, color: "#8890aa" }}>Drop your CSV or <span style={{ color: "#1e90ff" }}>click to upload</span></p>
            <p style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Needs: Roll_No, Name, DMGT, JAVA, IDS, UHV, ADSAA</p>
          </div>
        </div>

        {/* Topper Banner */}
        {topper && (
          <div className="card fade-up" style={{ background: "linear-gradient(135deg, #0e2040 0%, #13161f 60%)", border: "1px solid rgba(30,144,255,0.25)", padding: "20px 28px", marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
            <div style={{ fontSize: 40 }}>🥇</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: "#1e90ff", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>Class Topper</p>
              <p style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{topper.Name}</p>
              <p style={{ color: "#8890aa", fontSize: 13, marginTop: 2 }}>Roll No: {topper.Roll_No}</p>
            </div>
            {[["Total", topper.Total], ["Average", Number(topper.Average).toFixed(1)], ["Grade", topper.Grade]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center", minWidth: 72 }}>
                <p style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: l === "Grade" ? topper.GradeColor : "#e8eaf0" }}>{v}</p>
                <p style={{ fontSize: 11, color: "#8890aa", letterSpacing: 1, textTransform: "uppercase" }}>{l}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Students", value: data.length, icon: "👥" },
            { label: "Subjects", value: SUBJECTS.length, icon: "📚" },
            { label: "Class Avg", value: data.length ? (data.reduce((a, r) => a + r.Average, 0) / data.length).toFixed(1) : "-", icon: "📊" },
            { label: "Top Score", value: data.length ? data[0].Total : "-", icon: "🏅" },
            { label: "A+ Count", value: data.filter((r) => r.Grade === "A+").length, icon: "⭐" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 20 }}>{s.icon}</p>
              <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", marginTop: 6 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#8890aa", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {tabs.map((t) => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : "inactive"}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Rankings Tab */}
        {activeTab === "ranking" && (
          <div className="card fade-up" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Rank", "Roll No", "Name", ...SUBJECTS, "Total", "Avg", "Grade"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#8890aa", fontWeight: 500, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((r, i) => (
                    <tr key={r.Roll_No ?? i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                      <td style={{ padding: "12px 16px", width: 50 }}><MedalIcon rank={r.Rank} /></td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace", color: "#8890aa", fontSize: 12 }}>{r.Roll_No}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{r.Name}</td>
                      {SUBJECTS.map((s) => (
                        <td key={s} style={{ padding: "12px 16px" }}><ScoreBar value={r[s]} /></td>
                      ))}
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{r.Total}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace" }}>{Number(r.Average).toFixed(1)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: `${r.GradeColor}22`, color: r.GradeColor, padding: "2px 10px", borderRadius: 99, fontWeight: 700, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{r.Grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Details Tab */}
        {activeTab === "all" && (
          <div className="card fade-up" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontWeight: 500 }}>All Student Records <span style={{ color: "#8890aa", fontSize: 12 }}>({data.length} students)</span></p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["#", "Roll No", "Name", ...SUBJECTS, "Total", "Average", "Grade", "Rank"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#8890aa", fontWeight: 500, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((r, i) => (
                    <tr key={r.Roll_No ?? i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "12px 16px", color: "#555", fontSize: 12 }}>{i + 1}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace", color: "#8890aa", fontSize: 12 }}>{r.Roll_No}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{r.Name}</td>
                      {SUBJECTS.map((s) => (
                        <td key={s} style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>{r[s]}</td>
                      ))}
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{r.Total}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Space Mono', monospace" }}>{Number(r.Average).toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: `${r.GradeColor}22`, color: r.GradeColor, padding: "2px 10px", borderRadius: 99, fontWeight: 700, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{r.Grade}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}><MedalIcon rank={r.Rank} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <p style={{ fontWeight: 500, marginBottom: 16 }}>🔍 Search by Name or Roll Number</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input className="search-input" style={{ flex: 1, minWidth: 200 }} placeholder="e.g. Aarav or 3" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <button className="search-btn" onClick={handleSearch}>Search</button>
                {searched && <button className="search-btn" style={{ background: "rgba(255,255,255,0.07)" }} onClick={() => { setSearch(""); setSearchResult(null); setSearched(false); }}>Clear</button>}
              </div>
            </div>

            {searched && searchResult !== null && (
              searchResult.length === 0
                ? <div className="card" style={{ padding: 24, textAlign: "center", color: "#ef5350" }}>❌ No student found for "{search}"</div>
                : searchResult.map((stud, idx) => (
                  <div key={idx} className="card" style={{ padding: 24, marginBottom: 16 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", marginBottom: 20 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 20, fontWeight: 600 }}>{stud.Name}</p>
                        <p style={{ color: "#8890aa", fontSize: 13, marginTop: 2 }}>Roll No: {stud.Roll_No}</p>
                      </div>
                      {[["🏅 Rank", `#${stud.Rank}`], ["📊 Total", stud.Total], ["📉 Average", Number(stud.Average).toFixed(2)], ["🎯 Grade", stud.Grade]].map(([l, v]) => (
                        <div key={l} style={{ textAlign: "center", minWidth: 80 }}>
                          <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: l.includes("Grade") ? stud.GradeColor : "#e8eaf0" }}>{v}</p>
                          <p style={{ fontSize: 11, color: "#8890aa" }}>{l}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#8890aa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>Subject Breakdown</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                      {SUBJECTS.map((s) => (
                        <div key={s} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
                          <p style={{ fontSize: 11, color: "#8890aa", marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>{s}</p>
                          <ScoreBar value={stud[s]} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        <p style={{ textAlign: "center", color: "#2e3245", fontSize: 11, marginTop: 32, fontFamily: "'Space Mono', monospace" }}>STUDENT MARKS ANALYZER • {data.length} RECORDS LOADED</p>
      </div>
    </div>
  );
}
