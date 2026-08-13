"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown, Sun, Moon, Sparkles, Download, Wand2, AlertTriangle,
  Repeat, Users, DoorOpen, CalendarClock, Check
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

  .toolbar{display:flex; align-items:center; gap:10px; margin-bottom:20px; flex-wrap:wrap;}
  .chip{
    display:flex; align-items:center; gap:6px; border:1px solid var(--border); background:var(--surface); border-radius:999px;
    padding:8px 13px; font-size:12.5px; font-weight:600; color:var(--text-primary); cursor:pointer;
  }
  .view-toggle{display:flex; border:1px solid var(--border); border-radius:999px; padding:3px; margin-left:auto; background:var(--surface);}
  .view-toggle button{border:none; background:transparent; padding:6px 14px; border-radius:999px; font-size:12.5px; font-weight:600; cursor:pointer; color:var(--text-secondary);}
  .view-toggle button.active{background:var(--ink-700); color:#fff;}

  .ai-banner{
    display:flex; align-items:center; gap:12px; background:rgba(217,122,52,0.1); border:1px solid rgba(217,122,52,0.3);
    border-radius:var(--radius-md); padding:13px 16px; margin-bottom:20px; font-size:13px;
  }
  .ai-banner strong{font-weight:700;}
  .ai-banner .icon{width:30px; height:30px; border-radius:9px; background:var(--orange); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

  .grid-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table.tt{width:100%; border-collapse:collapse; min-width:760px;}
  table.tt th{
    font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.05em; color:var(--text-secondary);
    padding:12px 10px; border-bottom:1px solid var(--border); background:var(--mist-100); text-align:center;
  }
  table.tt th.period-col{text-align:left; width:90px;}
  table.tt td{border-bottom:1px solid var(--border); border-right:1px solid var(--border); padding:6px; vertical-align:top; height:64px;}
  table.tt td:last-child{border-right:none;}
  table.tt tr:last-child td{border-bottom:none;}
  .period-label{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); padding:6px 10px;}

  .cell{
    height:100%; border-radius:8px; padding:7px 9px; font-size:11.5px; display:flex; flex-direction:column; justify-content:center;
    gap:2px; position:relative;
  }
  .cell .subj{font-weight:700; font-size:12px;}
  .cell .meta{font-size:10px; opacity:.85;}
  .cell.conflict{box-shadow:0 0 0 2px var(--soft-red) inset;}
  .cell.conflict::after{content:"⚠"; position:absolute; top:4px; right:6px; font-size:10px;}
  .cell.free{background:var(--mist-100); color:var(--text-secondary); align-items:center; justify-content:center; font-style:italic;}

  .legend{display:flex; flex-wrap:wrap; gap:14px; margin-top:16px; font-size:12px; color:var(--text-secondary);}
  .legend span{display:flex; align-items:center; gap:6px;}
  .dot{width:9px; height:9px; border-radius:3px;}

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
  .pill.covered, .pill.available, .pill.confirmed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.tight{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.uncovered, .pill.overloaded{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.booked{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .load-bar{width:110px; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px;}
  .load-fill{height:100%;}

  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const subjectColors = {
  Math: { bg: "rgba(18,41,75,0.12)", fg: "#12294B" },
  English: { bg: "rgba(14,124,90,0.12)", fg: "#0E7C5A" },
  Science: { bg: "rgba(27,147,166,0.14)", fg: "#1B93A6" },
  History: { bg: "rgba(201,150,44,0.16)", fg: "#C9962C" },
  Geography: { bg: "rgba(107,79,160,0.13)", fg: "#6B4FA0" },
  PE: { bg: "rgba(217,122,52,0.14)", fg: "#D97A34" },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = ["8:00", "9:00", "10:00", "11:20", "12:20", "2:00"];

const sampleTimetable = {
  "8:00": ["Math", "English", "Math", "Science", "History"],
  "9:00": ["English", "Math", "Science", "Math", "English"],
  "10:00": ["Science", "Science", "Geography", "English", "Math"],
  "11:20": ["Geography", "History", "Math", "PE", "Science"],
  "12:20": ["PE", "Geography", "English", "History", "Geography"],
  "2:00": [null, "Math", null, "Geography", null],
};

const conflicts = { "9:00-Wed": true };

const substitutions = [
  { absent: "Mr. Kato", subject: "Science", cls: "S.2 Gold", period: "9:00 Mon", covering: "Ms. Auma", status: "covered" },
  { absent: "Ms. Nabirye", subject: "English", cls: "S.6 Emerald", period: "10:00 Wed", covering: "—", status: "pending" },
  { absent: "Mr. Ssali", subject: "Geography", cls: "S.4 Blue", period: "11:20 Thu", covering: "Mr. Okello", status: "covered" },
];

const workload = [
  { teacher: "Mr. Okello", subject: "Mathematics", periods: 26, max: 28 },
  { teacher: "Ms. Nabirye", subject: "English", periods: 24, max: 28 },
  { teacher: "Mr. Kato", subject: "Science", periods: 30, max: 28 },
  { teacher: "Ms. Auma", subject: "History", periods: 18, max: 28 },
];

const rooms = [
  { room: "Room 102", capacity: 40, booked: "Mathematics — S.4 Blue", time: "8:00–9:00", status: "booked" },
  { room: "Chemistry Lab", capacity: 30, booked: "Science practical — S.6 Emerald", time: "10:00–11:20", status: "booked" },
  { room: "Main Hall", capacity: 400, booked: "—", time: "Free all day", status: "available" },
  { room: "Room 108", capacity: 35, booked: "—", time: "Free after 12:20", status: "available" },
];

const examSchedule = [
  { exam: "Mathematics Mid-term", cls: "S.4 Blue", room: "Room 102", date: "22 Jul, 8:00 AM", invigilator: "Ms. Auma", status: "confirmed" },
  { exam: "English Mid-term", cls: "S.4 Blue", room: "Room 102", date: "23 Jul, 8:00 AM", invigilator: "Mr. Kato", status: "confirmed" },
  { exam: "Science Mid-term", cls: "S.6 Emerald", room: "Chemistry Lab", date: "22 Jul, 10:00 AM", invigilator: "Mr. Ssali", status: "tight" },
];

function initialsColor(subj: string) {
  return subjectColors[subj] || { bg: "var(--mist-100)", fg: "var(--text-secondary)" };
}

const subnavItems = [
  { id: "grid", label: "Weekly Grid", icon: CalendarClock },
  { id: "substitutions", label: "Substitutions", icon: Repeat },
  { id: "workload", label: "Teacher Workload", icon: Users },
  { id: "rooms", label: "Room Booking", icon: DoorOpen },
  { id: "exams", label: "Exam Schedule", icon: CalendarClock },
];

export default function MonaLearnTimetable() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("class");
  const [tabView, setTabView] = useState("grid");

  // Live grid state: real classes list + selected class + fetched week.
  // Falls back to sample data until a class is picked / loads successfully,
  // same convention used on Attendance and Academics.
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState(sampleTimetable);
  const [teacherByCell, setTeacherByCell] = useState({});

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/classes", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setClasses(data);
          setSelectedClass(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    fetch(`/api/timetable/week/${selectedClass}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // dayOfWeek from the backend is 1=Mon..5=Fri; the grid's `days`
        // array is 0-indexed Mon..Fri, so shift by one to line up.
        const grid = {};
        const teachers = {};
        periods.forEach((p) => { grid[p] = [null, null, null, null, null]; });
        data.forEach((slot) => {
          const dayIdx = slot.dayOfWeek - 1;
          if (dayIdx < 0 || dayIdx > 4) return;
          if (!grid[slot.startTime]) grid[slot.startTime] = [null, null, null, null, null];
          grid[slot.startTime][dayIdx] = slot.subject;
          teachers[`${slot.startTime}-${dayIdx}`] = { teacher: slot.teacher, room: slot.room, needsCover: slot.needsCover };
        });
        setTimetable(grid);
        setTeacherByCell(teachers);
      })
      .catch(() => {});
  }, [selectedClass]);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">Term 2 · 2026</div>
            <h1 className="h1">Timetable</h1>
            <p className="sub">Weekly schedules, substitutions, teacher workload, room bookings, and exam scheduling.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Wand2 size={14} /> AI generate</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "grid" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Periods this week</div><div className="stat-val">30</div></div>
              <div className="stat-card green"><div className="stat-label">Free periods</div><div className="stat-val">2</div></div>
              <div className="stat-card red"><div className="stat-label">Conflicts</div><div className="stat-val">1</div></div>
              <div className="stat-card gold"><div className="stat-label">Room utilization</div><div className="stat-val">87%</div></div>
            </div>

            <div className="toolbar">
              <select
                className="chip"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ border: "none", background: "transparent", font: "inherit", color: "inherit" }}
              >
                {classes.length === 0 && <option value="">S.4 Blue (sample)</option>}
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="chip">Term 2, Week 6 <ChevronDown size={13} /></div>
              <div className="view-toggle">
                <button className={view === "class" ? "active" : ""} onClick={() => setView("class")}>By class</button>
                <button className={view === "teacher" ? "active" : ""} onClick={() => setView("teacher")}>By teacher</button>
              </div>
            </div>

            <div className="ai-banner">
              <div className="icon"><AlertTriangle size={15} /></div>
              <div>
                <strong>AI detected a conflict:</strong> Mr. Okello is scheduled for two classes at 9:00 on Wednesday (S.4 Blue and S.3 Green). Suggested fix: move S.3 Green Math to 2:00 PM, which is currently free.
              </div>
            </div>

            <div className="grid-wrap">
              <table className="tt">
                <thead>
                  <tr>
                    <th className="period-col">Period</th>
                    {days.map((d) => <th key={d}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => (
                    <tr key={p}>
                      <td><div className="period-label">{p}</div></td>
                      {days.map((d, i) => {
                        const subj = timetable[p][i];
                        const key = `${p}-${d}`;
                        const isConflict = conflicts[key];
                        if (!subj) return <td key={key}><div className="cell free">Free</div></td>;
                        const c = initialsColor(subj);
                        const live = teacherByCell[`${p}-${i}`];
                        const teacherName = live?.teacher ?? (subj === "Math" ? "Okello" : subj === "English" ? "Nabirye" : subj === "Science" ? "Kato" : subj === "History" ? "Auma" : subj === "Geography" ? "Ssali" : "Byaruhanga");
                        const roomLabel = live?.room ?? `Rm ${102 + i}`;
                        return (
                          <td key={key}>
                            <div className={`cell ${isConflict || live?.needsCover ? "conflict" : ""}`} style={{ background: c.bg, color: c.fg }}>
                              <div className="subj">{subj}</div>
                              <div className="meta">{roomLabel} · {teacherName}{live?.needsCover ? " (on leave)" : ""}</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="legend">
              {Object.entries(subjectColors).map(([subj, c]) => (
                <span key={subj}><span className="dot" style={{ background: c.fg }} /> {subj}</span>
              ))}
            </div>
          </>
        )}

        {tabView === "substitutions" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">This week</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Covered</div><div className="stat-val">2</div></div>
              <div className="stat-card red"><div className="stat-label">Uncovered</div><div className="stat-val">1</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. response time</div><div className="stat-val">12 min</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Absent teacher</th><th>Subject</th><th>Class</th><th>Period</th><th>Covering</th><th>Status</th></tr></thead>
                <tbody>
                  {substitutions.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.absent}</td>
                      <td>{s.subject}</td>
                      <td>{s.cls}</td>
                      <td>{s.period}</td>
                      <td>{s.covering}</td>
                      <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "workload" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Users size={15} /> Teacher workload balance</div>
              <p className="panel-note">Periods assigned this week vs. each teacher's maximum load. Overloaded teachers are flagged for redistribution.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Teacher</th><th>Subject</th><th>Load</th><th>Status</th></tr></thead>
                <tbody>
                  {workload.map((w, i) => {
                    const pct = (w.periods / w.max) * 100;
                    const over = w.periods > w.max;
                    return (
                      <tr key={i}>
                        <td className="name">{w.teacher}</td>
                        <td>{w.subject}</td>
                        <td>
                          <div className="load-bar"><div className="load-fill" style={{ width: `${Math.min(pct, 100)}%`, background: over ? "var(--soft-red)" : "var(--emerald-600)" }} /></div>
                          {w.periods} / {w.max} periods
                        </td>
                        <td><span className={`pill ${over ? "overloaded" : "available"}`}>{over ? "Overloaded" : "Balanced"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "rooms" && (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Room</th><th>Capacity</th><th>Current booking</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {rooms.map((r, i) => (
                    <tr key={i}>
                      <td className="name">{r.room}</td>
                      <td>{r.capacity}</td>
                      <td>{r.booked}</td>
                      <td>{r.time}</td>
                      <td><span className={`pill ${r.status}`}>{r.status === "booked" ? <Check size={11} /> : null} {r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "exams" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><CalendarClock size={15} /> Exam timetable</div>
              <p className="panel-note">A separate schedule from regular classes — assigns rooms and invigilators, checked for spacing conflicts between consecutive exams.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Exam</th><th>Class</th><th>Room</th><th>Date & time</th><th>Invigilator</th><th>Status</th></tr></thead>
                <tbody>
                  {examSchedule.map((e, i) => (
                    <tr key={i}>
                      <td className="name">{e.exam}</td>
                      <td>{e.cls}</td>
                      <td>{e.room}</td>
                      <td>{e.date}</td>
                      <td>{e.invigilator}</td>
                      <td><span className={`pill ${e.status}`}>{e.status}</span></td>
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
