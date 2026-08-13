"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, HeartHandshake,
  Send, Smile, FileLock
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
  .confidential-banner{display:flex; align-items:center; gap:10px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:18px; font-size:12.5px; color:var(--text-secondary);}
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.closed, .pill.resolved, .pill.good{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.ongoing, .pill.monitor{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.urgent{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .mood-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(150px,1fr)); gap:12px;}
  .mood-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:14px; text-align:center;}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleSessions = [
  { student: "Isaac Mugabi", cls: "S.3 Green", type: "Individual — academic stress", date: "18 Jul", status: "ongoing" },
  { student: "Grace Achieng", cls: "S.4 Blue", type: "Peer conflict mediation", date: "15 Jul", status: "resolved" },
  { student: "Derrick Ssenyonga", cls: "S.1 Ruby", type: "Individual — behavioral", date: "12 Jul", status: "ongoing" },
];

const sampleReferrals = [
  { student: "Derrick Ssenyonga", from: "Class teacher", reason: "Repeated absenteeism and withdrawal in class", date: "10 Jul", status: "urgent" },
  { student: "Brian Okwir", from: "Class teacher", reason: "Sudden drop in participation", date: "16 Jul", status: "monitor" },
];

const checkins = [
  { cls: "S.1 Ruby", mood: "Mostly okay", flagged: 2 },
  { cls: "S.2 Gold", mood: "Good", flagged: 0 },
  { cls: "S.3 Green", mood: "Mixed", flagged: 3 },
  { cls: "S.4 Blue", mood: "Good", flagged: 1 },
];

const sampleCaseNotes = [
  { student: "Isaac Mugabi", date: "18 Jul", note: "Reports feeling overwhelmed with mid-term prep. Agreed on a weekly check-in for the next month.", counselor: "Ms. Tumusiime" },
  { student: "Grace Achieng", date: "15 Jul", note: "Conflict with roommate resolved through mediation. Both parties satisfied with outcome.", counselor: "Ms. Tumusiime" },
];

const subnavItems = [
  { id: "sessions", label: "Session Log", icon: HeartHandshake },
  { id: "referrals", label: "Referrals", icon: Send },
  { id: "checkins", label: "Wellbeing Check-ins", icon: Smile },
  { id: "notes", label: "Case Notes", icon: FileLock },
];

export default function MonaLearnCounseling() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("sessions");
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState(sampleSessions);
  const [referrals, setReferrals] = useState(sampleReferrals);
  const [caseNotes, setCaseNotes] = useState(sampleCaseNotes);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    // Sessions tab: added GET /counseling/sessions during this wiring
    // pass — the backend previously only had a per-student lookup.
    fetch("/api/counseling/sessions", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setSessions(data.map((s) => ({
          student: s.student?.fullName ?? "—",
          cls: s.student?.class?.name ?? "—",
          type: s.type,
          date: new Date(s.date).toLocaleDateString([], { day: "2-digit", month: "short" }),
          status: s.status,
        })));
      })
      .catch(() => {});

    // Referrals tab: only open referrals return by design (closed
    // sample rows correctly vanish live). Real Referral records carry
    // a severity (low/medium/high), not the mock's synthetic
    // urgent/monitor label, so severity is mapped to the closest
    // existing pill style rather than inventing new business rules.
    fetch("/api/referrals/open", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setReferrals(data.map((r) => ({
          student: r.student?.fullName ?? "—",
          from: r.referredBy,
          reason: r.reason,
          date: new Date(r.referredAt).toLocaleDateString([], { day: "2-digit", month: "short" }),
          status: r.severity === "high" ? "urgent" : "monitor",
        })));
      })
      .catch(() => {});

    // Case Notes are the most sensitive record type in the system and
    // only have a per-student endpoint, so a student picker (same
    // pattern as the Portals page) drives this tab rather than a
    // school-wide dump.
    fetch("/api/students?pageSize=20", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setStudentList(data.items ?? data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch(`/api/case-notes/${selectedStudentId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const name = studentList.find((s) => s.id === selectedStudentId)?.fullName ?? "—";
        setCaseNotes(data.map((n) => ({
          student: name,
          date: new Date(n.createdAt).toLocaleDateString([], { day: "2-digit", month: "short" }),
          note: n.note,
          counselor: n.counselor?.fullName ?? "—",
        })));
      })
      .catch(() => {});
  }, [selectedStudentId]);

  const filtered = sessions.filter((s) => s.student.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Guidance & Counseling office</div>
            <h1 className="h1">Counseling & Wellbeing</h1>
            <p className="sub">Session logs, teacher referrals, class-level wellbeing check-ins, and confidential case notes.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Log session</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        <div className="confidential-banner">
          <FileLock size={14} /> Access to individual student records is restricted to counseling staff and school leadership.
        </div>

        {tabView === "sessions" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Sessions this month</div><div className="stat-val">14</div></div>
              <div className="stat-card green"><div className="stat-label">Resolved</div><div className="stat-val">6</div></div>
              <div className="stat-card gold"><div className="stat-label">Ongoing</div><div className="stat-val">8</div></div>
              <div className="stat-card red"><div className="stat-label">Urgent referrals</div><div className="stat-val">1</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.student}</td>
                      <td>{s.cls}</td>
                      <td>{s.type}</td>
                      <td className="mono">{s.date}</td>
                      <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "referrals" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Referred by</th><th>Reason</th><th>Date</th><th>Priority</th></tr></thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={i}>
                    <td className="name">{r.student}</td>
                    <td>{r.from}</td>
                    <td>{r.reason}</td>
                    <td className="mono">{r.date}</td>
                    <td><span className={`pill ${r.status}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "checkins" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">S.3 Green shows the highest number of flagged check-ins this week — worth a class-wide wellbeing session rather than individual outreach alone.</p>
            </div>
            <div className="mood-grid">
              {checkins.map((c) => (
                <div className="mood-card" key={c.cls}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{c.cls}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 6 }}>{c.mood}</div>
                  <span className={`pill ${c.flagged > 0 ? "urgent" : "good"}`}>{c.flagged} flagged</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "notes" && (
          <div className="table-wrap">
            {studentList.length > 0 && (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8 }}
              >
                <option value="">Select a student for their case notes…</option>
                {studentList.map((s) => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            )}
            <table>
              <thead><tr><th>Student</th><th>Date</th><th>Note</th><th>Counselor</th></tr></thead>
              <tbody>
                {caseNotes.map((n, i) => (
                  <tr key={i}>
                    <td className="name">{n.student}</td>
                    <td className="mono">{n.date}</td>
                    <td>{n.note}</td>
                    <td>{n.counselor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
