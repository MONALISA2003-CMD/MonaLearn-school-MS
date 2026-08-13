"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, X, Download, MoreHorizontal, Sparkles,
  Sun, Moon, Wallet, ArrowUpRight, ArrowDownRight, Receipt, CreditCard,
  Layers, Award, CalendarClock, Landmark
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
  .stat-label{font-size:11.5px; color:var(--text-secondary); font-weight:600; display:flex; align-items:center; gap:6px;}
  .stat-val{font-family:var(--font-mono); font-size:22px; font-weight:600; margin-top:6px;}
  .stat-delta{font-size:11.5px; display:flex; align-items:center; gap:3px; font-weight:600; margin-top:4px;}
  .stat-delta.up{color:var(--emerald-600);} .stat-delta.down{color:var(--soft-red);}

  .row{display:grid; grid-template-columns:1.3fr 1fr; gap:16px; margin-bottom:20px;}
  @media (max-width:900px){ .row{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0 0 4px;}

  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:20px 22px;}
  .ai-item{display:flex; gap:10px; padding:10px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon{width:26px; height:26px; border-radius:8px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

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

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-block;}
  .pill.paid, .pill.reconciled, .pill.active{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.unreconciled{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.overdue{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.draft{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .balance-bar{width:100%; height:5px; border-radius:99px; background:var(--mist-300); margin-top:5px; overflow:hidden;}
  .balance-fill{height:100%; background:var(--emerald-600);}

  /* Fee structure */
  .structure-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:14px;}
  .structure-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .structure-title{font-weight:700; font-size:13.5px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;}
  .fee-line{display:flex; justify-content:space-between; font-size:12.5px; padding:6px 0; border-bottom:1px dashed var(--border); color:var(--text-secondary);}
  .fee-line:last-child{border-bottom:none; font-weight:700; color:var(--text-primary);}

  /* Scholarships */
  .schol-badge{display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:999px; background:rgba(201,150,44,.16); color:var(--gold);}

  /* Installments */
  .install-track{display:flex; gap:6px; margin-top:6px;}
  .install-dot{flex:1; height:7px; border-radius:99px; background:var(--mist-300);}
  .install-dot.paid{background:var(--emerald-600);}
  .install-dot.due{background:var(--orange);}

  /* Reconciliation */
  .recon-row{display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .recon-row:last-child{border-bottom:none;}
  .channel-icon{width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;}
`;

const sampleInvoices = [
  { id: "ADM-2026-0141", name: "Amina Nakato", cls: "S.4 Blue", billed: 620000, paid: 620000, status: "paid", due: "—", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "ADM-2026-0142", name: "Brian Okwir", cls: "S.2 Gold", billed: 580000, paid: 300000, status: "pending", due: "28 Jul", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "ADM-2026-0143", name: "Faith Namutebi", cls: "S.6 Emerald", billed: 780000, paid: 780000, status: "paid", due: "—", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { id: "ADM-2026-0144", name: "Derrick Ssenyonga", cls: "S.1 Ruby", billed: 540000, paid: 0, status: "overdue", due: "5 Jul", color: "linear-gradient(135deg,#C1503E,#D97A34)" },
  { id: "ADM-2026-0145", name: "Grace Achieng", cls: "S.4 Blue", billed: 620000, paid: 420000, status: "pending", due: "30 Jul", color: "linear-gradient(135deg,#1B93A6,#3FAE85)" },
  { id: "ADM-2026-0146", name: "Isaac Mugabi", cls: "S.3 Green", billed: 560000, paid: 0, status: "overdue", due: "2 Jul", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const classCollection = [
  { cls: "S.1", pct: 74 }, { cls: "S.2", pct: 81 }, { cls: "S.3", pct: 69 },
  { cls: "S.4", pct: 92 }, { cls: "S.5", pct: 85 }, { cls: "S.6", pct: 95 },
];

const feeStructures = [
  { name: "Day scholar — S.1 to S.4", lines: [["Tuition", 480000], ["Development levy", 40000], ["Exam fee", 20000]], total: 540000 },
  { name: "Boarding — S.1 to S.4", lines: [["Tuition", 480000], ["Boarding & meals", 220000], ["Development levy", 40000]], total: 740000 },
  { name: "Day scholar — S.5 to S.6", lines: [["Tuition", 560000], ["Lab & practicals", 60000], ["Exam fee", 30000]], total: 650000 },
  { name: "Boarding — S.5 to S.6", lines: [["Tuition", 560000], ["Boarding & meals", 240000], ["Lab & practicals", 60000]], total: 860000 },
];

const scholarships = [
  { name: "Faith Namutebi", cls: "S.6 Emerald", type: "Academic excellence", cover: "50% tuition", status: "active" },
  { name: "Isaac Mugabi", cls: "S.3 Green", type: "Bursary — orphan support", cover: "100% tuition", status: "active" },
  { name: "Grace Achieng", cls: "S.4 Blue", type: "Sibling discount", cover: "10% total fees", status: "active" },
];

const installments = [
  { name: "Brian Okwir", cls: "S.2 Gold", plan: "3 installments", schedule: ["paid", "due", "due"] },
  { name: "Grace Achieng", cls: "S.4 Blue", plan: "3 installments", schedule: ["paid", "paid", "due"] },
  { name: "Derrick Ssenyonga", cls: "S.1 Ruby", plan: "2 installments", schedule: ["due", "due"] },
];

const reconciliation = [
  { channel: "Mobile Money", color: "#0E7C5A", txns: 214, amount: 24800000, status: "reconciled" },
  { channel: "Bank transfer", color: "#12294B", txns: 38, amount: 12100000, status: "reconciled" },
  { channel: "Cash", color: "#C9962C", txns: 61, amount: 4200000, status: "unreconciled" },
  { channel: "Cheque", color: "#6B4FA0", txns: 5, amount: 1000000, status: "reconciled" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}
function ugx(n: number) {
  return "UGX " + n.toLocaleString();
}

const subnavItems = [
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "structure", label: "Fee Structure", icon: Layers },
  { id: "scholarships", label: "Scholarships & Discounts", icon: Award },
  { id: "installments", label: "Installment Plans", icon: CalendarClock },
  { id: "reconciliation", label: "Reconciliation", icon: Landmark },
];

export default function MonaLearnFees() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("invoices");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  // Real fetch against the GET /fees/invoices endpoint added specifically
  // for this page — it didn't exist before (only get-one-by-id did).
  // Falls back to sampleInvoices while loading or on failure.
  const [invoices, setInvoices] = useState(sampleInvoices);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/fees/invoices?page=1&pageSize=25", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((result) => {
        if (result.data?.length) {
          setInvoices(
            result.data.map((inv) => {
              const paid = inv.payments.reduce((sum, p) => sum + Number(p.amount), 0);
              return {
                id: inv.student.admissionNo,
                name: inv.student.fullName,
                cls: inv.student.class?.name ?? "—",
                billed: Number(inv.billedAmount),
                paid,
                status: paid >= Number(inv.billedAmount) ? "paid" : paid > 0 ? "pending" : "overdue",
                due: "—",
                color: "linear-gradient(135deg,#12294B,#2C4A75)",
              };
            }),
          );
        }
      })
      .catch(() => {}); // sampleInvoices already covers this case
  }, []);

  const filtered = invoices.filter((s) =>
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
            <div className="eyebrow">Term 2 · 2026</div>
            <h1 className="h1">Fees</h1>
            <p className="sub">Billing, collections, scholarships, and reconciliation across the school.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Record payment</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "invoices" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue">
                <div className="stat-label"><Wallet size={13} /> Total billed</div>
                <div className="stat-val">UGX 54.2M</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label"><Receipt size={13} /> Collected</div>
                <div className="stat-val">UGX 42.1M</div>
                <div className="stat-delta up"><ArrowUpRight size={12} /> 78% collection rate</div>
              </div>
              <div className="stat-card gold">
                <div className="stat-label"><CreditCard size={13} /> Outstanding</div>
                <div className="stat-val">UGX 12.1M</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Overdue students</div>
                <div className="stat-val">63</div>
                <div className="stat-delta down"><ArrowDownRight size={12} /> 9 new this week</div>
              </div>
            </div>

            <div className="row">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">Collection rate by class</div>
                  <div className="panel-tag">Term 2</div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={classCollection}>
                    <CartesianGrid stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="cls" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <Bar dataKey="pct" fill="#0E7C5A" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="ai-panel">
                <div className="panel-head">
                  <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>S.3 Green has the lowest collection rate this term — a reminder blast could help before mid-terms.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>9 accounts moved from pending to overdue in the last 7 days.</div>
                </div>
                <div className="ai-item">
                  <div className="ai-icon"><Sparkles size={13} /></div>
                  <div>At the current pace, Term 2 collection will reach 91% by closing day.</div>
                </div>
              </div>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search by name or admission number…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="chip">Class <ChevronDown size={13} /></div>
              <div className="chip">Status <ChevronDown size={13} /></div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Class</th><th>Billed</th><th>Paid</th><th>Balance</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const balance = s.billed - s.paid;
                    const pct = Math.round((s.paid / s.billed) * 100);
                    return (
                      <tr key={s.id} className="clickable" onClick={() => setSelected(s)}>
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
                        <td className="mono">{ugx(s.billed)}</td>
                        <td className="mono">
                          {ugx(s.paid)}
                          <div className="balance-bar"><div className="balance-fill" style={{ width: `${pct}%` }} /></div>
                        </td>
                        <td className="mono" style={{ color: balance > 0 ? "var(--soft-red)" : "var(--text-secondary)" }}>{ugx(balance)}</td>
                        <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                        <td><MoreHorizontal size={15} color="var(--text-secondary)" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "structure" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><Layers size={15} /> Fee structures</div>
              <p className="panel-note">Defined once per category — enrollment automatically assigns the right structure to each student and generates their invoice.</p>
            </div>
            <div className="structure-grid">
              {feeStructures.map((f) => (
                <div className="structure-card" key={f.name}>
                  <div className="structure-title">{f.name} <span className="pill active">active</span></div>
                  {f.lines.map(([label, amt]) => (
                    <div className="fee-line" key={label}><span>{label}</span><span className="mono">{ugx(amt)}</span></div>
                  ))}
                  <div className="fee-line"><span>Total per term</span><span className="mono">{ugx(f.total)}</span></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "scholarships" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Active awards</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Total value waived</div><div className="stat-val">UGX 1.05M</div></div>
              <div className="stat-card gold"><div className="stat-label">Bursary students</div><div className="stat-val">1</div></div>
              <div className="stat-card red"><div className="stat-label">Pending applications</div><div className="stat-val">2</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Award type</th><th>Coverage</th><th>Status</th></tr></thead>
                <tbody>
                  {scholarships.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.name}</td>
                      <td>{s.cls}</td>
                      <td>{s.type}</td>
                      <td><span className="schol-badge"><Award size={11} /> {s.cover}</span></td>
                      <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "installments" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><CalendarClock size={15} /> Installment plans</div>
              <p className="panel-note">Families can split a term's balance into scheduled installments. Each installment gets its own due date and reminder sequence.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Plan</th><th>Progress</th></tr></thead>
                <tbody>
                  {installments.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.name}</td>
                      <td>{s.cls}</td>
                      <td>{s.plan}</td>
                      <td style={{ minWidth: 160 }}>
                        <div className="install-track">
                          {s.schedule.map((st, j) => <div key={j} className={`install-dot ${st}`} />)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "reconciliation" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total reconciled</div><div className="stat-val">UGX 38.1M</div></div>
              <div className="stat-card red"><div className="stat-label">Unreconciled</div><div className="stat-val">UGX 4.2M</div></div>
              <div className="stat-card green"><div className="stat-label">Payment channels</div><div className="stat-val">4</div></div>
              <div className="stat-card gold"><div className="stat-label">Transactions this term</div><div className="stat-val">318</div></div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><Landmark size={15} /> By payment channel</div>
                <div className="panel-tag">Term 2</div>
              </div>
              {reconciliation.map((r) => (
                <div className="recon-row" key={r.channel}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="channel-icon" style={{ background: r.color }}><CreditCard size={14} /></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.channel}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{r.txns} transactions</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="mono" style={{ fontWeight: 700 }}>{ugx(r.amount)}</div>
                    <span className={`pill ${r.status}`}>{r.status}</span>
                  </div>
                </div>
              ))}
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

            <div className="drawer-body">
              <div className="fee-line"><span>Tuition</span><span>{ugx(selected.billed - 60000)}</span></div>
              <div className="fee-line"><span>Boarding & meals</span><span>{ugx(40000)}</span></div>
              <div className="fee-line"><span>Development levy</span><span>{ugx(20000)}</span></div>
              <div className="fee-line"><span>Total billed</span><span>{ugx(selected.billed)}</span></div>

              <div style={{ marginTop: 16 }}>
                <span className={`pill ${selected.status}`}>{selected.status}</span>
                {selected.due !== "—" && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-secondary)" }}>Due {selected.due}</span>}
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>Record a payment</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface)", padding: "0 12px" }}>
                  <input placeholder={`Amount up to ${ugx(selected.billed - selected.paid)}`} style={{ border: "none", outline: "none", background: "transparent", padding: "10px 0", width: "100%", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-primary)" }} />
                </div>
              </div>
              <button className="ml-btn ml-btn-primary" style={{ width: "100%", marginTop: 12 }}>
                <CreditCard size={14} /> Confirm payment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
