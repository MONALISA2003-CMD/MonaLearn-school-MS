"use client";

import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Sparkles, Download, Plus, Building, BarChart3,
  UsersRound, ArrowRightLeft
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
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
  .campus-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(260px,1fr)); gap:16px;}
  .campus-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:18px 20px; position:relative; overflow:hidden;}
  .campus-card::before{content:""; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--ink-700);}
  .campus-title{font-family:var(--font-display); font-weight:700; font-size:15px; margin-bottom:4px;}
  .campus-loc{font-size:11.5px; color:var(--text-secondary); margin-bottom:14px;}
  .campus-row{display:flex; justify-content:space-between; font-size:12.5px; padding:6px 0; border-bottom:1px dashed var(--border); color:var(--text-secondary);}
  .campus-row:last-child{border-bottom:none;}
  .campus-row strong{color:var(--text-primary);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.approved, .pill.completed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
`;

const sampleCampuses = [
  { name: "Kitante Hill School — Main Campus", loc: "Kitante, Kampala", students: 1210, staff: 78, classes: "S.1–S.6" },
  { name: "Kitante Hill School — Junior Campus", loc: "Kisaasi, Kampala", students: 480, staff: 34, classes: "P.1–P.7" },
  { name: "Kitante Hill School — Entebbe Branch", loc: "Entebbe", students: 152, staff: 12, classes: "S.1–S.4" },
];

const comparison = [
  { campus: "Main", attendance: 94 }, { campus: "Junior", attendance: 96 }, { campus: "Entebbe", attendance: 89 },
];

const transfers = [
  { staff: "Ms. Nakalema", from: "Main Campus", to: "Entebbe Branch", reason: "Covering maternity leave", status: "approved" },
  { staff: "Mr. Byamukama", from: "Junior Campus", to: "Main Campus", reason: "Subject specialist support", status: "pending" },
];

const subnavItems = [
  { id: "campuses", label: "Campus Directory", icon: Building },
  { id: "comparison", label: "Cross-Campus Comparison", icon: BarChart3 },
  { id: "transfers", label: "Staff & Resource Transfers", icon: ArrowRightLeft },
];

export default function MonaLearnCampuses() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("campuses");
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";
  const [campuses, setCampuses] = useState(sampleCampuses);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // Real Campus has no "classes offered" field, so that column shows
    // "—" honestly. The Comparison tab's attendance-by-campus chart and
    // Transfers tab stay on sample data — no per-campus attendance
    // aggregation or staff-transfer entity exists in the schema.
    fetch("/api/campuses/comparison", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setCampuses(data.map((c) => ({
          name: c.name,
          loc: c.location ?? "—",
          students: c.students,
          staff: c.staff,
          classes: "—",
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">3 campuses under this tenant</div>
            <h1 className="h1">Campuses & Branches</h1>
            <p className="sub">Manage multiple sites under one school group — each with its own students, staff, and stats, rolled up here.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Add campus</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "campuses" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total students (all campuses)</div><div className="stat-val">{campuses.reduce((s, c) => s + c.students, 0)}</div></div>
              <div className="stat-card green"><div className="stat-label">Total staff</div><div className="stat-val">{campuses.reduce((s, c) => s + c.staff, 0)}</div></div>
              <div className="stat-card gold"><div className="stat-label">Campuses</div><div className="stat-val">{campuses.length}</div></div>
              <div className="stat-card red"><div className="stat-label">Pending transfers</div><div className="stat-val">1</div></div>
            </div>
            <div className="campus-grid">
              {campuses.map((c) => (
                <div className="campus-card" key={c.name}>
                  <div className="campus-title">{c.name}</div>
                  <div className="campus-loc">{c.loc}</div>
                  <div className="campus-row"><span>Students</span><strong>{c.students}</strong></div>
                  <div className="campus-row"><span>Staff</span><strong>{c.staff}</strong></div>
                  <div className="campus-row"><span>Classes offered</span><strong>{c.classes}</strong></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "comparison" && (
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title"><UsersRound size={15} /> Attendance rate by campus</div>
              <div className="panel-tag">Term 2 average</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparison}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="campus" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#12294B" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--text-secondary)", display: "flex", gap: 8 }}>
              <Sparkles size={14} color="#6B4FA0" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>The Entebbe Branch trails the group average by 5-7 points most terms — worth investigating transport or local factors specific to that site.</div>
            </div>
          </div>
        )}

        {tabView === "transfers" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Staff</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={i}>
                    <td className="name">{t.staff}</td>
                    <td>{t.from}</td>
                    <td>{t.to}</td>
                    <td>{t.reason}</td>
                    <td><span className={`pill ${t.status}`}>{t.status}</span></td>
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
