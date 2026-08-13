"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, BookText,
  PiggyBank, Receipt, Building2, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
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
  .row{display:grid; grid-template-columns:1.3fr 1fr; gap:16px; margin-bottom:20px;}
  @media (max-width:900px){ .row{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:20px 22px;}
  .ai-item{display:flex; gap:10px; padding:10px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon{width:26px; height:26px; border-radius:8px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
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
  .pill.posted, .pill.on-track, .pill.paid, .pill.approved{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.tight{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.over-budget, .pill.overdue{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.draft{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .budget-bar{width:110px; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px;}
  .budget-fill{height:100%;}
`;

const sampleLedger = [
  { date: "18 Jul", account: "Tuition income", ref: "INV-3021", debit: 0, credit: 620000, status: "posted" },
  { date: "17 Jul", account: "Staff salaries — July", ref: "PAY-0724", debit: 296000000, credit: 0, status: "posted" },
  { date: "16 Jul", account: "Electricity — UMEME", ref: "EXP-1188", debit: 1420000, credit: 0, status: "posted" },
  { date: "15 Jul", account: "Stationery purchase", ref: "EXP-1187", debit: 640000, credit: 0, status: "pending" },
];

const sampleBudgets = [
  { category: "Academic supplies", allocated: 40000000, spent: 28500000 },
  { category: "Staff salaries", allocated: 320000000, spent: 296000000 },
  { category: "Facilities & maintenance", allocated: 60000000, spent: 61200000 },
  { category: "Transport & fuel", allocated: 25000000, spent: 14800000 },
];

const expenses = [
  { desc: "Chemistry lab reagents", vendor: "Lab Supplies Uganda Ltd", amount: 1850000, date: "16 Jul", status: "approved" },
  { desc: "Bus servicing — UAX 118K", vendor: "Kampala Auto Care", amount: 620000, date: "14 Jul", status: "pending" },
  { desc: "Photocopier toner (bulk)", vendor: "Print Solutions", amount: 940000, date: "12 Jul", status: "paid" },
];

const vendors = [
  { name: "Lab Supplies Uganda Ltd", category: "Academic supplies", outstanding: 1850000, status: "pending" },
  { name: "Kampala Auto Care", category: "Transport", outstanding: 620000, status: "pending" },
  { name: "Print Solutions", category: "Office supplies", outstanding: 0, status: "paid" },
  { name: "UMEME", category: "Utilities", outstanding: 1420000, status: "overdue" },
];

const cashflow = [
  { m: "Feb", v: 12 }, { m: "Mar", v: 18 }, { m: "Apr", v: 9 },
  { m: "May", v: 24 }, { m: "Jun", v: 15 }, { m: "Jul", v: 28 },
];

function ugx(n: number) { return "UGX " + n.toLocaleString(); }

const subnavItems = [
  { id: "ledger", label: "General Ledger", icon: BookText },
  { id: "budgeting", label: "Budgeting", icon: PiggyBank },
  { id: "expenses", label: "Expenses & AP", icon: Receipt },
  { id: "vendors", label: "Vendor Payments", icon: Building2 },
  { id: "reports", label: "Financial Reports", icon: TrendingUp },
];

export default function MonaLearnFinance() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("ledger");
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  // Ledger table itself stays on sample data: the backend only has
  // POST /ledger (write) and GET /net-position (aggregate totals) —
  // there's no list-all-entries endpoint, so the row-by-row table has
  // nothing real to fetch. The summary stat cards above it do, though.
  const ledger = sampleLedger;
  const [netPosition, setNetPosition] = useState(null);
  const [budgets, setBudgets] = useState(sampleBudgets);
  const [term, setTerm] = useState("Term 2");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/finance/net-position", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setNetPosition)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    fetch(`/api/finance/budgets/${encodeURIComponent(term)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => { if (data?.length) setBudgets(data); })
      .catch(() => {});
  }, [term]);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">FY 2026 · Term 2</div>
            <h1 className="h1">Finance & Accounting</h1>
            <p className="sub">The school's own books — ledger, budgets, expenses, vendors, and financial reporting, distinct from student fee billing.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New entry</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "ledger" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total credits{netPosition ? "" : " (Term 2)"}</div><div className="stat-val">{netPosition ? ugx(netPosition.totalCredit) : "UGX 42.1M"}</div></div>
              <div className="stat-card red"><div className="stat-label">Total debits</div><div className="stat-val">{netPosition ? ugx(netPosition.totalDebit) : "UGX 299.6M"}</div></div>
              <div className="stat-card gold"><div className="stat-label">Net position</div><div className="stat-val">{netPosition ? ugx(netPosition.net) : "-UGX 257.5M"}</div></div>
              <div className="stat-card green"><div className="stat-label">Entries this week</div><div className="stat-val">14</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Account</th><th>Reference</th><th>Debit</th><th>Credit</th><th>Status</th></tr></thead>
                <tbody>
                  {ledger.map((l, i) => (
                    <tr key={i}>
                      <td className="mono">{l.date}</td>
                      <td className="name">{l.account}</td>
                      <td className="mono">{l.ref}</td>
                      <td className="mono">{l.debit ? ugx(l.debit) : "—"}</td>
                      <td className="mono" style={{ color: l.credit ? "var(--emerald-600)" : "var(--text-secondary)" }}>{l.credit ? ugx(l.credit) : "—"}</td>
                      <td><span className={`pill ${l.status}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "budgeting" && (
          <div className="table-wrap">
            <div style={{ padding: "10px 14px" }}>
              <select value={term} onChange={(e) => setTerm(e.target.value)} style={{ font: "inherit", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px" }}>
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>
            </div>
            <table>
              <thead><tr><th>Category</th><th>Allocated</th><th>Spent</th><th>Status</th></tr></thead>
              <tbody>
                {budgets.map((b, i) => {
                  const pct = Math.round((b.spent / b.allocated) * 100);
                  const over = b.spent > b.allocated;
                  return (
                    <tr key={i}>
                      <td className="name">{b.category}</td>
                      <td className="mono">{ugx(b.allocated)}</td>
                      <td className="mono">
                        <div className="budget-bar"><div className="budget-fill" style={{ width: `${Math.min(pct, 100)}%`, background: over ? "var(--soft-red)" : pct > 85 ? "var(--orange)" : "var(--emerald-600)" }} /></div>
                        {ugx(b.spent)}
                      </td>
                      <td><span className={`pill ${over ? "over-budget" : pct > 85 ? "tight" : "on-track"}`}>{over ? "Over budget" : pct > 85 ? "Tight" : "On track"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "expenses" && (
          <>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search expenses…" /></div>
              <div className="chip">Category <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Description</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {expenses.map((e, i) => (
                    <tr key={i}>
                      <td className="name">{e.desc}</td>
                      <td>{e.vendor}</td>
                      <td className="mono">{ugx(e.amount)}</td>
                      <td className="mono">{e.date}</td>
                      <td><span className={`pill ${e.status}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "vendors" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vendor</th><th>Category</th><th>Outstanding</th><th>Status</th></tr></thead>
              <tbody>
                {vendors.map((v, i) => (
                  <tr key={i}>
                    <td className="name">{v.name}</td>
                    <td>{v.category}</td>
                    <td className="mono" style={{ color: v.outstanding > 0 ? "var(--soft-red)" : "var(--text-secondary)" }}>{ugx(v.outstanding)}</td>
                    <td><span className={`pill ${v.status}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "reports" && (
          <div className="row">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Cash flow (income - expenses)</div>
                <div className="panel-tag">Millions UGX, last 6 months</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cashflow}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#12294B" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="ai-panel">
              <div className="panel-head"><div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div></div>
              <div className="ai-item"><div className="ai-icon"><Sparkles size={13} /></div><div>Facilities & maintenance is already 102% of its budget with 2 months of the term remaining.</div></div>
              <div className="ai-item"><div className="ai-icon"><Sparkles size={13} /></div><div>UMEME's invoice has been outstanding for 9 days — approaching the utility's disconnection notice window.</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
