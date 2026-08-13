"use client";

import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Sparkles, Plus, Key, Webhook, Activity, BookOpen, Copy, Eye, EyeOff
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
  .pill.active, .pill.success{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.revoked, .pill.failed{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .key-cell{display:flex; align-items:center; gap:8px;}
  .icon-sm{cursor:pointer; color:var(--text-secondary);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0 0 14px;}
  .doc-list{list-style:none; margin:0; padding:0;}
  .doc-item{display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .doc-item:last-child{border-bottom:none;}
  .doc-method{font-family:var(--font-mono); font-size:10.5px; padding:3px 8px; border-radius:6px; font-weight:700;}
  .doc-method.get{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .doc-method.post{background:rgba(14,124,90,.12); color:var(--emerald-600);}
`;

const sampleApiKeys = [
  { name: "Mobile App — Production", key: "mlk_live_••••••••8f2a", created: "12 Mar 2026", status: "active" },
  { name: "Parent Portal Integration", key: "mlk_live_••••••••c910", created: "2 May 2026", status: "active" },
  { name: "Legacy Reporting Tool", key: "mlk_live_••••••••4b77", created: "18 Jan 2025", status: "revoked" },
];

const webhooks = [
  { event: "payment.received", url: "https://api.kitantehill.ac.ug/hooks/payment", status: "active" },
  { event: "student.enrolled", url: "https://crm.monalisatech.co/hooks/enroll", status: "active" },
  { event: "attendance.marked", url: "https://analytics.kitantehill.ac.ug/hooks/attendance", status: "active" },
];

const usage = [
  { d: "Mon", calls: 4200 }, { d: "Tue", calls: 4800 }, { d: "Wed", calls: 3900 },
  { d: "Thu", calls: 5100 }, { d: "Fri", calls: 4600 }, { d: "Sat", calls: 2100 },
];

const endpoints = [
  { method: "GET", path: "/v1/students/{id}" },
  { method: "GET", path: "/v1/attendance?class_id=" },
  { method: "POST", path: "/v1/fees/payments" },
  { method: "GET", path: "/v1/academics/grades/{student_id}" },
  { method: "POST", path: "/v1/communication/send" },
];

const subnavItems = [
  { id: "keys", label: "API Keys", icon: Key },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "usage", label: "Usage Analytics", icon: Activity },
  { id: "docs", label: "Documentation", icon: BookOpen },
];

export default function MonaLearnAPI() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("keys");
  const [reveal, setReveal] = useState(false);
  const [apiKeys, setApiKeys] = useState(sampleApiKeys);
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // The backend correctly never returns a raw key, only a keyHash — so
    // live rows can't offer a real "reveal" like the mock's fake demo
    // value did; they show a masked placeholder derived from the id
    // instead, and the reveal toggle does nothing for live rows.
    fetch("/api/api-keys", { headers: { Authorization: `Bearer ${localStorage.getItem("monalearn_token")}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setApiKeys(data.map((k) => ({
          name: k.name,
          key: `mlk_live_••••••••${k.id.slice(-4)}`,
          created: new Date(k.createdAt).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }),
          status: k.status,
          live: true,
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
            <div className="eyebrow">Developer tools</div>
            <h1 className="h1">API Management</h1>
            <p className="sub">Keys, webhooks, usage analytics, and documentation for integrating with MonaLearn's public API.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New API key</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "keys" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Active keys</div><div className="stat-val">{apiKeys.filter((k) => k.status === "active").length}</div></div>
              <div className="stat-card green"><div className="stat-label">Calls this month</div><div className="stat-val">128K</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. response time</div><div className="stat-val">180ms</div></div>
              <div className="stat-card red"><div className="stat-label">Failed requests</div><div className="stat-val">0.3%</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Key</th><th>Created</th><th>Status</th></tr></thead>
                <tbody>
                  {apiKeys.map((k, i) => (
                    <tr key={i}>
                      <td className="name">{k.name}</td>
                      <td>
                        <div className="key-cell mono">
                          {reveal && !k.live ? k.key.replace("••••••••", "a91f3e8c") : k.key}
                          {reveal ? <EyeOff size={13} className="icon-sm" onClick={() => setReveal(false)} /> : <Eye size={13} className="icon-sm" onClick={() => setReveal(true)} />}
                          <Copy size={13} className="icon-sm" />
                        </div>
                      </td>
                      <td className="mono">{k.created}</td>
                      <td><span className={`pill ${k.status}`}>{k.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "webhooks" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Endpoint URL</th><th>Status</th></tr></thead>
              <tbody>
                {webhooks.map((w, i) => (
                  <tr key={i}>
                    <td className="mono">{w.event}</td>
                    <td className="mono">{w.url}</td>
                    <td><span className={`pill ${w.status}`}>{w.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "usage" && (
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">API calls this week</div>
              <div className="panel-tag">All keys</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={usage}>
                <defs>
                  <linearGradient id="apiUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12294B" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#12294B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={40} />
                <Tooltip />
                <Area type="monotone" dataKey="calls" stroke="#12294B" strokeWidth={2.5} fill="url(#apiUsage)" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--text-secondary)", display: "flex", gap: 8 }}>
              <Sparkles size={14} color="#6B4FA0" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>Traffic drops sharply on Saturdays — mostly the Parent Portal integration, which makes sense since it's driven by weekday school activity.</div>
            </div>
          </div>
        )}

        {tabView === "docs" && (
          <div className="panel">
            <div className="panel-title"><BookOpen size={15} /> Common endpoints</div>
            <p className="panel-note">Full interactive API reference (Swagger/OpenAPI) is available at api.monalearn.app/docs for authenticated developers.</p>
            <ul className="doc-list">
              {endpoints.map((e, i) => (
                <li className="doc-item" key={i}>
                  <span className={`doc-method ${e.method.toLowerCase()}`}>{e.method}</span>
                  <span className="mono" style={{ flex: 1, marginLeft: 12 }}>{e.path}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
