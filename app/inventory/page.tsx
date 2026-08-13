"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, Boxes,
  Tag, Wrench, TrendingDown
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
  .pill.good, .pill.active, .pill.completed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.fair, .pill.scheduled{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.poor, .pill.retired{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .cat-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;}
  .cat-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; text-align:center;}
  .cat-icon{width:40px; height:40px; border-radius:11px; background:var(--ink-700); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px;}
  .cat-val{font-family:var(--font-mono); font-size:18px; font-weight:700;}
`;

const sampleAssets = [
  { tag: "AST-2041", name: "Dell desktop computers (x30)", location: "ICT Lab 1", value: 45000000, condition: "good" },
  { tag: "AST-2042", name: "Physics lab equipment set", location: "Physics Lab", value: 18500000, condition: "fair" },
  { tag: "AST-2043", name: "Classroom projectors (x12)", location: "Various classrooms", value: 9600000, condition: "good" },
  { tag: "AST-2044", name: "Kitchen refrigeration unit", location: "Kitchen", value: 6200000, condition: "poor" },
];

const categories = [
  { name: "ICT Equipment", count: 214, value: 128000000 },
  { name: "Furniture", count: 1840, value: 62000000 },
  { name: "Lab Equipment", count: 96, value: 41000000 },
  { name: "Vehicles", count: 4, value: 210000000 },
];

const maintenance = [
  { asset: "Kitchen refrigeration unit", type: "Repair — compressor", date: "24 Jul", cost: 850000, status: "scheduled" },
  { asset: "Classroom projectors (x12)", type: "Bulb replacement (3 units)", date: "16 Jul", cost: 240000, status: "completed" },
  { asset: "School bus UAX 077T", type: "Engine service", date: "12 Jul", cost: 620000, status: "completed" },
];

const depreciation = [
  { asset: "Dell desktop computers (x30)", purchased: "2023", original: 60000000, current: 45000000 },
  { asset: "School bus UAX 077T", purchased: "2020", original: 95000000, current: 38000000 },
  { asset: "Kitchen refrigeration unit", purchased: "2019", original: 14000000, current: 6200000 },
];

function ugx(n: number) { return "UGX " + n.toLocaleString(); }

const subnavItems = [
  { id: "register", label: "Asset Register", icon: Boxes },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "depreciation", label: "Depreciation", icon: TrendingDown },
];

export default function MonaLearnInventory() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("register");
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState(sampleAssets);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/inventory/assets", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // Real Asset has no "tag" field (no asset-tag numbering system
        // in the schema) — use the id as the row key instead of
        // fabricating a tag string.
        if (data?.length) {
          setAssets(data.map((a) => ({ tag: null, id: a.id, name: a.name, location: a.location ?? "—", value: Number(a.value), condition: a.condition })));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = assets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">2,154 assets tracked</div>
            <h1 className="h1">Inventory & Assets</h1>
            <p className="sub">School equipment, furniture, and vehicles — with condition, maintenance history, and depreciation.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Add asset</button>
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
              <div className="stat-card blue"><div className="stat-label">Total assets</div><div className="stat-val">2,154</div></div>
              <div className="stat-card green"><div className="stat-label">Total value</div><div className="stat-val">UGX 441M</div></div>
              <div className="stat-card gold"><div className="stat-label">Needs attention</div><div className="stat-val">1</div></div>
              <div className="stat-card red"><div className="stat-label">Retired this year</div><div className="stat-val">6</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search assets…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Category <ChevronDown size={13} /></div>
              <div className="chip">Condition <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Tag</th><th>Asset</th><th>Location</th><th>Value</th><th>Condition</th></tr></thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.tag ?? a.id}>
                      <td className="mono">{a.tag ?? "—"}</td>
                      <td className="name">{a.name}</td>
                      <td>{a.location}</td>
                      <td className="mono">{ugx(a.value)}</td>
                      <td><span className={`pill ${a.condition}`}>{a.condition}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "categories" && (
          <div className="cat-grid">
            {categories.map((c) => (
              <div className="cat-card" key={c.name}>
                <div className="cat-icon"><Tag size={18} /></div>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{c.name}</div>
                <div className="cat-val">{c.count} items</div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4 }}>{ugx(c.value)}</div>
              </div>
            ))}
          </div>
        )}

        {tabView === "maintenance" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Asset</th><th>Work type</th><th>Date</th><th>Cost</th><th>Status</th></tr></thead>
              <tbody>
                {maintenance.map((m, i) => (
                  <tr key={i}>
                    <td className="name">{m.asset}</td>
                    <td>{m.type}</td>
                    <td className="mono">{m.date}</td>
                    <td className="mono">{ugx(m.cost)}</td>
                    <td><span className={`pill ${m.status}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "depreciation" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">The kitchen refrigeration unit has depreciated to 44% of original value and is flagged "poor" condition — likely due for replacement rather than further repair.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Asset</th><th>Purchased</th><th>Original value</th><th>Current value</th></tr></thead>
                <tbody>
                  {depreciation.map((d, i) => (
                    <tr key={i}>
                      <td className="name">{d.asset}</td>
                      <td>{d.purchased}</td>
                      <td className="mono">{ugx(d.original)}</td>
                      <td className="mono">{ugx(d.current)}</td>
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
