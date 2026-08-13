"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, BedDouble,
  Users, ClipboardList, AlertCircle, Home
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
  .pill.full, .pill.resolved, .pill.on-duty{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.available, .pill.open{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.maintenance, .pill.severe{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.off-duty{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .room-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;}
  .room-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .room-title{font-weight:700; font-size:13.5px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;}
  .room-bar{width:100%; height:8px; border-radius:99px; background:var(--mist-300); overflow:hidden; margin-bottom:6px;}
  .room-fill{height:100%;}
  .room-meta{display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-secondary);}
  .avatar{width:32px; height:32px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:12px; flex-shrink:0;}
  .student-cell{display:flex; align-items:center; gap:10px;}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleRooms = [
  { room: "Emerald Dorm — Room 4", capacity: 6, occupied: 6, block: "Girls" },
  { room: "Emerald Dorm — Room 5", capacity: 6, occupied: 4, block: "Girls" },
  { room: "Ruby Dorm — Room 2", capacity: 8, occupied: 8, block: "Boys" },
  { room: "Ruby Dorm — Room 3", capacity: 8, occupied: 5, block: "Boys" },
  { room: "Sick bay annex — Room 1", capacity: 2, occupied: 0, block: "Medical" },
];

const boarders = [
  { name: "Faith Namutebi", cls: "S.6 Emerald", room: "Emerald Dorm — Room 4", guardian: "0755 129 044", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { name: "Grace Achieng", cls: "S.4 Blue", room: "Emerald Dorm — Room 5", guardian: "0709 221 987", color: "linear-gradient(135deg,#1B93A6,#3FAE85)" },
  { name: "Isaac Mugabi", cls: "S.3 Green", room: "Ruby Dorm — Room 2", guardian: "0776 340 128", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const duty = [
  { warden: "Mrs. Kobusingye", block: "Girls — Emerald Dorm", shift: "This week, Mon–Fri", status: "on-duty" },
  { warden: "Mr. Byamukama", block: "Boys — Ruby Dorm", shift: "This week, Mon–Fri", status: "on-duty" },
  { warden: "Ms. Nakalema", block: "Girls — Emerald Dorm", shift: "Next week", status: "off-duty" },
];

const sampleIncidents = [
  { student: "Isaac Mugabi", room: "Ruby Dorm — Room 2", issue: "Broken window latch", date: "16 Jul", severity: "moderate", status: "open" },
  { student: "—", room: "Emerald Dorm — Room 4", issue: "Leaking shower", date: "12 Jul", severity: "moderate", status: "resolved" },
  { student: "Faith Namutebi", room: "Emerald Dorm — Room 4", issue: "Reported feeling unwell — sent to sick bay", date: "10 Jul", severity: "severe", status: "resolved" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "rooms", label: "Room Allocation", icon: BedDouble },
  { id: "boarders", label: "Boarders Directory", icon: Users },
  { id: "duty", label: "Warden Duty Roster", icon: ClipboardList },
  { id: "incidents", label: "Incidents", icon: AlertCircle },
];

export default function MonaLearnHostel() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("rooms");
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState(sampleRooms);
  const [roomsLive, setRoomsLive] = useState(false);
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [incidentsLive, setIncidentsLive] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/hostel/occupancy", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          // Real HostelRoom has no "block" field (Girls/Boys/Medical) —
          // that grouping doesn't exist in the schema, so it's omitted
          // rather than fabricated for live rows.
          setRooms(data.map((r) => ({ room: r.name, capacity: r.capacity, occupied: r.occupied, block: null })));
          setRoomsLive(true);
        }
      })
      .catch(() => {});

    // Only OPEN incidents come back from this endpoint — any resolved
    // sample rows correctly disappear once live data loads.
    fetch("/api/hostel/incidents/open", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setIncidents(data.map((inc) => ({
          student: inc.student?.fullName ?? "—",
          room: inc.hostelRoom?.name ?? "—",
          issue: inc.description,
          date: new Date(inc.reportedAt).toLocaleDateString([], { day: "2-digit", month: "short" }),
          severity: inc.severity,
          status: inc.status,
        })));
        setIncidentsLive(true);
      })
      .catch(() => {});
  }, []);

  const filteredBoarders = boarders.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow"><Home size={11} style={{ verticalAlign: -2, marginRight: 4 }} />2 boarding blocks</div>
            <h1 className="h1">Hostel & Boarding</h1>
            <p className="sub">Room allocation, boarder records, warden duty, and dormitory incidents.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Assign room</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "rooms" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total boarders</div><div className="stat-val">340</div></div>
              <div className="stat-card green"><div className="stat-label">Beds available</div><div className="stat-val">18</div></div>
              <div className="stat-card gold"><div className="stat-label">Rooms full</div><div className="stat-val">2 of 5</div></div>
              <div className="stat-card red"><div className="stat-label">Maintenance flags</div><div className="stat-val">1</div></div>
            </div>
            <div className="room-grid">
              {rooms.map((r) => {
                const pct = Math.round((r.occupied / r.capacity) * 100);
                const full = r.occupied === r.capacity;
                return (
                  <div className="room-card" key={r.room}>
                    <div className="room-title">{r.room} <span className={`pill ${full ? "full" : "available"}`}>{full ? "Full" : "Available"}</span></div>
                    <div className="room-bar"><div className="room-fill" style={{ width: `${pct}%`, background: full ? "var(--soft-red)" : "var(--emerald-600)" }} /></div>
                    <div className="room-meta"><span>{r.occupied} / {r.capacity} beds</span>{r.block && <span>{r.block} block</span>}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tabView === "boarders" && (
          <>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search boarder…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Block <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Room</th><th>Guardian contact</th></tr></thead>
                <tbody>
                  {filteredBoarders.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: b.color }}>{initials(b.name)}</div>
                          <div className="name">{b.name}</div>
                        </div>
                      </td>
                      <td>{b.cls}</td>
                      <td>{b.room}</td>
                      <td className="mono">{b.guardian}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "duty" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Warden</th><th>Block</th><th>Shift</th><th>Status</th></tr></thead>
              <tbody>
                {duty.map((d, i) => (
                  <tr key={i}>
                    <td className="name">{d.warden}</td>
                    <td>{d.block}</td>
                    <td>{d.shift}</td>
                    <td><span className={`pill ${d.status}`}>{d.status.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "incidents" && (
          <>
            {!incidentsLive && (
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
                <p className="panel-note">Ruby Dorm has logged 2 of the last 3 maintenance incidents — worth a facilities walkthrough before next term's intake.</p>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Room</th><th>Issue</th><th>Date</th><th>Severity</th><th>Status</th></tr></thead>
                <tbody>
                  {incidents.map((inc, i) => (
                    <tr key={i}>
                      <td className="name">{inc.student}</td>
                      <td>{inc.room}</td>
                      <td>{inc.issue}</td>
                      <td className="mono">{inc.date}</td>
                      <td><span className={`pill ${inc.severity}`}>{inc.severity}</span></td>
                      <td><span className={`pill ${inc.status}`}>{inc.status}</span></td>
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
