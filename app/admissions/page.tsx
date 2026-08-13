"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, FileText,
  ClipboardCheck, Users, CheckSquare, Award
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
  .pill.passed, .pill.offered, .pill.confirmed, .pill.allocated{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.scheduled, .pill.waitlisted{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.failed, .pill.declined{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.review, .pill.submitted{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .seat-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;}
  .seat-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .seat-title{font-weight:700; font-size:13.5px; margin-bottom:10px;}
  .seat-bar{width:100%; height:8px; border-radius:99px; background:var(--mist-300); overflow:hidden; margin-bottom:6px;}
  .seat-fill{height:100%; background:var(--emerald-600);}
  .seat-meta{display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-secondary);}
`;

const applications = [
  { name: "Peter Lubega", cls: "S.1", submitted: "18 Jul", docs: "Complete", status: "review" },
  { name: "Sarah Nansubuga", cls: "S.1", submitted: "17 Jul", docs: "Missing birth cert.", status: "submitted" },
  { name: "Moses Kirabo", cls: "S.4 (transfer)", submitted: "15 Jul", docs: "Complete", status: "review" },
];

const exams = [
  { name: "Ritah Kembabazi", cls: "S.1", exam: "Entrance test — Math & English", date: "24 Jul, 9:00 AM", score: "—", status: "scheduled" },
  { name: "John Mwesigwa", cls: "S.2 (transfer)", exam: "Placement test", date: "20 Jul", score: "82%", status: "passed" },
  { name: "Diana Auma", cls: "S.1", exam: "Entrance test — Math & English", date: "17 Jul", score: "58%", status: "failed" },
];

const samplePipeline = {
  Applied: [{ name: "Peter Lubega", meta: "S.1" }, { name: "Sarah Nansubuga", meta: "S.1" }],
  "Exam scheduled": [{ name: "Ritah Kembabazi", meta: "S.1 · 24 Jul" }],
  Offered: [{ name: "John Mwesigwa", meta: "S.2 transfer" }, { name: "Diana Auma", meta: "waitlisted instead" }],
  Enrolled: [{ name: "Moses Kirabo", meta: "S.4 transfer" }],
};

const sampleSeats = [
  { cls: "S.1", capacity: 120, filled: 96 },
  { cls: "S.2", capacity: 120, filled: 118 },
  { cls: "S.3", capacity: 110, filled: 104 },
  { cls: "S.4", capacity: 110, filled: 109 },
];

const sampleEnrollment = [
  { name: "Moses Kirabo", cls: "S.4", offerDate: "16 Jul", feeStatus: "paid", status: "confirmed" },
  { name: "John Mwesigwa", cls: "S.2", offerDate: "18 Jul", feeStatus: "pending", status: "review" },
];

const subnavItems = [
  { id: "applications", label: "New Applications", icon: FileText },
  { id: "exams", label: "Entrance Exams", icon: ClipboardCheck },
  { id: "pipeline", label: "Pipeline & Offers", icon: Users },
  { id: "seats", label: "Seat Allocation", icon: CheckSquare },
  { id: "enrollment", label: "Enrollment Confirmation", icon: Award },
];

export default function MonaLearnAdmissions() {
  const [theme, setTheme] = useState("light");
  const [pipeline, setPipeline] = useState(samplePipeline);
  // Real GET /admissions/seats has no `capacity` field on Class yet (the
  // backend comment flags this as a placeholder), so live seat cards
  // show filled counts honestly without a fabricated capacity/percentage.
  const [seats, setSeats] = useState(sampleSeats);
  const [seatsLive, setSeatsLive] = useState(false);
  const [enrollment, setEnrollment] = useState(sampleEnrollment);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/admissions/pipeline", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((applicants) => {
        if (!applicants?.length) return;
        const stageLabel = { applied: "Applied", exam_scheduled: "Exam scheduled", offered: "Offered", enrolled: "Enrolled" };
        const grouped = { Applied: [], "Exam scheduled": [], Offered: [], Enrolled: [] };
        applicants.forEach((a) => {
          const label = stageLabel[a.stage] ?? "Applied";
          grouped[label].push({ name: a.fullName, meta: a.examScore != null ? `Score ${a.examScore}` : "" });
        });
        setPipeline(grouped);

        // Enrollment tab: derived from the same pipeline fetch, filtered
        // to the "enrolled" stage. Applicant has no offerDate or
        // feeStatus field in the schema (a real offer/fee record isn't
        // tracked at this stage), so those columns show "—" honestly
        // rather than fabricated values.
        const enrolled = applicants.filter((a) => a.stage === "enrolled");
        if (enrolled.length) {
          setEnrollment(enrolled.map((a) => ({
            name: a.fullName,
            cls: a.applyingForClass?.name ?? "—",
            offerDate: "—",
            feeStatus: null,
            status: "confirmed",
          })));
        }
      })
      .catch(() => {});

    fetch("/api/admissions/seats", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setSeats(data.map((c) => ({ cls: c.name, filled: c.filled })));
          setSeatsLive(true);
        }
      })
      .catch(() => {});
  }, []);

  const [tabView, setTabView] = useState("applications");
  const [query, setQuery] = useState("");

  const filteredApps = applications.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">2027 intake open</div>
            <h1 className="h1">Admissions & Enrollment</h1>
            <p className="sub">Online applications, entrance testing, offers, seat allocation, and enrollment confirmation.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New application</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "applications" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">New applications</div><div className="stat-val">18</div></div>
              <div className="stat-card green"><div className="stat-label">Docs complete</div><div className="stat-val">13</div></div>
              <div className="stat-card gold"><div className="stat-label">Awaiting review</div><div className="stat-val">6</div></div>
              <div className="stat-card red"><div className="stat-label">Incomplete</div><div className="stat-val">5</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search applicant…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Class applying for <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Applicant</th><th>Applying for</th><th>Submitted</th><th>Documents</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredApps.map((a, i) => (
                    <tr key={i}>
                      <td className="name">{a.name}</td>
                      <td>{a.cls}</td>
                      <td className="mono">{a.submitted}</td>
                      <td>{a.docs}</td>
                      <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "exams" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Applicant</th><th>Applying for</th><th>Exam</th><th>Date</th><th>Score</th><th>Result</th></tr></thead>
              <tbody>
                {exams.map((e, i) => (
                  <tr key={i}>
                    <td className="name">{e.name}</td>
                    <td>{e.cls}</td>
                    <td>{e.exam}</td>
                    <td className="mono">{e.date}</td>
                    <td className="mono">{e.score}</td>
                    <td><span className={`pill ${e.status}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "pipeline" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {Object.entries(pipeline).map(([stage, apps]) => (
              <div className="panel" key={stage} style={{ padding: 14 }}>
                <div className="panel-title" style={{ fontSize: 12.5, textTransform: "uppercase", letterSpacing: ".04em" }}>{stage} <span className="mono">({apps.length})</span></div>
                {apps.map((a, i) => (
                  <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", marginTop: 8, fontSize: 12.5 }}>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 11 }}>{a.meta}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tabView === "seats" && (
          <>
            {!seatsLive && (
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
                <p className="panel-note">S.4 is at 99% capacity — only 1 seat remains. Consider closing S.4 applications or opening a waitlist.</p>
              </div>
            )}
            <div className="seat-grid">
              {seats.map((s) => {
                const pct = seatsLive ? null : Math.round((s.filled / s.capacity) * 100);
                return (
                  <div className="seat-card" key={s.cls}>
                    <div className="seat-title">{s.cls}</div>
                    {!seatsLive && (
                      <div className="seat-bar"><div className="seat-fill" style={{ width: `${pct}%`, background: pct > 95 ? "var(--soft-red)" : "var(--emerald-600)" }} /></div>
                    )}
                    <div className="seat-meta">
                      {seatsLive
                        ? <span>{s.filled} active students enrolled (capacity not yet tracked)</span>
                        : <><span>{s.filled} / {s.capacity} filled</span><span>{s.capacity - s.filled} left</span></>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tabView === "enrollment" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Class</th><th>Offer date</th><th>Enrollment fee</th><th>Status</th></tr></thead>
              <tbody>
                {enrollment.map((e, i) => (
                  <tr key={i}>
                    <td className="name">{e.name}</td>
                    <td>{e.cls}</td>
                    <td className="mono">{e.offerDate}</td>
                    <td>{e.feeStatus ? <span className={`pill ${e.feeStatus === "paid" ? "confirmed" : "review"}`}>{e.feeStatus}</span> : "—"}</td>
                    <td><span className={`pill ${e.status}`}>{e.status}</span></td>
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
