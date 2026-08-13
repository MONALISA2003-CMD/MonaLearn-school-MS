"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, Heart,
  FileText, Puzzle, ClipboardCheck
} from "lucide-react";

const tokens = `
  .ml-root{
    --ink-900:#0B1B33; --ink-700:#12294B; --ink-500:#2C4A75; --ink-100:#E7ECF4;
    --emerald-700:#0B5E45; --emerald-600:#0E7C5A; --emerald-400:#3FAE85; --emerald-100:#DFF3EA;
    --paper-0:#FFFFFF; --mist-50:#F6F8FB; --mist-100:#F3F5F8; --mist-300:#DDE3EC; --mist-500:#8A94A6; --mist-700:#4B5568;
    --amethyst:#6B4FA0; --gold:#C9962C; --turquoise:#1B93A6; --orange:#D97A34; --soft-red:#C1503E;
    --radius-sm:6px; --radius-md:12px; --radius-lg:20px;
    --font-display:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif; --font-mono:'IBM Plex Mono', monospace;
    --bg:var(--paper-0); --surface:var(--mist-50); --text-primary:var(--ink-900); --text-secondary:var(--mist-700); --border:var(--mist-300);
    background:var(--bg); color:var(--text-primary); font-family:var(--font-body); min-height:100vh;
  }
  .ml-root[data-theme="dark"]{
    --bg:#0B1420; --surface:#111E30; --text-primary:#EDF1F7; --text-secondary:#9FADC2; --border:#233150; --mist-100:#16233A;
  }
  .ml-root *{box-sizing:border-box;}
  .page{padding:26px 28px 60px;}
  .page-head{display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap;}
  .eyebrow{font-family:var(--font-mono); font-size:11px; color:var(--emerald-600); text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px;}
  .h1{font-family:var(--font-display); font-size:26px; font-weight:700; margin:0; letter-spacing:-.01em;}
  .sub{color:var(--text-secondary); font-size:13.5px; margin-top:4px;}
  .ml-btn{font-family:var(--font-body); font-weight:600; font-size:13px; border-radius:var(--radius-sm); padding:9px 15px; cursor:pointer; border:1px solid transparent; display:flex; align-items:center; gap:6px;}
  .ml-btn-primary{background:var(--ink-700); color:#fff;}
  .ml-btn-outline{background:transparent; border-color:var(--border); color:var(--text-primary);}
  .ml-icon-btn{width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary); flex-shrink:0;}
  .subnav{display:flex; gap:6px; margin:22px 0 22px; border-bottom:1px solid var(--border); overflow-x:auto; padding-bottom:1px;}
  .subnav-item{display:flex; align-items:center; gap:7px; padding:10px 14px; font-size:13px; font-weight:600; color:var(--text-secondary); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;}
  .subnav-item.active{color:var(--ink-700); border-bottom-color:var(--ink-700);}
  [data-theme="dark"] .subnav-item.active{color:var(--emerald-400); border-bottom-color:var(--emerald-400);}
  .stat-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px;}
  @media (max-width:820px){ .stat-grid{grid-template-columns:repeat(2,1fr);} }
  .stat-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; position:relative; overflow:hidden;}
  .stat-card::before{content:""; position:absolute; left:0; top:0; bottom:0; width:4px;}
  .stat-card.blue::before{background:var(--ink-700);} .stat-card.green::before{background:var(--emerald-600);}
  .stat-card.gold::before{background:var(--gold);} .stat-card.red::before{background:var(--soft-red);}
  .stat-label{font-size:11.5px; color:var(--text-secondary); font-weight:600;}
  .stat-val{font-family:var(--font-mono); font-size:22px; font-weight:600; margin-top:6px;}
  .toolbar{display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap;}
  .search-box{flex:1; min-width:220px; display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:999px; padding:9px 14px; color:var(--text-secondary); font-size:13px;}
  .search-box input{border:none; outline:none; background:transparent; width:100%; font-family:var(--font-body); font-size:13px; color:var(--text-primary);}
  .chip{display:flex; align-items:center; gap:6px; border:1px solid var(--border); background:var(--bg); border-radius:999px; padding:8px 13px; font-size:12.5px; font-weight:600; color:var(--text-secondary); cursor:pointer;}
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.active, .pill.on-track, .pill.met{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.review, .pill.in-progress{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.at-risk{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .avatar{width:32px; height:32px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:12px; flex-shrink:0;}
  .student-cell{display:flex; align-items:center; gap:10px;}
  .accom-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; margin-bottom:12px;}
  .accom-title{font-weight:700; font-size:13.5px; margin-bottom:6px;}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleStudents = [
  { name: "Derrick Ssenyonga", cls: "S.1 Ruby", need: "Dyslexia support", planStatus: "active", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { name: "Patience Nakayima", cls: "S.2 Gold", need: "ADHD accommodations", planStatus: "review", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { name: "Emmanuel Byaruhanga", cls: "S.3 Green", need: "Hearing impairment", planStatus: "active", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
];

const sampleIepGoals = [
  { student: "Derrick Ssenyonga", goal: "Improve reading fluency to grade level by Term 3", progress: "in-progress" },
  { student: "Patience Nakayima", goal: "Complete assignments with extended time without prompting", progress: "on-track" },
  { student: "Emmanuel Byaruhanga", goal: "Use FM hearing system independently in all classes", progress: "met" },
];

const sampleAccommodations = [
  { student: "Derrick Ssenyonga", items: ["Extra time on written exams (+50%)", "Audio versions of reading materials", "Preferred seating near the front"] },
  { student: "Patience Nakayima", items: ["Extended time on assignments", "Movement breaks every 30 minutes", "Reduced-distraction testing room"] },
  { student: "Emmanuel Byaruhanga", items: ["FM hearing system in all classrooms", "Note-taking support", "Priority seating facing the teacher"] },
];

const reviews = [
  { student: "Emmanuel Byaruhanga", date: "10 Jul 2026", outcome: "Goal met — FM system now used independently", status: "met" },
  { student: "Patience Nakayima", date: "5 Jun 2026", outcome: "Partial progress — recommend continuing current plan", status: "on-track" },
  { student: "Derrick Ssenyonga", date: "22 May 2026", outcome: "Limited progress — plan under review for adjustment", status: "at-risk" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "students", label: "Student Profiles", icon: Heart },
  { id: "goals", label: "IEP Goals", icon: FileText },
  { id: "accommodations", label: "Accommodations", icon: Puzzle },
  { id: "reviews", label: "Progress Reviews", icon: ClipboardCheck },
];

export default function MonaLearnSpecialEd() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("students");
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState(sampleStudents);
  const [iepGoals, setIepGoals] = useState(sampleIepGoals);
  const [accommodations, setAccommodations] = useState(sampleAccommodations);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // One call (the school-wide plans listing added during this wiring
    // pass — the backend previously only had a per-student lookup)
    // derives all three tabs: roster, goals table, accommodation cards.
    fetch("/api/special-ed/plans", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((plans) => {
        if (!plans?.length) return;
        const palette = ["linear-gradient(135deg,#C1503E,#D97A34)", "linear-gradient(135deg,#0E7C5A,#3FAE85)", "linear-gradient(135deg,#6B4FA0,#8A6BC1)"];
        setStudents(plans.map((p, i) => ({
          name: p.student?.fullName ?? "—",
          cls: p.student?.class?.name ?? "—",
          need: p.need,
          planStatus: p.status,
          color: palette[i % palette.length],
        })));
        const goals = [];
        plans.forEach((p) => p.goals?.forEach((g) => goals.push({
          student: p.student?.fullName ?? "—",
          goal: g.goal,
          progress: g.progress.replace(/_/g, "-"),
        })));
        setIepGoals(goals);
        setAccommodations(plans.filter((p) => p.accommodations?.length).map((p) => ({
          student: p.student?.fullName ?? "—",
          items: p.accommodations.map((a) => a.description),
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Confidential</div>
            <h1 className="h1">Special Education</h1>
            <p className="sub">Individualized Education Plans (IEPs), accommodations, and progress reviews.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New IEP</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "students" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Active IEPs</div><div className="stat-val">2</div></div>
              <div className="stat-card gold"><div className="stat-label">Under review</div><div className="stat-val">1</div></div>
              <div className="stat-card green"><div className="stat-label">Goals met this year</div><div className="stat-val">3</div></div>
              <div className="stat-card red"><div className="stat-label">At-risk plans</div><div className="stat-val">1</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search student…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Need type <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Need</th><th>Plan status</th></tr></thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
                          <div className="name">{s.name}</div>
                        </div>
                      </td>
                      <td>{s.cls}</td>
                      <td>{s.need}</td>
                      <td><span className={`pill ${s.planStatus}`}>{s.planStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "goals" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>IEP goal</th><th>Progress</th></tr></thead>
              <tbody>
                {iepGoals.map((g, i) => (
                  <tr key={i}>
                    <td className="name">{g.student}</td>
                    <td>{g.goal}</td>
                    <td><span className={`pill ${g.progress}`}>{g.progress.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "accommodations" && (
          <>
            {accommodations.map((a, i) => (
              <div className="accom-card" key={i}>
                <div className="accom-title">{a.student}</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {a.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {tabView === "reviews" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">Derrick Ssenyonga's plan shows limited progress across two consecutive reviews — recommend involving the school counselor before the next review cycle.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Review date</th><th>Outcome</th><th>Status</th></tr></thead>
                <tbody>
                  {reviews.map((r, i) => (
                    <tr key={i}>
                      <td className="name">{r.student}</td>
                      <td className="mono">{r.date}</td>
                      <td>{r.outcome}</td>
                      <td><span className={`pill ${r.status}`}>{r.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
