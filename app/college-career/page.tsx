"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, GraduationCap,
  Compass, Send, Flag
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
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.on-track, .pill.submitted, .pill.accepted, .pill.done{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.in-progress, .pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.behind, .pill.declined{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .interest-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;}
  .interest-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; text-align:center;}
  .interest-bar{width:100%; height:8px; border-radius:99px; background:var(--mist-300); overflow:hidden; margin:8px 0;}
  .interest-fill{height:100%; background:var(--emerald-600);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleCoursePlans = [
  { student: "Faith Namutebi", cls: "S.6 Emerald", track: "Sciences — Medicine pathway", status: "on-track" },
  { student: "Amina Nakato", cls: "S.4 Blue", track: "Arts — Business pathway", status: "on-track" },
  { student: "Grace Achieng", cls: "S.4 Blue", track: "Sciences — Engineering pathway", status: "in-progress" },
];

const interests = [
  { area: "Medicine & Health Sciences", pct: 78 },
  { area: "Engineering & Technology", pct: 65 },
  { area: "Business & Finance", pct: 58 },
  { area: "Law & Public Policy", pct: 42 },
];

const sampleApplications = [
  { student: "Faith Namutebi", institution: "Makerere University — Medicine", deadline: "30 Sep 2026", status: "submitted" },
  { student: "Faith Namutebi", institution: "Mbarara University — Medicine", deadline: "15 Oct 2026", status: "pending" },
  { student: "Joseph Kato (alum)", institution: "University of Nairobi — Engineering", deadline: "—", status: "accepted" },
];

const milestones = [
  { student: "Faith Namutebi", milestone: "Career aptitude assessment completed", date: "12 Mar 2026", status: "done" },
  { student: "Faith Namutebi", milestone: "University shortlist finalized", date: "20 May 2026", status: "done" },
  { student: "Faith Namutebi", milestone: "Personal statement drafted", date: "Due 5 Aug 2026", status: "in-progress" },
];

const subnavItems = [
  { id: "planning", label: "Course Planning", icon: GraduationCap },
  { id: "exploration", label: "Career Exploration", icon: Compass },
  { id: "applications", label: "University Applications", icon: Send },
  { id: "milestones", label: "Milestones", icon: Flag },
];

export default function MonaLearnCollegeCareer() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("planning");
  const [query, setQuery] = useState("");
  const [coursePlans, setCoursePlans] = useState(sampleCoursePlans);
  const [applications, setApplications] = useState(sampleApplications);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/course-plans", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setCoursePlans(data.map((c) => ({
          student: c.student?.fullName ?? "—",
          cls: c.student?.class?.name ?? "—",
          track: c.pathway,
          status: c.status.replace(/_/g, "-"),
        })));
      })
      .catch(() => {});

    // Added GET /college-career/applications during this wiring pass —
    // the backend previously only had a per-student lookup.
    fetch("/api/college-career/applications", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setApplications(data.map((a) => ({
          student: a.student?.fullName ?? "—",
          institution: a.institution,
          deadline: a.deadline ? new Date(a.deadline).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "—",
          status: a.status,
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = coursePlans.filter((c) => c.student.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">S.5–S.6 · Class of 2027</div>
            <h1 className="h1">College & Career Readiness</h1>
            <p className="sub">Multiyear course plans, career interest exploration, university applications, and readiness milestones.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New plan</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "planning" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Students with a plan</div><div className="stat-val">142</div></div>
              <div className="stat-card green"><div className="stat-label">On track</div><div className="stat-val">118</div></div>
              <div className="stat-card gold"><div className="stat-label">Needs review</div><div className="stat-val">24</div></div>
              <div className="stat-card red"><div className="stat-label">Applications submitted</div><div className="stat-val">31</div></div>
            </div>
            <div className="toolbar" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "9px 14px" }}>
                  <Search size={14} color="var(--text-secondary)" />
                  <input placeholder="Search student…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 13, color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Pathway</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={i}>
                      <td className="name">{c.student}</td>
                      <td>{c.cls}</td>
                      <td>{c.track}</td>
                      <td><span className={`pill ${c.status}`}>{c.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "exploration" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">Interest in Law & Public Policy has grown 12 points since last term's career fair — consider inviting a legal professional to the next guidance session.</p>
            </div>
            <div className="interest-grid">
              {interests.map((i) => (
                <div className="interest-card" key={i.area}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{i.area}</div>
                  <div className="interest-bar"><div className="interest-fill" style={{ width: `${i.pct}%` }} /></div>
                  <div className="mono" style={{ fontSize: 12 }}>{i.pct}% interest</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "applications" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Institution / program</th><th>Deadline</th><th>Status</th></tr></thead>
              <tbody>
                {applications.map((a, i) => (
                  <tr key={i}>
                    <td className="name">{a.student}</td>
                    <td>{a.institution}</td>
                    <td className="mono">{a.deadline}</td>
                    <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "milestones" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Milestone</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {milestones.map((m, i) => (
                  <tr key={i}>
                    <td className="name">{m.student}</td>
                    <td>{m.milestone}</td>
                    <td className="mono">{m.date}</td>
                    <td><span className={`pill ${m.status}`}>{m.status.replace("-", " ")}</span></td>
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
