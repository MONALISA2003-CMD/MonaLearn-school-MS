"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, BookOpen,
  Video, HelpCircle, MessageCircle, Award, Play, Users, Clock, CheckCircle2
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

  .course-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:16px;}
  .course-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden;}
  .course-cover{height:70px; position:relative;}
  .course-body{padding:14px 16px;}
  .course-title{font-weight:700; font-size:13.5px; margin-bottom:3px;}
  .course-teacher{font-size:11.5px; color:var(--text-secondary); margin-bottom:10px;}
  .course-progress-bar{width:100%; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; margin-bottom:6px;}
  .course-progress-fill{height:100%; background:var(--emerald-600);}
  .course-meta{display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary);}

  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

  .live-card{display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid var(--border);}
  .live-card:last-child{border-bottom:none;}
  .live-icon{width:40px; height:40px; border-radius:12px; background:var(--soft-red); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative;}
  .live-dot{position:absolute; top:-2px; right:-2px; width:9px; height:9px; border-radius:99px; background:#fff; border:2px solid var(--soft-red);}

  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{
    text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase;
    letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;
  }
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.open, .pill.completed, .pill.issued{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.closes-soon, .pill.in-progress{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.closed{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.scheduled{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .forum-item{display:flex; gap:12px; padding:14px 0; border-bottom:1px solid var(--border);}
  .forum-item:last-child{border-bottom:none;}
  .forum-icon{width:34px; height:34px; border-radius:10px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
  .forum-title{font-weight:700; font-size:13px;}
  .forum-meta{font-size:11.5px; color:var(--text-secondary); margin-top:2px;}

  .cert-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:14px;}
  .cert-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; text-align:center;}
  .cert-icon{width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,var(--gold),#e0b45a); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px;}
`;

const sampleCourses = [
  { title: "Advanced Algebra", teacher: "Mr. Okello", progress: 68, lessons: 24, cls: "S.4 Blue", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { title: "Literature: African Novels", teacher: "Ms. Nabirye", progress: 82, lessons: 18, cls: "S.6 Emerald", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { title: "Physics Fundamentals", teacher: "Mr. Kato", progress: 41, lessons: 30, cls: "S.4 Blue", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { title: "World History", teacher: "Ms. Auma", progress: 95, lessons: 20, cls: "S.3 Green", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const liveClasses = [
  { title: "Physics — Motion & Forces", teacher: "Mr. Kato", cls: "S.4 Blue", time: "Live now · 42 min left", live: true },
  { title: "English — Essay Workshop", teacher: "Ms. Nabirye", cls: "S.6 Emerald", time: "Today, 2:00 PM", live: false },
  { title: "History — Colonial Africa", teacher: "Ms. Auma", cls: "S.3 Green", time: "Tomorrow, 9:00 AM", live: false },
];

const quizzes = [
  { title: "Algebra — Quadratics Quiz", course: "Advanced Algebra", questions: 15, closes: "22 Jul, 11:59 PM", status: "open" },
  { title: "Physics — Newton's Laws", course: "Physics Fundamentals", questions: 12, closes: "20 Jul, 5:00 PM", status: "closes-soon" },
  { title: "Literature — Chapter 4 Comprehension", course: "Literature: African Novels", questions: 10, closes: "18 Jul", status: "closed" },
];

const forums = [
  { title: "Struggling with quadratic formula — help?", course: "Advanced Algebra", replies: 12, lastActive: "10 min ago" },
  { title: "Discussion: themes in Things Fall Apart", course: "Literature: African Novels", replies: 27, lastActive: "1 hr ago" },
  { title: "Lab safety questions before Friday's practical", course: "Physics Fundamentals", replies: 5, lastActive: "3 hrs ago" },
];

const certificates = [
  { title: "World History — Term 1 Completion", date: "Issued 2 May 2026" },
  { title: "Introduction to Digital Literacy", date: "Issued 14 Feb 2026" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "live", label: "Live Classes", icon: Video },
  { id: "quizzes", label: "Quizzes & Assessments", icon: HelpCircle },
  { id: "forums", label: "Discussion Forums", icon: MessageCircle },
  { id: "certificates", label: "Progress & Certificates", icon: Award },
];

export default function MonaLearnLMS() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("courses");
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState(sampleCourses);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // getMyCourses is per-student only, so a student picker drives this
    // tab (same pattern as Portals and Counseling's Case Notes).
    fetch("/api/students?pageSize=20", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setStudentList(data.items ?? data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch(`/api/lms/courses/${selectedStudentId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const palette = ["linear-gradient(135deg,#12294B,#2C4A75)", "linear-gradient(135deg,#0E7C5A,#3FAE85)", "linear-gradient(135deg,#6B4FA0,#8A6BC1)", "linear-gradient(135deg,#C9962C,#D97A34)"];
        // Real Course has no class relation or lesson count, so those
        // columns show "—" rather than fabricated numbers.
        setCourses(data.map((e, i) => ({
          title: e.course?.title ?? "—",
          teacher: e.course?.staff?.fullName ?? "—",
          progress: e.progressPct,
          lessons: "—",
          cls: "—",
          color: palette[i % palette.length],
        })));
      })
      .catch(() => {});
  }, [selectedStudentId]);

  const filteredCourses = courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">S.4 Blue · Term 2</div>
            <h1 className="h1">Learning</h1>
            <p className="sub">Courses, live classes, quizzes, discussions, and certificates.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New course</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "courses" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Enrolled courses</div><div className="stat-val">{courses.length}</div></div>
              <div className="stat-card green"><div className="stat-label">Avg. progress</div><div className="stat-val">{courses.length ? Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length) : 0}%</div></div>
              <div className="stat-card gold"><div className="stat-label">Lessons completed</div><div className="stat-val">{courses.some((c) => c.lessons === "—") ? "—" : courses.reduce((s, c) => s + c.lessons, 0)}</div></div>
              <div className="stat-card red"><div className="stat-label">Quizzes due</div><div className="stat-val">2</div></div>
            </div>
            <div className="toolbar">
              {studentList.length > 0 && (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 8 }}
                >
                  <option value="">Select a student…</option>
                  {studentList.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              )}
              <div className="search-box"><Search size={14} /><input placeholder="Search courses…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Subject <ChevronDown size={13} /></div>
            </div>
            <div className="course-grid">
              {filteredCourses.map((c) => (
                <div className="course-card" key={c.title}>
                  <div className="course-cover" style={{ background: c.color }} />
                  <div className="course-body">
                    <div className="course-title">{c.title}</div>
                    <div className="course-teacher">{c.teacher}{c.cls !== "—" ? ` · ${c.cls}` : ""}</div>
                    <div className="course-progress-bar"><div className="course-progress-fill" style={{ width: `${c.progress}%` }} /></div>
                    <div className="course-meta"><span>{c.progress}% complete</span>{c.lessons !== "—" && <span>{c.lessons} lessons</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "live" && (
          <>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><Video size={15} /> Live & upcoming classes</div>
                <div className="panel-tag">This week</div>
              </div>
              {liveClasses.map((l, i) => (
                <div className="live-card" key={i}>
                  <div className="live-icon">
                    <Play size={16} />
                    {l.live && <div className="live-dot" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{l.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{l.teacher} · {l.cls}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: l.live ? "var(--soft-red)" : "var(--text-secondary)" }}>{l.time}</div>
                    {l.live && <button className="ml-btn ml-btn-primary" style={{ marginTop: 6, padding: "6px 12px", fontSize: 11.5 }}>Join now</button>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "quizzes" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Quiz</th><th>Course</th><th>Questions</th><th>Closes</th><th>Status</th></tr></thead>
              <tbody>
                {quizzes.map((q, i) => (
                  <tr key={i}>
                    <td className="name">{q.title}</td>
                    <td>{q.course}</td>
                    <td>{q.questions}</td>
                    <td className="mono">{q.closes}</td>
                    <td><span className={`pill ${q.status}`}>{q.status === "open" ? <CheckCircle2 size={11} /> : q.status === "closes-soon" ? <Clock size={11} /> : null} {q.status.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "forums" && (
          <div className="panel">
            {forums.map((f, i) => (
              <div className="forum-item" key={i}>
                <div className="forum-icon"><Users size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div className="forum-title">{f.title}</div>
                  <div className="forum-meta">{f.course} · {f.replies} replies · last active {f.lastActive}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tabView === "certificates" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">At the current pace, "Advanced Algebra" will be completed 6 days before term end — on track for a certificate.</p>
            </div>
            <div className="cert-grid">
              {certificates.map((c, i) => (
                <div className="cert-card" key={i}>
                  <div className="cert-icon"><Award size={20} /></div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4 }}>{c.date}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
