"use client";

import React, { useState, useEffect } from "react";
import {
  Search, ChevronDown, Sun, Moon, Sparkles, Check, X as XIcon,
  Clock, Download, CalendarDays, ArrowUpRight, ArrowDownRight,
  FileCheck, Users, AlertTriangle, BarChart3, Fingerprint, Paperclip
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from "recharts";

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
  .stat-delta{font-size:11.5px; display:flex; align-items:center; gap:3px; font-weight:600; margin-top:4px;}
  .stat-delta.up{color:var(--emerald-600);} .stat-delta.down{color:var(--soft-red);}

  .row{display:grid; grid-template-columns:1.3fr 1fr; gap:16px; margin-bottom:20px;}
  @media (max-width:900px){ .row{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

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
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{
    text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase;
    letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;
  }
  tbody td{padding:11px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .student-cell{display:flex; align-items:center; gap:10px;}
  .avatar{width:30px; height:30px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:11px; flex-shrink:0;}
  .name{font-weight:600;}
  .adm{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);}

  .status-group{display:flex; gap:6px;}
  .status-btn{
    width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--bg);
    display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-secondary);
  }
  .status-btn.present.active{background:rgba(14,124,90,.14); border-color:var(--emerald-600); color:var(--emerald-600);}
  .status-btn.absent.active{background:rgba(193,80,62,.12); border-color:var(--soft-red); color:var(--soft-red);}
  .status-btn.late.active{background:rgba(217,122,52,.14); border-color:var(--orange); color:var(--orange);}

  .legend{display:flex; gap:16px; font-size:12px; color:var(--text-secondary); margin-top:14px;}
  .legend span{display:flex; align-items:center; gap:6px;}
  .dot{width:8px; height:8px; border-radius:99px;}

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.approved, .pill.present, .pill.active{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.review{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.declined, .pill.absent{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.medical{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .device-row{display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .device-row:last-child{border-bottom:none;}
  .device-icon{width:30px; height:30px; border-radius:9px; background:var(--emerald-600); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
`;

const roster = [
  { id: "ADM-2026-0141", name: "Amina Nakato", color: "linear-gradient(135deg,#12294B,#2C4A75)", status: "present" },
  { id: "ADM-2026-0142", name: "Brian Okwir", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)", status: "present" },
  { id: "ADM-2026-0143", name: "Faith Namutebi", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)", status: "late" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", color: "linear-gradient(135deg,#C1503E,#D97A34)", status: "absent" },
  { id: "ADM-2026-0145", name: "Grace Achieng", color: "linear-gradient(135deg,#1B93A6,#3FAE85)", status: "present" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", color: "linear-gradient(135deg,#C9962C,#D97A34)", status: "absent" },
];

const trend = [
  { day: "Mon", v: 92 }, { day: "Tue", v: 94 }, { day: "Wed", v: 89 },
  { day: "Thu", v: 96 }, { day: "Fri", v: 91 }, { day: "Sat", v: 93 },
];

const leaveRequests = [
  { name: "Isaac Mugabi", cls: "S.3 Green", reason: "Family function", dates: "21–22 Jul", type: "personal", status: "pending" },
  { name: "Grace Achieng", cls: "S.4 Blue", reason: "Malaria — clinic note attached", dates: "18–20 Jul", type: "medical", status: "approved" },
  { name: "Brian Okwir", cls: "S.2 Gold", reason: "Travel with parents", dates: "25–27 Jul", type: "personal", status: "review" },
];

const staffAttendance = [
  { name: "Mr. Okello", dept: "Mathematics", checkIn: "7:52 AM", checkOut: "—", status: "present" },
  { name: "Ms. Nabirye", dept: "English", checkIn: "7:48 AM", checkOut: "—", status: "present" },
  { name: "Mr. Kato", dept: "Science", checkIn: "—", checkOut: "—", status: "absent" },
  { name: "Ms. Auma", dept: "History", checkIn: "8:14 AM", checkOut: "—", status: "present" },
];

const sampleAlerts = [
  { name: "Derrick Ssenyonga", cls: "S.1 Ruby", rule: "4+ absences in 2 weeks", severity: "high" },
  { name: "Isaac Mugabi", cls: "S.3 Green", rule: "3 unexplained absences", severity: "medium" },
  { name: "Faith Namutebi", cls: "S.6 Emerald", rule: "2 late arrivals this week", severity: "low" },
];

const classReport = [
  { cls: "S.1", pct: 84 }, { cls: "S.2", pct: 91 }, { cls: "S.3", pct: 79 },
  { cls: "S.4", pct: 95 }, { cls: "S.5", pct: 90 }, { cls: "S.6", pct: 97 },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "register", label: "Daily Register", icon: CalendarDays },
  { id: "leave", label: "Leave Requests", icon: FileCheck },
  { id: "staff", label: "Staff Attendance", icon: Users },
  { id: "alerts", label: "Alerts & Policies", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

export default function MonaLearnAttendance() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("register");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(roster);

  // Real fetch against GET /attendance/low-attendance. The Daily Register
  // tab (`rows` above) still needs a class-picker wired to real Class
  // records before it can be converted the same way — getClassRegister
  // requires a real classId, and this page doesn't have one yet.
  const [alerts, setAlerts] = useState(sampleAlerts);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/attendance/low-attendance", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setAlerts(
            data.map((s) => ({
              name: s.fullName,
              cls: "—", // backend doesn't join class name into this response yet
              rule: `${s.attendancePct}% attendance over last 30 days`,
              severity: s.attendancePct < 70 ? "high" : s.attendancePct < 80 ? "medium" : "low",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  // Real class list from the /classes endpoint that was added specifically
  // to unblock this picker — before this, getClassRegister had no way to
  // be called with a real classId from the frontend at all.
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/classes", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setClasses(data || []))
      .catch(() => {});
  }, []);

  // Fires GET /attendance/register once a real class is selected — this
  // is the register tab becoming genuinely live instead of static roster.
  useEffect(() => {
    if (!selectedClassId) return;
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    const today = new Date().toISOString().slice(0, 10);
    fetch(`/api/attendance/register?classId=${selectedClassId}&date=${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setRows(
            data.map((s) => ({
              id: s.studentId,
              name: s.fullName,
              admissionNo: s.studentId,
              status: s.status ? s.status.toLowerCase() : "unmarked",
            })),
          );
        }
      })
      .catch(() => {});
  }, [selectedClassId]);

  const setStatus = (id, status) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
  const presentCount = rows.filter((r) => r.status === "present").length;
  const absentCount = rows.filter((r) => r.status === "absent").length;
  const lateCount = rows.filter((r) => r.status === "late").length;

  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">S.4 Blue · Monday, 20 July</div>
            <h1 className="h1">Attendance</h1>
            <p className="sub">Registers, leave, staff attendance, absence alerts, and reporting — student and staff.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><CalendarDays size={14} /> View calendar</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "register" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">School-wide today</div><div className="stat-val">93.6%</div></div>
              <div className="stat-card green">
                <div className="stat-label">Present in class</div>
                <div className="stat-val">{presentCount} / {rows.length}</div>
              </div>
              <div className="stat-card gold"><div className="stat-label">Late arrivals</div><div className="stat-val">{lateCount}</div></div>
              <div className="stat-card red">
                <div className="stat-label">Absent</div>
                <div className="stat-val">{absentCount}</div>
                <div className="stat-delta down"><ArrowDownRight size={12} /> 2 unexplained</div>
              </div>
            </div>

            <div className="row">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">Attendance trend</div>
                  <div className="panel-tag">Last 6 days</div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="attTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0E7C5A" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#0E7C5A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <Area type="monotone" dataKey="v" stroke="#0E7C5A" strokeWidth={2.5} fill="url(#attTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="ai-panel">
                <div className="panel-head">
                  <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>Derrick Ssenyonga has been absent 4 of the last 6 school days — flagged for guardian follow-up.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>Wednesdays consistently show the lowest attendance this term.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>Late arrivals cluster around 8:00–8:15 AM — mostly S.2 and S.3.</div>
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
              <div className="chip">Today <ChevronDown size={13} /></div>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Admission no.</th><th>Mark</th></tr></thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
                          <div className="name">{s.name}</div>
                        </div>
                      </td>
                      <td className="adm">{s.id}</td>
                      <td>
                        <div className="status-group">
                          <button className={`status-btn present ${s.status === "present" ? "active" : ""}`} onClick={() => setStatus(s.id, "present")} aria-label="Present"><Check size={14} /></button>
                          <button className={`status-btn late ${s.status === "late" ? "active" : ""}`} onClick={() => setStatus(s.id, "late")} aria-label="Late"><Clock size={14} /></button>
                          <button className={`status-btn absent ${s.status === "absent" ? "active" : ""}`} onClick={() => setStatus(s.id, "absent")} aria-label="Absent"><XIcon size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="legend">
              <span><span className="dot" style={{ background: "var(--emerald-600)" }} /> Present</span>
              <span><span className="dot" style={{ background: "var(--orange)" }} /> Late</span>
              <span><span className="dot" style={{ background: "var(--soft-red)" }} /> Absent</span>
            </div>
          </>
        )}

        {tabView === "leave" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Open requests</div><div className="stat-val">2</div></div>
              <div className="stat-card green"><div className="stat-label">Approved this month</div><div className="stat-val">14</div></div>
              <div className="stat-card gold"><div className="stat-label">Medical leave</div><div className="stat-val">5</div></div>
              <div className="stat-card red"><div className="stat-label">Declined</div><div className="stat-val">1</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Reason</th><th>Dates</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {leaveRequests.map((l, i) => (
                    <tr key={i}>
                      <td className="name">{l.name}</td>
                      <td>{l.cls}</td>
                      <td>{l.reason}</td>
                      <td className="adm">{l.dates}</td>
                      <td><span className={`pill ${l.type}`}>{l.type === "medical" ? <Paperclip size={11} /> : null} {l.type}</span></td>
                      <td><span className={`pill ${l.status}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "staff" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Staff present today</div><div className="stat-val">118 / 124</div></div>
              <div className="stat-card green"><div className="stat-label">On time</div><div className="stat-val">109</div></div>
              <div className="stat-card gold"><div className="stat-label">Late check-in</div><div className="stat-val">9</div></div>
              <div className="stat-card red"><div className="stat-label">Absent</div><div className="stat-val">6</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Staff</th><th>Department</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead>
                <tbody>
                  {staffAttendance.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.name}</td>
                      <td>{s.dept}</td>
                      <td className="adm">{s.checkIn}</td>
                      <td className="adm">{s.checkOut}</td>
                      <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel" style={{ marginTop: 16 }}>
              <div className="panel-head">
                <div className="panel-title"><Fingerprint size={15} /> Connected devices</div>
                <div className="panel-tag">Live</div>
              </div>
              <div className="device-row">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="device-icon"><Fingerprint size={14} /></div>
                  <div>Main gate — biometric scanner</div>
                </div>
                <span className="pill active">Online</span>
              </div>
              <div className="device-row">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="device-icon"><Fingerprint size={14} /></div>
                  <div>Staff room — RFID reader</div>
                </div>
                <span className="pill active">Online</span>
              </div>
            </div>
          </>
        )}

        {tabView === "alerts" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><AlertTriangle size={15} /> Attendance policy rules</div>
              <p className="panel-note">Automatic flags trigger a guardian notification and counselor referral once a student crosses a threshold — configurable per school.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Rule triggered</th><th>Severity</th></tr></thead>
                <tbody>
                  {alerts.map((a, i) => (
                    <tr key={i}>
                      <td className="name">{a.name}</td>
                      <td>{a.cls}</td>
                      <td>{a.rule}</td>
                      <td><span className={`pill ${a.severity === "high" ? "absent" : a.severity === "medium" ? "review" : "medical"}`}>{a.severity}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "reports" && (
          <>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><BarChart3 size={15} /> Attendance rate by class</div>
                <div className="panel-tag">Term 2 average</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={classReport}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="cls" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip />
                  <Bar dataKey="pct" fill="#12294B" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
