"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, FileEdit,
  CheckSquare, PackageCheck, Store
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
  .pill.approved, .pill.delivered, .pill.preferred{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.in-transit{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.rejected{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.draft{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleRequests = [
  { item: "Chemistry lab reagents (restock)", requestedBy: "Mr. Kato", dept: "Science", amount: 1850000, status: "pending" },
  { item: "Football pitch line marking equipment", requestedBy: "Coach Businge", dept: "Sports", amount: 620000, status: "draft" },
  { item: "Staff room furniture (6 chairs)", requestedBy: "Grace Namusoke", dept: "Admin", amount: 1200000, status: "approved" },
];

const approvals = [
  { item: "Staff room furniture (6 chairs)", requestedBy: "Grace Namusoke", approver: "Kabuusu Mohammed", date: "17 Jul", status: "approved" },
  { item: "Photocopier toner (bulk)", requestedBy: "Front office", approver: "Kabuusu Mohammed", date: "10 Jul", status: "approved" },
  { item: "New bus tires (x4)", requestedBy: "Transport office", approver: "Kabuusu Mohammed", date: "19 Jul", status: "pending" },
];

const orders = [
  { po: "PO-0091", vendor: "Lab Supplies Uganda Ltd", items: "Chemistry reagents", value: 1850000, status: "in-transit" },
  { po: "PO-0090", vendor: "Print Solutions", items: "Photocopier toner (bulk)", value: 940000, status: "delivered" },
  { po: "PO-0089", vendor: "Furniture World Kampala", items: "Staff room chairs (x6)", value: 1200000, status: "delivered" },
];

const vendors = [
  { name: "Lab Supplies Uganda Ltd", category: "Academic supplies", rating: "Preferred", status: "preferred" },
  { name: "Print Solutions", category: "Office supplies", rating: "Standard", status: "approved" },
  { name: "Furniture World Kampala", category: "Furniture", rating: "Preferred", status: "preferred" },
  { name: "Kampala Auto Care", category: "Vehicle servicing", rating: "Standard", status: "approved" },
];

function ugx(n: number) { return "UGX " + n.toLocaleString(); }

const subnavItems = [
  { id: "requests", label: "Purchase Requests", icon: FileEdit },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "orders", label: "Purchase Orders", icon: PackageCheck },
  { id: "vendors", label: "Vendor Catalog", icon: Store },
];

export default function MonaLearnProcurement() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("requests");
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState(sampleRequests);
  const [requestsLive, setRequestsLive] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // Only PENDING requests come back — draft/approved sample rows
    // correctly disappear once live data loads, same pattern as
    // Hostel's open-incidents endpoint. PurchaseRequest also has no
    // "dept" field, so that column is omitted rather than fabricated.
    fetch("/api/procurement/requests/pending", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setRequests(data.map((r) => ({ item: r.item, requestedBy: r.requestedBy, dept: null, amount: Number(r.amount), status: r.status })));
        setRequestsLive(true);
      })
      .catch(() => {});
  }, []);

  const filtered = requests.filter((r) => r.item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Term 2 · 2026</div>
            <h1 className="h1">Procurement</h1>
            <p className="sub">Purchase requests, approval chains, purchase orders, and the vendor catalog.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New request</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "requests" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Open requests</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Approved this month</div><div className="stat-val">9</div></div>
              <div className="stat-card gold"><div className="stat-label">Total requested value</div><div className="stat-val">UGX 3.7M</div></div>
              <div className="stat-card red"><div className="stat-label">Rejected</div><div className="stat-val">1</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box"><Search size={14} /><input placeholder="Search requests…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="chip">Department <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>Requested by</th><th>Department</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i}>
                      <td className="name">{r.item}</td>
                      <td>{r.requestedBy}</td>
                      <td>{r.dept ?? "—"}</td>
                      <td className="mono">{ugx(r.amount)}</td>
                      <td><span className={`pill ${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "approvals" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">The bus tire request has been pending approval for 2 days — the vehicle is due for its next service in 5 days, so approving soon avoids a scheduling clash.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>Requested by</th><th>Approver</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {approvals.map((a, i) => (
                    <tr key={i}>
                      <td className="name">{a.item}</td>
                      <td>{a.requestedBy}</td>
                      <td>{a.approver}</td>
                      <td className="mono">{a.date}</td>
                      <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "orders" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>PO number</th><th>Vendor</th><th>Items</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i}>
                    <td className="mono">{o.po}</td>
                    <td className="name">{o.vendor}</td>
                    <td>{o.items}</td>
                    <td className="mono">{ugx(o.value)}</td>
                    <td><span className={`pill ${o.status}`}>{o.status.replace("-", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "vendors" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vendor</th><th>Category</th><th>Rating</th></tr></thead>
              <tbody>
                {vendors.map((v, i) => (
                  <tr key={i}>
                    <td className="name">{v.name}</td>
                    <td>{v.category}</td>
                    <td><span className={`pill ${v.status}`}>{v.rating}</span></td>
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
