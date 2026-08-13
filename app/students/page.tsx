"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Filter, ChevronDown, X, Phone, Mail, MapPin,
  Sun, Moon, ArrowUpRight, Download, MoreHorizontal, Sparkles,
  UserPlus, HeartPulse, ShieldAlert, FileCheck, FileWarning, Check, LogOut
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
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

  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{
    text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase;
    letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;
  }
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  tbody tr.clickable{cursor:pointer; transition:background .12s;}
  tbody tr.clickable:hover{background:var(--mist-100);}
  .student-cell{display:flex; align-items:center; gap:10px;}
  .avatar{width:32px; height:32px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:12px; flex-shrink:0;}
  .name{font-weight:600;}
  .adm{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);}
  .mono{font-family:var(--font-mono); font-size:12px;}

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.paid, .pill.enrolled, .pill.cleared, .pill.complete, .pill.resolved{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.applied, .pill.review, .pill.open, .pill.missing{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.overdue, .pill.expired, .pill.severe{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.interview, .pill.offered, .pill.moderate{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .pipeline{display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px;}
  @media (max-width:820px){ .pipeline{grid-template-columns:repeat(2,1fr);} }
  .stage-col{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:14px;}
  .stage-head{display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:700; margin-bottom:12px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.04em;}
  .stage-count{background:var(--mist-100); border-radius:999px; padding:2px 8px; font-family:var(--font-mono);}
  .app-card{background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md); padding:11px 12px; margin-bottom:8px; font-size:12.5px;}
  .app-card .name{display:block; margin-bottom:3px;}
  .app-card .meta{color:var(--text-secondary); font-size:11px;}

  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:18px 20px; margin-bottom:20px;}
  .ai-item{display:flex; gap:10px; padding:9px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon{width:24px; height:24px; border-radius:7px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:4px;}

  .doc-grid{display:flex; gap:6px;}
  .doc-chip{
    display:flex; align-items:center; gap:4px; font-size:10.5px; padding:3px 8px; border-radius:6px; font-weight:600;
  }
  .doc-chip.ok{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .doc-chip.missing{background:rgba(193,80,62,.12); color:var(--soft-red);}

  /* Drawer */
  .overlay{position:fixed; inset:0; background:rgba(11,20,32,0.4); z-index:30;}
  .drawer{
    position:fixed; top:0; right:0; bottom:0; width:420px; max-width:92vw; background:var(--bg); z-index:31;
    box-shadow:var(--shadow-lg); overflow-y:auto; border-left:1px solid var(--border);
  }
  @media (max-width:500px){ .drawer{width:100vw;} }
  .drawer-head{padding:22px 22px 18px; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; justify-content:space-between;}
  .drawer-profile{display:flex; gap:14px; align-items:center;}
  .drawer-avatar{width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:700; font-size:18px; flex-shrink:0;}
  .drawer-name{font-family:var(--font-display); font-size:18px; font-weight:700;}
  .drawer-meta{font-size:12px; color:var(--text-secondary); margin-top:2px;}

  .tabs{display:flex; gap:4px; padding:14px 22px 0; border-bottom:1px solid var(--border);}
  .tab{padding:9px 12px; font-size:12.5px; font-weight:600; color:var(--text-secondary); cursor:pointer; border-bottom:2px solid transparent;}
  .tab.active{color:var(--ink-700); border-bottom-color:var(--ink-700);}
  [data-theme="dark"] .tab.active{color:var(--emerald-400); border-bottom-color:var(--emerald-400);}

  .drawer-body{padding:20px 22px 40px;}
  .info-row{display:flex; align-items:center; gap:10px; font-size:13px; padding:9px 0; border-bottom:1px dashed var(--border); color:var(--text-secondary);}
  .info-row strong{color:var(--text-primary); font-weight:600;}

  .mini-stat-row{display:flex; gap:10px; margin:16px 0;}
  .mini-stat{flex:1; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px; text-align:center;}
  .mini-stat-val{font-family:var(--font-mono); font-size:18px; font-weight:600;}
  .mini-stat-label{font-size:10.5px; color:var(--text-secondary); margin-top:3px;}

  .ai-note{
    background:rgba(107,79,160,.08); border:1px solid rgba(107,79,160,.25); border-radius:var(--radius-md);
    padding:12px 14px; font-size:12.5px; display:flex; gap:8px; margin-top:16px;
  }
`;

const sampleStudents = [
  { id: "ADM-2026-0141", name: "Amina Nakato", cls: "S.4 Blue", guardian: "0772 445 210", fee: "paid", attendance: 96, color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "ADM-2026-0142", name: "Brian Okwir", cls: "S.2 Gold", guardian: "0701 883 762", fee: "pending", attendance: 88, color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "ADM-2026-0143", name: "Faith Namutebi", cls: "S.6 Emerald", guardian: "0755 129 044", fee: "paid", attendance: 99, color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", cls: "S.1 Ruby", guardian: "0782 903 511", fee: "overdue", attendance: 74, color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { id: "ADM-2026-0145", name: "Grace Achieng", cls: "S.4 Blue", guardian: "0709 221 987", fee: "paid", attendance: 93, color: "linear-gradient(135deg,#1B93A6,#3FAE85)" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", cls: "S.3 Green", guardian: "0776 340 128", fee: "pending", attendance: 85, color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const attendanceHistory = [
  { m: "Feb", v: 90 }, { m: "Mar", v: 93 }, { m: "Apr", v: 89 },
  { m: "May", v: 95 }, { m: "Jun", v: 92 }, { m: "Jul", v: 96 },
];

const pipeline = {
  Applied: [{ name: "Peter Lubega", meta: "S.1 · applied 2 days ago" }, { name: "Sarah Nansubuga", meta: "S.1 · applied 3 days ago" }],
  "Docs review": [{ name: "Moses Kirabo", meta: "S.4 transfer · missing birth cert" }],
  Interview: [{ name: "Ritah Kembabazi", meta: "S.1 · interview 24 Jul" }],
  Offered: [{ name: "John Mwesigwa", meta: "S.2 transfer · offer sent" }, { name: "Diana Auma", meta: "S.1 · offer sent" }],
};

const health = [
  { id: "ADM-2026-0141", name: "Amina Nakato", cls: "S.4 Blue", condition: "None recorded", allergy: "—", immunized: "cleared", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "ADM-2026-0142", name: "Brian Okwir", cls: "S.2 Gold", condition: "Asthma", allergy: "—", immunized: "cleared", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", cls: "S.1 Ruby", condition: "None recorded", allergy: "Peanuts", immunized: "pending", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", cls: "S.3 Green", condition: "None recorded", allergy: "—", immunized: "cleared", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const discipline = [
  { name: "Derrick Ssenyonga", cls: "S.1 Ruby", incident: "Skipped afternoon classes", date: "15 Jul", severity: "moderate", status: "open", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { name: "Isaac Mugabi", cls: "S.3 Green", incident: "Uniform violation", date: "12 Jul", severity: "moderate", status: "resolved", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
  { name: "Brian Okwir", cls: "S.2 Gold", incident: "Fighting in dormitory", date: "8 Jul", severity: "severe", status: "resolved", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
];

const documents = [
  { id: "ADM-2026-0141", name: "Amina Nakato", cls: "S.4 Blue", docs: { birth: true, immun: true, id: true }, color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "ADM-2026-0142", name: "Brian Okwir", cls: "S.2 Gold", docs: { birth: true, immun: false, id: true }, color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", cls: "S.1 Ruby", docs: { birth: false, immun: false, id: false }, color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", cls: "S.3 Green", docs: { birth: true, immun: true, id: false }, color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const transfers = [
  { name: "Moses Kirabo", cls: "S.4 (transfer in)", type: "Transfer in", from: "St. Mary's College", reason: "Family relocated to Kampala", status: "cleared" },
  { name: "Patricia Nabweteme", cls: "S.3 Green", type: "Withdrawal", from: "—", reason: "Family relocating to Mbarara", status: "pending" },
  { name: "Kevin Ouma", cls: "S.6 Emerald", type: "Graduated", from: "—", reason: "Completed A-Level, transcript issued", status: "cleared" },
];

const subnavItems = [
  { id: "directory", label: "Directory", icon: Search },
  { id: "admissions", label: "Admissions", icon: UserPlus },
  { id: "health", label: "Health Records", icon: HeartPulse },
  { id: "discipline", label: "Discipline", icon: ShieldAlert },
  { id: "documents", label: "Documents", icon: FileCheck },
  { id: "transfers", label: "Transfers & Withdrawals", icon: LogOut },
];

export default function MonaLearnStudents() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("directory");
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");

  // Real fetch against GET /students (paginated on the backend). Falls
  // back to sampleStudents only while loading or if the call fails, so
  // the page never renders fully empty — the same shape as login's
  // real fetch('/api/auth/login') call, applied to a list endpoint.
  const [students, setStudents] = useState(sampleStudents);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) {
      setLoadingStudents(false);
      return;
    }
    fetch("/api/students?page=1&pageSize=25", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((data) => {
        // Backend returns { data, page, pageSize, total, totalPages } from
        // pagination.ts — map it into the shape this page's UI expects.
        if (data.data?.length) {
          setStudents(
            data.data.map((s) => ({
              id: s.admissionNo,
              name: s.fullName,
              cls: s.class?.name ?? "—",
              guardian: s.guardianPhone ?? "—",
              fee: "unknown", // would need a join against Fees — not in this endpoint's response yet
              attendance: null,
              color: "linear-gradient(135deg,#12294B,#2C4A75)",
            })),
          );
        }
      })
      .catch(() => setStudentsError("Could not load live student data — showing sample data"))
      .finally(() => setLoadingStudents(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase())
  );

  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">1,842 total</div>
            <h1 className="h1">Students</h1>
            <p className="sub">Directory, admissions, health, discipline, and documentation — the full student lifecycle.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Enroll student</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "directory" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total students</div><div className="stat-val">1,842</div></div>
              <div className="stat-card green"><div className="stat-label">New this term</div><div className="stat-val">24</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. attendance</div><div className="stat-val">92.4%</div></div>
              <div className="stat-card red"><div className="stat-label">Fees overdue</div><div className="stat-val">63</div></div>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search by name or admission number…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="chip">Class <ChevronDown size={13} /></div>
              <div className="chip">Fee status <ChevronDown size={13} /></div>
              <div className="chip"><Filter size={13} /> More filters</div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Class</th><th>Guardian contact</th><th>Attendance</th><th>Fee status</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="clickable" onClick={() => { setSelected(s); setTab("overview"); }}>
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
                      <td className="mono">{s.guardian}</td>
                      <td>{s.attendance}%</td>
                      <td><span className={`pill ${s.fee}`}>{s.fee}</span></td>
                      <td><MoreHorizontal size={15} color="var(--text-secondary)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "admissions" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Open applications</div><div className="stat-val">6</div></div>
              <div className="stat-card green"><div className="stat-label">Offers sent</div><div className="stat-val">2</div></div>
              <div className="stat-card gold"><div className="stat-label">Enrolled this term</div><div className="stat-val">24</div></div>
              <div className="stat-card red"><div className="stat-label">Missing documents</div><div className="stat-val">1</div></div>
            </div>
            <div className="pipeline">
              {Object.entries(pipeline).map(([stage, apps]) => (
                <div className="stage-col" key={stage}>
                  <div className="stage-head">{stage} <span className="stage-count">{apps.length}</span></div>
                  {apps.map((a, i) => (
                    <div className="app-card" key={i}>
                      <span className="name">{a.name}</span>
                      <span className="meta">{a.meta}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "health" && (
          <>
            <div className="ai-panel">
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div>
              <div className="ai-item">
                <div className="ai-icon"><Sparkles size={12} /></div>
                <div>Derrick Ssenyonga's peanut allergy isn't yet flagged in the kitchen's meal system — recommend syncing records.</div>
              </div>
              <div className="ai-item">
                <div className="ai-icon"><Sparkles size={12} /></div>
                <div>1 student has a pending immunization record ahead of the new term requirement.</div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Condition</th><th>Allergy</th><th>Immunization</th></tr></thead>
                <tbody>
                  {health.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: h.color }}>{initials(h.name)}</div>
                          <div className="name">{h.name}</div>
                        </div>
                      </td>
                      <td>{h.cls}</td>
                      <td>{h.condition}</td>
                      <td>{h.allergy}</td>
                      <td><span className={`pill ${h.immunized}`}>{h.immunized}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "discipline" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Incidents this term</div><div className="stat-val">3</div></div>
              <div className="stat-card red"><div className="stat-label">Open cases</div><div className="stat-val">1</div></div>
              <div className="stat-card green"><div className="stat-label">Resolved</div><div className="stat-val">2</div></div>
              <div className="stat-card gold"><div className="stat-label">Repeat cases</div><div className="stat-val">1</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Incident</th><th>Date</th><th>Severity</th><th>Status</th></tr></thead>
                <tbody>
                  {discipline.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: d.color }}>{initials(d.name)}</div>
                          <div className="name">{d.name}</div>
                        </div>
                      </td>
                      <td>{d.cls}</td>
                      <td>{d.incident}</td>
                      <td className="adm">{d.date}</td>
                      <td><span className={`pill ${d.severity}`}>{d.severity}</span></td>
                      <td><span className={`pill ${d.status}`}>{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "documents" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Class</th><th>Required documents</th></tr></thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="student-cell">
                        <div className="avatar" style={{ background: d.color }}>{initials(d.name)}</div>
                        <div>
                          <div className="name">{d.name}</div>
                          <div className="adm">{d.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{d.cls}</td>
                    <td>
                      <div className="doc-grid">
                        <span className={`doc-chip ${d.docs.birth ? "ok" : "missing"}`}>{d.docs.birth ? <Check size={10} /> : <FileWarning size={10} />} Birth cert.</span>
                        <span className={`doc-chip ${d.docs.immun ? "ok" : "missing"}`}>{d.docs.immun ? <Check size={10} /> : <FileWarning size={10} />} Immunization</span>
                        <span className={`doc-chip ${d.docs.id ? "ok" : "missing"}`}>{d.docs.id ? <Check size={10} /> : <FileWarning size={10} />} National ID</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "transfers" && (
          <>
            <div className="panel" style={{ marginBottom: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><LogOut size={15} /> Transfers, withdrawals & leavers</div>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>Covers students transferring in from another school, withdrawing mid-term, or graduating — each generates a transfer certificate / transcript once cleared of fees and library/hostel items.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Type</th><th>From / reason</th><th>Clearance status</th></tr></thead>
                <tbody>
                  {transfers.map((t, i) => (
                    <tr key={i}>
                      <td className="name">{t.name}</td>
                      <td>{t.cls}</td>
                      <td>{t.type}</td>
                      <td>{t.from !== "—" ? `From ${t.from}` : t.reason}</td>
                      <td><span className={`pill ${t.status}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

            <div className="tabs">
              {["overview", "attendance", "fees"].map((t) => (
                <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>
                  {t}
                </div>
              ))}
            </div>

            <div className="drawer-body">
              {tab === "overview" && (
                <>
                  <div className="info-row"><Phone size={14} /> Guardian: <strong>{selected.guardian}</strong></div>
                  <div className="info-row"><Mail size={14} /> guardian.{selected.name.split(" ")[0].toLowerCase()}@gmail.com</div>
                  <div className="info-row"><MapPin size={14} /> Nakawa, Kampala</div>

                  <div className="mini-stat-row">
                    <div className="mini-stat"><div className="mini-stat-val">{selected.attendance}%</div><div className="mini-stat-label">Attendance</div></div>
                    <div className="mini-stat"><div className="mini-stat-val">B+</div><div className="mini-stat-label">Avg. grade</div></div>
                    <div className="mini-stat"><div className="mini-stat-val">2</div><div className="mini-stat-label">Disc. notes</div></div>
                  </div>

                  <div className="ai-note">
                    <Sparkles size={14} color="#6B4FA0" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>{selected.attendance < 85
                      ? "Attendance has dropped over the last 3 weeks — consider a guardian check-in."
                      : "Consistent attendance and performance this term. No flags."}</div>
                  </div>
                </>
              )}

              {tab === "attendance" && (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={attendanceHistory}>
                      <defs>
                        <linearGradient id="stuAtt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0E7C5A" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0E7C5A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip />
                      <Area type="monotone" dataKey="v" stroke="#0E7C5A" strokeWidth={2.5} fill="url(#stuAtt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="info-row"><ArrowUpRight size={14} color="var(--emerald-600)" /> Present 27 of 29 school days this month</div>
                </>
              )}

              {tab === "fees" && (
                <>
                  <div className="info-row">Term 2 balance <strong style={{ marginLeft: "auto" }}>UGX 620,000</strong></div>
                  <div className="info-row">Amount paid <strong style={{ marginLeft: "auto" }}>UGX 480,000</strong></div>
                  <div className="info-row">Outstanding <strong style={{ marginLeft: "auto", color: "var(--soft-red)" }}>UGX 140,000</strong></div>
                  <div style={{ marginTop: 16 }}>
                    <span className={`pill ${selected.fee}`}>{selected.fee}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
