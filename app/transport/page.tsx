"use client";

import React, { useState } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, MapPin,
  Bus, Wrench, UserCog, Users, Navigation, Fuel, AlertTriangle, Phone
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
  .stat-label{font-size:11.5px; color:var(--text-secondary); font-weight:600; display:flex; align-items:center; gap:6px;}
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
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.on-time, .pill.active, .pill.good, .pill.assigned{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.delayed, .pill.due{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.breakdown, .pill.overdue-svc, .pill.expired{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.moving{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

  /* Live tracking */
  .map-mock{
    height:260px; border-radius:var(--radius-lg); border:1px solid var(--border); position:relative; overflow:hidden;
    background: linear-gradient(135deg, var(--mist-100), var(--surface));
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 32px 32px;
    margin-bottom:20px;
  }
  .route-line{position:absolute; height:3px; background:var(--emerald-600); border-radius:99px; opacity:.6;}
  .bus-pin{
    position:absolute; width:30px; height:30px; border-radius:10px; background:var(--ink-700); color:#fff;
    display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-md, 0 4px 10px rgba(11,27,51,.2));
    font-size:11px; font-weight:700;
  }
  .bus-label{position:absolute; font-family:var(--font-mono); font-size:10px; background:var(--bg); border:1px solid var(--border); border-radius:6px; padding:2px 6px; white-space:nowrap;}

  .route-card{display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border); font-size:13px;}
  .route-card:last-child{border-bottom:none;}
  .route-icon{width:34px; height:34px; border-radius:10px; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

  .fleet-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:14px;}
  .fleet-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .fleet-title{font-weight:700; font-size:13.5px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;}
  .fleet-row{display:flex; justify-content:space-between; font-size:12px; padding:5px 0; color:var(--text-secondary);}

  .driver-cell{display:flex; align-items:center; gap:10px;}
  .avatar{width:32px; height:32px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:12px; flex-shrink:0;}
`;

const routes = [
  { name: "Route 1 — Ntinda", stops: 8, students: 42, bus: "UAX 214B", status: "on-time", color: "#12294B" },
  { name: "Route 2 — Kireka", stops: 6, students: 31, bus: "UAX 118K", status: "delayed", color: "#0E7C5A" },
  { name: "Route 3 — Bweyogerere", stops: 9, students: 47, bus: "UAX 302M", status: "on-time", color: "#6B4FA0" },
  { name: "Route 4 — Kyaliwajjala", stops: 7, students: 38, bus: "UAX 077T", status: "breakdown", color: "#C1503E" },
];

const fleet = [
  { plate: "UAX 214B", model: "Toyota Coaster", capacity: 32, lastService: "2 Jun", nextService: "2 Sep", fuel: 78, status: "good" },
  { plate: "UAX 118K", model: "Isuzu NPR", capacity: 28, lastService: "14 May", nextService: "14 Aug", fuel: 45, status: "good" },
  { plate: "UAX 302M", model: "Toyota Coaster", capacity: 32, lastService: "1 Jul", nextService: "1 Oct", fuel: 92, status: "good" },
  { plate: "UAX 077T", model: "Isuzu NPR", capacity: 28, lastService: "20 Mar", nextService: "20 Jun", fuel: 12, status: "overdue-svc" },
];

const drivers = [
  { name: "Patrick Ochen", route: "Route 1 — Ntinda", license: "DL-2024-0091", expiry: "12 Jan 2027", phone: "0772 118 004", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { name: "Simon Wafula", route: "Route 2 — Kireka", license: "DL-2022-0453", expiry: "30 Aug 2026", phone: "0701 552 890", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { name: "Ronald Tumusiime", route: "Route 3 — Bweyogerere", license: "DL-2023-0287", expiry: "5 May 2027", phone: "0755 903 214", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { name: "Moses Kamya", route: "Route 4 — Kyaliwajjala", license: "DL-2021-0176", expiry: "18 Jul 2026", phone: "0782 447 601", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
];

const ridership = [
  { name: "Amina Nakato", cls: "S.4 Blue", route: "Route 1 — Ntinda", stop: "Ntinda Trading Centre", status: "assigned", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { name: "Brian Okwir", cls: "S.2 Gold", route: "Route 2 — Kireka", stop: "Kireka Roundabout", status: "assigned", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { name: "Faith Namutebi", cls: "S.6 Emerald", route: "—", stop: "—", status: "unassigned", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

const subnavItems = [
  { id: "tracking", label: "Live Tracking", icon: MapPin },
  { id: "routes", label: "Routes & Stops", icon: Navigation },
  { id: "fleet", label: "Fleet & Maintenance", icon: Wrench },
  { id: "drivers", label: "Drivers", icon: UserCog },
  { id: "ridership", label: "Student Ridership", icon: Users },
];

export default function MonaLearnTransport() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("tracking");
  const [query, setQuery] = useState("");

  const filteredRidership = ridership.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">4 active routes</div>
            <h1 className="h1">Transport</h1>
            <p className="sub">Live GPS tracking, routes, fleet maintenance, drivers, and student ridership.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Add route</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "tracking" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Buses on route</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Students onboard</div><div className="stat-val">158</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. delay</div><div className="stat-val">4 min</div></div>
              <div className="stat-card red"><div className="stat-label">Alerts</div><div className="stat-val">1</div></div>
            </div>

            <div className="map-mock">
              <div className="route-line" style={{ background: "#12294B", top: "30%", left: "8%", width: "55%", transform: "rotate(-4deg)" }} />
              <div className="route-line" style={{ background: "#0E7C5A", top: "60%", left: "20%", width: "45%", transform: "rotate(8deg)" }} />
              <div className="route-line" style={{ background: "#6B4FA0", top: "45%", left: "40%", width: "40%", transform: "rotate(-10deg)" }} />
              <div className="bus-pin" style={{ top: "27%", left: "38%" }}><Bus size={15} /></div>
              <div className="bus-label" style={{ top: "18%", left: "34%" }}>UAX 214B · on time</div>
              <div className="bus-pin" style={{ top: "62%", left: "58%", background: "var(--orange)" }}><Bus size={15} /></div>
              <div className="bus-label" style={{ top: "72%", left: "54%" }}>UAX 118K · 6 min late</div>
              <div className="bus-pin" style={{ top: "44%", left: "70%" }}><Bus size={15} /></div>
              <div className="bus-label" style={{ top: "34%", left: "66%" }}>UAX 302M · on time</div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                UAX 077T (Route 4) has stopped moving near Kyaliwajjala for 18 minutes — possible breakdown. UAX 118K is trending 5–8 minutes behind schedule most afternoons this week; consider adjusting its departure time.
              </div>
            </div>
          </>
        )}

        {tabView === "routes" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Route</th><th>Stops</th><th>Students</th><th>Assigned bus</th><th>Status</th></tr></thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i}>
                    <td className="name">{r.name}</td>
                    <td>{r.stops}</td>
                    <td>{r.students}</td>
                    <td className="mono">{r.bus}</td>
                    <td><span className={`pill ${r.status}`}>{r.status.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "fleet" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total vehicles</div><div className="stat-val">4</div></div>
              <div className="stat-card green"><div className="stat-label">In good condition</div><div className="stat-val">3</div></div>
              <div className="stat-card red"><div className="stat-label">Service overdue</div><div className="stat-val">1</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. fuel level</div><div className="stat-val">57%</div></div>
            </div>
            <div className="fleet-grid">
              {fleet.map((f) => (
                <div className="fleet-card" key={f.plate}>
                  <div className="fleet-title">{f.plate} <span className={`pill ${f.status}`}>{f.status.replace("-", " ")}</span></div>
                  <div className="fleet-row"><span>Model</span><span>{f.model}</span></div>
                  <div className="fleet-row"><span>Capacity</span><span>{f.capacity} seats</span></div>
                  <div className="fleet-row"><span>Last service</span><span>{f.lastService}</span></div>
                  <div className="fleet-row"><span>Next service</span><span>{f.nextService}</span></div>
                  <div className="fleet-row"><span><Fuel size={11} style={{ verticalAlign: -2, marginRight: 3 }} />Fuel level</span><span>{f.fuel}%</span></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "drivers" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Driver</th><th>Assigned route</th><th>License no.</th><th>Expiry</th><th>Contact</th></tr></thead>
              <tbody>
                {drivers.map((d, i) => {
                  const expSoon = d.expiry.includes("2026");
                  return (
                    <tr key={i}>
                      <td>
                        <div className="driver-cell">
                          <div className="avatar" style={{ background: d.color }}>{initials(d.name)}</div>
                          <div className="name">{d.name}</div>
                        </div>
                      </td>
                      <td>{d.route}</td>
                      <td className="mono">{d.license}</td>
                      <td>
                        <span className={`pill ${expSoon ? "due" : "active"}`}><AlertTriangle size={10} style={{ display: expSoon ? "inline" : "none" }} /> {d.expiry}</span>
                      </td>
                      <td className="mono"><Phone size={11} style={{ verticalAlign: -2, marginRight: 4 }} />{d.phone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "ridership" && (
          <>
            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search student…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="chip">Route <ChevronDown size={13} /></div>
              <div className="chip">Class <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Route</th><th>Pickup/drop stop</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredRidership.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div className="driver-cell">
                          <div className="avatar" style={{ background: r.color }}>{initials(r.name)}</div>
                          <div className="name">{r.name}</div>
                        </div>
                      </td>
                      <td>{r.cls}</td>
                      <td>{r.route}</td>
                      <td>{r.stop}</td>
                      <td><span className={`pill ${r.status}`}>{r.status}</span></td>
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
