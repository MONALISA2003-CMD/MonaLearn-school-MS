"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, UserCheck,
  Badge, CalendarClock, ShieldAlert, LogIn, LogOut
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
  .pill.checked-out, .pill.confirmed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.checked-in, .pill.expected{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.flagged{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .scan-box{display:flex; align-items:center; gap:12px; background:var(--surface); border:2px dashed var(--border); border-radius:var(--radius-lg); padding:22px; margin-bottom:20px; justify-content:center; text-align:center; flex-direction:column;}
`;

const sampleVisitors = [
  { name: "David Ssemwogerere", purpose: "Meeting with Bursar re: catering contract", host: "Grace Namusoke", checkIn: "9:12 AM", checkOut: "—", status: "checked-in" },
  { name: "Rebecca Nalwoga", purpose: "Parent — collecting report card", host: "Front office", checkIn: "8:40 AM", checkOut: "9:05 AM", status: "checked-out" },
  { name: "James Otim", purpose: "Textbook supplier delivery", host: "Librarian", checkIn: "10:20 AM", checkOut: "—", status: "checked-in" },
];

const passes = [
  { name: "Ministry of Education inspection team", purpose: "Termly school inspection", date: "25 Jul, 9:00 AM", status: "confirmed" },
  { name: "Uganda National Examinations Board", purpose: "Mock exam monitoring", date: "12 Aug", status: "confirmed" },
  { name: "Parents' Association executive", purpose: "Quarterly meeting", date: "30 Jul", status: "expected" },
];

const preregistered = [
  { name: "Solomon Kizza", company: "EduTech Supplies", purpose: "ICT equipment demo", date: "22 Jul, 2:00 PM", status: "confirmed" },
  { name: "Patience Nabirye", company: "—", purpose: "Prospective parent tour", date: "21 Jul, 11:00 AM", status: "confirmed" },
];

const watchlist = [
  { name: "Unnamed individual — reported 14 Jul", reason: "Attempted unauthorized entry at main gate", status: "flagged" },
];

const subnavItems = [
  { id: "log", label: "Check-in Log", icon: UserCheck },
  { id: "passes", label: "Gate Passes", icon: Badge },
  { id: "preregistered", label: "Pre-registered Visitors", icon: CalendarClock },
  { id: "watchlist", label: "Watchlist", icon: ShieldAlert },
];

export default function MonaLearnVisitors() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("log");
  const [query, setQuery] = useState("");
  const [visitors, setVisitors] = useState(sampleVisitors);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // getOnCampus only returns visitors still on site (checkedOutAt is
    // null), so live rows never show a checked-out row or checkout time
    // — that's correct behavior for this endpoint, not a bug. It also
    // returns a raw hostStaffId, not a joined staff name, so "Host"
    // shows that id rather than a name that isn't actually available.
    fetch("/api/visitors/on-campus", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setVisitors(data.map((v) => ({
          name: v.fullName,
          purpose: v.purpose,
          host: v.hostStaffId ?? "—",
          checkIn: new Date(v.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          checkOut: "—",
          status: "checked-in",
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = visitors.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Main gate</div>
            <h1 className="h1">Visitor Management</h1>
            <p className="sub">Check-in/out log, gate passes, pre-registered visitors, and a security watchlist.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Check in visitor</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "log" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">On campus now</div><div className="stat-val">2</div></div>
              <div className="stat-card green"><div className="stat-label">Checked in today</div><div className="stat-val">3</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. visit length</div><div className="stat-val">38 min</div></div>
              <div className="stat-card red"><div className="stat-label">Watchlist matches</div><div className="stat-val">0</div></div>
            </div>
            <div className="scan-box">
              <UserCheck size={26} color="var(--emerald-600)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Scan ID or enter details to check in</div>
                <div className="panel-note">Automatically checked against the watchlist before a badge is issued.</div>
              </div>
            </div>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search visitor…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Today <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Visitor</th><th>Purpose</th><th>Host</th><th><LogIn size={11} style={{ verticalAlign: -1, marginRight: 3 }} />In</th><th><LogOut size={11} style={{ verticalAlign: -1, marginRight: 3 }} />Out</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={i}>
                      <td className="name">{v.name}</td>
                      <td>{v.purpose}</td>
                      <td>{v.host}</td>
                      <td className="mono">{v.checkIn}</td>
                      <td className="mono">{v.checkOut}</td>
                      <td><span className={`pill ${v.status}`}>{v.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "passes" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Group / individual</th><th>Purpose</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {passes.map((p, i) => (
                  <tr key={i}>
                    <td className="name">{p.name}</td>
                    <td>{p.purpose}</td>
                    <td className="mono">{p.date}</td>
                    <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "preregistered" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Visitor</th><th>Company</th><th>Purpose</th><th>Scheduled</th><th>Status</th></tr></thead>
              <tbody>
                {preregistered.map((p, i) => (
                  <tr key={i}>
                    <td className="name">{p.name}</td>
                    <td>{p.company}</td>
                    <td>{p.purpose}</td>
                    <td className="mono">{p.date}</td>
                    <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "watchlist" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">Every new check-in is automatically screened against this list before a badge prints — no manual lookup required.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Entry</th><th>Reason flagged</th><th>Status</th></tr></thead>
                <tbody>
                  {watchlist.map((w, i) => (
                    <tr key={i}>
                      <td className="name">{w.name}</td>
                      <td>{w.reason}</td>
                      <td><span className={`pill ${w.status}`}>{w.status}</span></td>
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
