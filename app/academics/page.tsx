"use client";

import React, { useState, useEffect } from "react";
import {
  Search, ChevronDown, X, Download, MoreHorizontal, Sparkles,
  Sun, Moon, ArrowUpRight, ArrowDownRight, FileText, Plus, BookOpen,
  ClipboardList, PencilLine, CalendarClock, Target, CheckCircle2, Clock3
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const tokens = `
  .ml-root{
    --ink-900:#0B1B33; --ink-700:#12294B; --ink-500:#2C4A75; --ink-100:#E7ECF4;
    --emerald-700:#0B5E45; --emerald-600:#0E7C5A; --emerald-400:#3FAE85; --emerald-100:#DFF3EA;
    --paper-0:#FFFFFF; --mist-50:#F6F8FB; --mist-100:#F3F5F8; --mist-300:#DDE3EC; --mist-500:#8A94A6; --mist-700:#4B5568;
    --amethyst:#6B4FA0; --gold:#C9962C; --turquoise:#1B93A6; --orange:#D97A34; --soft-red:#C1503E;
    --radius-sm:6px; --radius-md:12px; --radius-lg:20px;
    --shadow-lg: 0 24px 48px rgba(11,27,51,0.18), 0 4px 10px rgba(11,27,51,0.06);
    --font-display:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif; --font-mono:'IBM Plex Mono', monospace;
    --bg:var(--paper-0); --surface:var(--mist-50); --text-primary:var(--ink-900); --text-secondary:var(--mist-700); --border:var(--mist-300);
    background:var(--bg); color:var(--text-primary); font-family:var(--font-body); min-height:100vh;
  }
  .ml-root[data-theme="dark"]{
    --bg:#0B1420; --surface:#111E30; --text-primary:#EDF1F7; --text-secondary:#9FADC2; --border:#233150; --mist-100:#16233A;
  }
  .ml-root *{box-sizing:border-box;}

  .page{padding:26px 28px 60px; position:relative;}
  .page-head{display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap;}
  .eyebrow{font-family:var(--font-mono); font-size:11px; color:var(--emerald-600); text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px;}
  .h1{font-family:var(--font-display); font-size:26px; font-weight:700; margin:0; letter-spacing:-.01em;}
  .sub{color:var(--text-secondary); font-size:13.5px; margin-top:4px;}

  .ml-btn{
    font-family:var(--font-body); font-weight:600; font-size:13px; border-radius:var(--radius-sm); padding:9px 15px;
    cursor:pointer; border:1px solid transparent; display:flex; align-items:center; gap:6px;
  }
  .ml-btn-primary{background:var(--ink-700); color:#fff;}
  .ml-btn-outline{background:transparent; border-color:var(--border); color:var(--text-primary);}
  .ml-icon-btn{
    width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center;
    background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary); flex-shrink:0;
  }

  /* Sub-module nav */
  .subnav{display:flex; gap:6px; margin:22px 0 22px; border-bottom:1px solid var(--border); overflow-x:auto; padding-bottom:1px;}
  .subnav-item{
    display:flex; align-items:center; gap:7px; padding:10px 14px; font-size:13px; font-weight:600; color:var(--text-secondary);
    cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;
  }
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
  .stat-delta{font-size:11.5px; display:flex; align-items:center; gap:3px; font-weight:600; margin-top:4px;}
  .stat-delta.up{color:var(--emerald-600);} .stat-delta.down{color:var(--soft-red);}

  .row{display:grid; grid-template-columns:1.3fr 1fr; gap:16px; margin-bottom:20px;}
  @media (max-width:900px){ .row{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}

  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:20px 22px;}
  .ai-item{display:flex; gap:10px; padding:10px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon{width:26px; height:26px; border-radius:8px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

  .toolbar{display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap;}
  .search-box{
    flex:1; min-width:220px; display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border);
    border-radius:999px; padding:9px 14px; color:var(--text-secondary); font-size:13px;
  }
  .search-box input{border:none; outline:none; background:transparent; width:100%; font-family:var(--font-body); font-size:13px; color:var(--text-primary);}
  .chip{
    display:flex; align-items:center; gap:6px; border:1px solid var(--border); background:var(--bg); border-radius:999px;
    padding:8px 13px; font-size:12.5px; font-weight:600; color:var(--text-secondary); cursor:pointer;
  }

  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:640px;}
  thead th{
    text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase;
    letter-spacing:.05em; padding:13px 14px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;
  }
  tbody td{padding:11px 14px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  tbody tr.clickable{cursor:pointer; transition:background .12s;}
  tbody tr.clickable:hover{background:var(--mist-100);}
  .student-cell{display:flex; align-items:center; gap:10px;}
  .avatar{width:30px; height:30px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:11px; flex-shrink:0;}
  .name{font-weight:600;}
  .adm{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);}
  .score{font-family:var(--font-mono); font-size:12.5px;}
  .score.low{color:var(--soft-red); font-weight:600;}

  .grade-pill{font-family:var(--font-mono); font-size:11px; padding:3px 9px; border-radius:999px; font-weight:700;}
  .grade-pill.A{background:rgba(14,124,90,.14); color:var(--emerald-600);}
  .grade-pill.B{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .grade-pill.C{background:rgba(217,122,52,.14); color:var(--orange);}
  .grade-pill.D{background:rgba(193,80,62,.12); color:var(--soft-red);}

  .status-pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .status-pill.approved, .status-pill.graded, .status-pill.complete{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .status-pill.draft, .status-pill.upcoming, .status-pill.open{background:rgba(217,122,52,.14); color:var(--orange);}
  .status-pill.overdue, .status-pill.behind{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .status-pill.scheduled{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .progress-bar{width:100px; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px;}
  .progress-fill{height:100%; background:var(--emerald-600);}

  /* Competency tracker */
  .comp-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(230px,1fr)); gap:14px;}
  .comp-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .comp-title{font-weight:700; font-size:13.5px; margin-bottom:10px;}
  .comp-level-row{display:flex; align-items:center; gap:8px; font-size:11.5px; margin-bottom:6px; color:var(--text-secondary);}
  .comp-level-bar{flex:1; height:8px; border-radius:99px; background:var(--mist-300); overflow:hidden;}
  .comp-level-fill{height:100%;}

  /* Drawer (report card) */
  .overlay{position:fixed; inset:0; background:rgba(11,20,32,0.4); z-index:30;}
  .drawer{
    position:fixed; top:0; right:0; bottom:0; width:440px; max-width:92vw; background:var(--bg); z-index:31;
    box-shadow:var(--shadow-lg); overflow-y:auto; border-left:1px solid var(--border);
  }
  @media (max-width:500px){ .drawer{width:100vw;} }
  .drawer-head{padding:22px 22px 18px; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; justify-content:space-between;}
  .drawer-profile{display:flex; gap:14px; align-items:center;}
  .drawer-avatar{width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:700; font-size:18px; flex-shrink:0;}
  .drawer-name{font-family:var(--font-display); font-size:18px; font-weight:700;}
  .drawer-meta{font-size:12px; color:var(--text-secondary); margin-top:2px;}
  .drawer-body{padding:20px 22px 40px;}

  .subject-row{display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .subject-row:last-child{border-bottom:none;}
  .subject-bar{width:90px; height:5px; border-radius:99px; background:var(--mist-300); overflow:hidden;}
  .subject-fill{height:100%; background:var(--emerald-600);}

  .comment-box{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; font-size:12.5px;
    color:var(--text-secondary); margin-top:16px; font-style:italic; line-height:1.6;
  }
`;

// ---- shared data ----
const sampleGradebook = [
  { id: "ADM-2026-0141", name: "Amina Nakato", cls: "S.4 Blue", math: 88, eng: 91, sci: 84, avg: 87.7, grade: "A", trend: "up", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "ADM-2026-0142", name: "Brian Okwir", cls: "S.2 Gold", math: 62, eng: 70, sci: 58, avg: 63.3, grade: "C", trend: "down", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "ADM-2026-0143", name: "Faith Namutebi", cls: "S.6 Emerald", math: 95, eng: 89, sci: 93, avg: 92.3, grade: "A", trend: "up", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", cls: "S.1 Ruby", math: 41, eng: 55, sci: 48, avg: 48.0, grade: "D", trend: "down", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { id: "ADM-2026-0145", name: "Grace Achieng", cls: "S.4 Blue", math: 76, eng: 80, sci: 72, avg: 76.0, grade: "B", trend: "up", color: "linear-gradient(135deg,#1B93A6,#3FAE85)" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", cls: "S.3 Green", math: 68, eng: 64, sci: 71, avg: 67.7, grade: "C", trend: "down", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const trendData = [
  { term: "T1 '25", v: 71 }, { term: "T2 '25", v: 74 }, { term: "T3 '25", v: 69 },
  { term: "T1 '26", v: 78 }, { term: "T2 '26", v: 82 },
];

const subjects = [
  { name: "Mathematics", teacher: "Mr. Okello", classes: 6, coverage: 78, status: "open" },
  { name: "English", teacher: "Ms. Nabirye", classes: 6, coverage: 91, status: "open" },
  { name: "Science", teacher: "Mr. Kato", classes: 6, coverage: 62, status: "behind" },
  { name: "History", teacher: "Ms. Auma", classes: 4, coverage: 85, status: "open" },
  { name: "Geography", teacher: "Mr. Ssali", classes: 4, coverage: 70, status: "open" },
];

const lessonPlans = [
  { title: "Quadratic Equations — Part 2", subject: "Mathematics", teacher: "Mr. Okello", cls: "S.4 Blue", status: "approved", date: "22 Jul" },
  { title: "The Water Cycle", subject: "Science", teacher: "Mr. Kato", cls: "S.2 Gold", status: "draft", date: "23 Jul" },
  { title: "Essay Structure & Argument", subject: "English", teacher: "Ms. Nabirye", cls: "S.6 Emerald", status: "approved", date: "21 Jul" },
  { title: "The Scramble for Africa", subject: "History", teacher: "Ms. Auma", cls: "S.3 Green", status: "draft", date: "24 Jul" },
];

const assignments = [
  { title: "Algebra worksheet 4", subject: "Mathematics", cls: "S.4 Blue", due: "22 Jul", submitted: 34, total: 38, status: "open" },
  { title: "Chemistry lab report", subject: "Science", cls: "S.6 Emerald", due: "20 Jul", submitted: 41, total: 42, status: "overdue" },
  { title: "Book review — Things Fall Apart", subject: "English", cls: "S.3 Green", due: "25 Jul", submitted: 12, total: 40, status: "open" },
  { title: "Map reading exercise", subject: "Geography", cls: "S.2 Gold", due: "19 Jul", submitted: 36, total: 36, status: "complete" },
];

const examinations = [
  { name: "Mid-term Examinations", scope: "All classes", start: "22 Jul", end: "26 Jul", status: "scheduled" },
  { name: "Mathematics CAT 3", scope: "S.4 Blue, S.4 Gold", start: "18 Jul", end: "18 Jul", status: "graded" },
  { name: "Mock O-Level Exams", scope: "S.4 (all streams)", start: "12 Aug", end: "16 Aug", status: "upcoming" },
  { name: "End of Term 2 Finals", scope: "All classes", start: "1 Sep", end: "5 Sep", status: "upcoming" },
];

const competencies = [
  { area: "Numeracy", levels: [18, 34, 30, 18] },
  { area: "Literacy & Communication", levels: [10, 28, 40, 22] },
  { area: "Critical Thinking", levels: [22, 36, 28, 14] },
  { area: "Creativity & Innovation", levels: [14, 30, 36, 20] },
];
const compLabels = ["Below Expectation", "Approaching", "Meeting", "Exceeding"];
const compColors = ["#C1503E", "#D97A34", "#1B93A6", "#0E7C5A"];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "gradebook", label: "Gradebook", icon: PencilLine },
  { id: "curriculum", label: "Subjects & Curriculum", icon: BookOpen },
  { id: "lessons", label: "Lesson Plans", icon: ClipboardList },
  { id: "assignments", label: "Assignments & Homework", icon: FileText },
  { id: "exams", label: "Examinations", icon: CalendarClock },
  { id: "cbc", label: "Competency Tracking", icon: Target },
];

export default function MonaLearnAcademics() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("gradebook");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  // Real class list from the /classes endpoint added specifically to
  // unblock this picker — GET /academics/gradebook/:classId/:term had no
  // way to be called with a real classId from the frontend before this.
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [gradebook, setGradebook] = useState(sampleGradebook);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/classes", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setClasses(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    const term = "2026-T2";
    fetch(`/api/academics/gradebook/${selectedClassId}/${term}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          // The backend returns a flexible list of {score, subject:{name}}
          // per student, not fixed Math/English/Science columns — this
          // table's shape predates the real schema. Best-effort match by
          // subject name onto the 3 fixed columns rather than pretending
          // it's a clean 1:1 mapping; a class without exactly these 3
          // subject names will show gaps, which is the honest result.
          setGradebook(
            data.map((s: any) => {
              const find = (needle: string) => s.grades?.find((g: any) => g.subject?.name?.toLowerCase().includes(needle))?.score ?? null;
              return {
                id: s.id,
                name: s.fullName,
                cls: classes.find((c) => c.id === selectedClassId)?.name ?? "—",
                math: find("math"),
                eng: find("english"),
                sci: find("science"),
                avg: s.average ?? null,
                grade: s.average >= 80 ? "A" : s.average >= 60 ? "B" : s.average >= 50 ? "C" : "D",
                trend: "up",
                color: "linear-gradient(135deg,#12294B,#2C4A75)",
              };
            }),
          );
        }
      })
      .catch(() => {});
  }, [selectedClassId, classes]);

  const filtered = gradebook.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const atRisk = gradebook.filter((s) => s.avg < 60).length;
  const passRate = Math.round((gradebook.filter((s) => s.avg >= 50).length / gradebook.length) * 100);

  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">Term 2 · 2026</div>
            <h1 className="h1">Academics</h1>
            <p className="sub">Curriculum, lesson plans, assignments, exams, grading, and competency tracking — all in one place.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "gradebook" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">School average</div><div className="stat-val">76.4%</div></div>
              <div className="stat-card green">
                <div className="stat-label">Pass rate</div>
                <div className="stat-val">{passRate}%</div>
                <div className="stat-delta up"><ArrowUpRight size={12} /> +4pts vs Term 1</div>
              </div>
              <div className="stat-card gold"><div className="stat-label">Top subject</div><div className="stat-val">English</div></div>
              <div className="stat-card red">
                <div className="stat-label">At-risk students</div>
                <div className="stat-val">{atRisk}</div>
                <div className="stat-delta down"><ArrowDownRight size={12} /> below 60% average</div>
              </div>
            </div>

            <div className="row">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">School average by term</div>
                  <div className="panel-tag">5 terms</div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={trendData}>
                    <CartesianGrid stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="term" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="v" stroke="#12294B" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="ai-panel">
                <div className="panel-head">
                  <div className="panel-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={15} color="#6B4FA0" /> AI insights
                  </div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>Derrick Ssenyonga's average dropped 12 points since last term — recommend a learning support plan.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>Science scores are trailing Math and English by 6 points school-wide this term.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>S.6 Emerald is on track for the school's best-ever exam average.</div>
                </div>
              </div>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search student…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ fontSize: 12.5, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", background: "var(--surface)" }}
              >
                <option value="">Select a class…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="chip">Assessment <ChevronDown size={13} /></div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Class</th><th>Math</th><th>English</th><th>Science</th><th>Average</th><th>Grade</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="clickable" onClick={() => setSelected(s)}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
                          <div>
                            <div className="name">{s.name}</div>
                            <div className="adm">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.cls}</td>
                      <td className={`score ${s.math < 50 ? "low" : ""}`}>{s.math}</td>
                      <td className={`score ${s.eng < 50 ? "low" : ""}`}>{s.eng}</td>
                      <td className={`score ${s.sci < 50 ? "low" : ""}`}>{s.sci}</td>
                      <td className="score" style={{ fontWeight: 700 }}>{s.avg.toFixed(1)}</td>
                      <td><span className={`grade-pill ${s.grade}`}>{s.grade}</span></td>
                      <td><MoreHorizontal size={15} color="var(--text-secondary)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "curriculum" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-head">
                <div className="panel-title">Syllabus coverage</div>
                <div className="panel-tag">Term 2, Week 6 of 13</div>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "0 0 4px" }}>
                Expected coverage at this point in the term is roughly 46%. Subjects below that are falling behind schedule.
              </p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Subject</th><th>Lead teacher</th><th>Classes taught</th><th>Syllabus coverage</th><th>Status</th></tr></thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.name}>
                      <td className="name">{s.name}</td>
                      <td>{s.teacher}</td>
                      <td>{s.classes}</td>
                      <td>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.coverage}%`, background: s.coverage < 65 ? "var(--soft-red)" : "var(--emerald-600)" }} /></div>
                        {s.coverage}%
                      </td>
                      <td><span className={`status-pill ${s.status}`}>{s.status === "behind" ? "Behind schedule" : "On track"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "lessons" && (
          <>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search lesson plans…" /></div>
              <div className="chip">Subject <ChevronDown size={13} /></div>
              <div className="chip">Status <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Lesson</th><th>Subject</th><th>Teacher</th><th>Class</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {lessonPlans.map((l, i) => (
                    <tr key={i}>
                      <td className="name">{l.title}</td>
                      <td>{l.subject}</td>
                      <td>{l.teacher}</td>
                      <td>{l.cls}</td>
                      <td className="adm">{l.date}</td>
                      <td><span className={`status-pill ${l.status}`}>{l.status === "approved" ? <CheckCircle2 size={11} /> : <Clock3 size={11} />} {l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "assignments" && (
          <>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search assignments…" /></div>
              <div className="chip">Subject <ChevronDown size={13} /></div>
              <div className="chip">Class <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Assignment</th><th>Subject</th><th>Class</th><th>Due</th><th>Submissions</th><th>Status</th></tr></thead>
                <tbody>
                  {assignments.map((a, i) => (
                    <tr key={i}>
                      <td className="name">{a.title}</td>
                      <td>{a.subject}</td>
                      <td>{a.cls}</td>
                      <td className="adm">{a.due}</td>
                      <td>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(a.submitted / a.total) * 100}%` }} /></div>
                        {a.submitted}/{a.total}
                      </td>
                      <td><span className={`status-pill ${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "exams" && (
          <>
            <div className="toolbar">
              <div className="chip">Term 2, 2026 <ChevronDown size={13} /></div>
              <div className="chip">All classes <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Examination</th><th>Scope</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
                <tbody>
                  {examinations.map((e, i) => (
                    <tr key={i}>
                      <td className="name">{e.name}</td>
                      <td>{e.scope}</td>
                      <td className="adm">{e.start}</td>
                      <td className="adm">{e.end}</td>
                      <td><span className={`status-pill ${e.status}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "cbc" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-head">
                <div className="panel-title">Competency-Based Curriculum tracking</div>
                <div className="panel-tag">S.4 Blue · Term 2</div>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>
                Class distribution of learners across each of the four competency levels, per learning area — replacing raw scores with skill mastery for lower secondary reporting.
              </p>
            </div>
            <div className="comp-grid">
              {competencies.map((c) => {
                const total = c.levels.reduce((a, b) => a + b, 0);
                return (
                  <div className="comp-card" key={c.area}>
                    <div className="comp-title">{c.area}</div>
                    {c.levels.map((v, i) => (
                      <div className="comp-level-row" key={i}>
                        <span style={{ width: 108, flexShrink: 0 }}>{compLabels[i]}</span>
                        <div className="comp-level-bar"><div className="comp-level-fill" style={{ width: `${(v / total) * 100}%`, background: compColors[i] }} /></div>
                        <span style={{ width: 22, textAlign: "right" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selected && (
        <>
          <div className="overlay" onClick={() => setSelected(null)} />
          <div className="drawer">
            <div className="drawer-head">
              <div className="drawer-profile">
                <div className="drawer-avatar" style={{ background: selected.color }}>{initials(selected.name)}</div>
                <div>
                  <div className="drawer-name">{selected.name}</div>
                  <div className="drawer-meta">{selected.cls} · {selected.id}</div>
                </div>
              </div>
              <button className="ml-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={15} /></button>
            </div>

            <div className="drawer-body">
              <div className="panel-title" style={{ fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={15} /> Mid-term report
              </div>

              <div className="subject-row">
                <span>Mathematics</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="subject-bar"><div className="subject-fill" style={{ width: `${selected.math}%` }} /></div>
                  <span className="score">{selected.math}</span>
                </div>
              </div>
              <div className="subject-row">
                <span>English</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="subject-bar"><div className="subject-fill" style={{ width: `${selected.eng}%` }} /></div>
                  <span className="score">{selected.eng}</span>
                </div>
              </div>
              <div className="subject-row">
                <span>Science</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="subject-bar"><div className="subject-fill" style={{ width: `${selected.sci}%` }} /></div>
                  <span className="score">{selected.sci}</span>
                </div>
              </div>
              <div className="subject-row" style={{ fontWeight: 700 }}>
                <span>Overall average</span>
                <span className="score">{selected.avg.toFixed(1)} · <span className={`grade-pill ${selected.grade}`}>{selected.grade}</span></span>
              </div>

              <div className="comment-box">
                <Sparkles size={13} color="#6B4FA0" style={{ marginRight: 6, verticalAlign: -2 }} />
                {selected.trend === "up"
                  ? `${selected.name.split(" ")[0]} has shown steady improvement this term, especially in core subjects. Encourage continued consistency ahead of finals.`
                  : `${selected.name.split(" ")[0]}'s performance has declined this term. A conversation with the guardian and a targeted revision plan are recommended.`}
              </div>

              <div className={`stat-delta ${selected.trend}`} style={{ marginTop: 14 }}>
                {selected.trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {selected.trend === "up" ? "Trending up vs last term" : "Trending down vs last term"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
