"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, CalendarDays,
  ClipboardList, Wallet, History
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
  .event-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; margin-bottom:12px; display:flex; gap:16px; align-items:center;}
  .event-date{width:56px; flex-shrink:0; text-align:center; background:var(--mist-100); border-radius:12px; padding:8px 4px; font-family:var(--font-mono);}
  .event-date .day{font-size:18px; font-weight:700; line-height:1;}
  .event-date .mon{font-size:10px; text-transform:uppercase; color:var(--text-secondary);}
  .event-title{font-weight:700; font-size:14px;}
  .event-meta{font-size:11.5px; color:var(--text-secondary); margin-top:3px;}
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.open, .pill.within-budget, .pill.completed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.almost-full{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.full, .pill.over-budget{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .reg-bar{width:100px; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px;}
  .reg-fill{height:100%; background:var(--emerald-600);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleUpcoming = [
  { day: "22", mon: "Jul", title: "Mid-term exams begin", meta: "All classes · 5 days" },
  { day: "26", mon: "Jul", title: "Inter-house sports day", meta: "All day · school grounds" },
  { day: "14", mon: "Aug", title: "Career guidance fair", meta: "S.5–S.6 · Main Hall" },
];

const registration = [
  { event: "Inter-house sports day", capacity: 800, registered: 640, status: "open" },
  { event: "Career guidance fair", capacity: 200, registered: 178, status: "almost-full" },
  { event: "Alumni Homecoming", capacity: 500, registered: 500, status: "full" },
];

const budgets = [
  { event: "Inter-house sports day", allocated: 4200000, spent: 3100000, status: "within-budget" },
  { event: "Career guidance fair", allocated: 1800000, spent: 1950000, status: "over-budget" },
  { event: "Alumni Homecoming", allocated: 6000000, spent: 4400000, status: "within-budget" },
];

const past = [
  { title: "Founders' Day celebration", date: "12 May 2026", attendance: 1120, status: "completed" },
  { title: "Music, Dance & Drama festival", date: "3 Apr 2026", attendance: 380, status: "completed" },
  { title: "Term 1 Parents' evening", date: "20 Mar 2026", attendance: 640, status: "completed" },
];

function ugx(n: number) { return "UGX " + n.toLocaleString(); }

const subnavItems = [
  { id: "calendar", label: "Upcoming Events", icon: CalendarDays },
  { id: "registration", label: "Registration", icon: ClipboardList },
  { id: "budgets", label: "Event Budgets", icon: Wallet },
  { id: "past", label: "Past Events", icon: History },
];

export default function MonaLearnEvents() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("calendar");
  const [upcoming, setUpcoming] = useState(sampleUpcoming);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/events/upcoming", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // Event has no descriptive "meta" field (audience/venue text) —
        // capacity is the only extra real data point, so meta falls
        // back to that instead of a fabricated description.
        if (data?.length) {
          setUpcoming(data.map((e) => {
            const d = new Date(e.startsAt);
            return {
              day: d.getDate(),
              mon: d.toLocaleString([], { month: "short" }),
              title: e.title,
              meta: e.capacity ? `Capacity: ${e.capacity}` : "",
            };
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">3 upcoming events</div>
            <h1 className="h1">Events</h1>
            <p className="sub">School-wide event calendar, registration, budgets, and past-event records.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New event</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "calendar" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Upcoming events</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Total registered</div><div className="stat-val">1,318</div></div>
              <div className="stat-card gold"><div className="stat-label">Events this year</div><div className="stat-val">11</div></div>
              <div className="stat-card red"><div className="stat-label">Over budget</div><div className="stat-val">1</div></div>
            </div>
            {upcoming.map((e, i) => (
              <div className="event-card" key={i}>
                <div className="event-date"><div className="day">{e.day}</div><div className="mon">{e.mon}</div></div>
                <div>
                  <div className="event-title">{e.title}</div>
                  <div className="event-meta">{e.meta}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {tabView === "registration" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Registration</th><th>Status</th></tr></thead>
              <tbody>
                {registration.map((r, i) => {
                  const pct = Math.round((r.registered / r.capacity) * 100);
                  return (
                    <tr key={i}>
                      <td className="name">{r.event}</td>
                      <td><div className="reg-bar"><div className="reg-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "var(--soft-red)" : pct > 85 ? "var(--orange)" : "var(--emerald-600)" }} /></div>{r.registered} / {r.capacity}</td>
                      <td><span className={`pill ${r.status}`}>{r.status.replace("-", " ")}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "budgets" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">The career guidance fair is already 8% over its allocated budget with 3 weeks still to go — mostly venue decoration costs.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Event</th><th>Allocated</th><th>Spent</th><th>Status</th></tr></thead>
                <tbody>
                  {budgets.map((b, i) => (
                    <tr key={i}>
                      <td className="name">{b.event}</td>
                      <td className="mono">{ugx(b.allocated)}</td>
                      <td className="mono">{ugx(b.spent)}</td>
                      <td><span className={`pill ${b.status}`}>{b.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "past" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {past.map((p, i) => (
                  <tr key={i}>
                    <td className="name">{p.title}</td>
                    <td className="mono">{p.date}</td>
                    <td>{p.attendance}</td>
                    <td><span className={`pill ${p.status}`}>{p.status}</span></td>
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
