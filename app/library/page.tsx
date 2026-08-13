"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, BookOpen,
  RefreshCcw, Wallet, Laptop, BarChart3, ScanLine, AlertCircle, Check
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
  .pill.available, .pill.returned, .pill.active, .pill.paid{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.reserved, .pill.due-soon{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.overdue, .pill.lost{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.checked-out{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .book-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:14px;}
  .book-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px;}
  .book-cover{width:100%; height:8px; border-radius:99px; margin-bottom:12px;}
  .book-title{font-weight:700; font-size:13.5px; margin-bottom:2px;}
  .book-author{font-size:11.5px; color:var(--text-secondary); margin-bottom:10px;}
  .book-meta{display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--text-secondary);}

  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

  .scan-box{
    display:flex; align-items:center; gap:12px; background:var(--surface); border:2px dashed var(--border); border-radius:var(--radius-lg);
    padding:22px; margin-bottom:20px; justify-content:center; text-align:center; flex-direction:column;
  }

  .digital-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;}
  .digital-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px; display:flex; gap:12px; align-items:flex-start;}
  .digital-icon{width:36px; height:36px; border-radius:10px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
`;

const sampleCatalog = [
  { title: "Things Fall Apart", author: "Chinua Achebe", copies: 6, available: 4, color: "linear-gradient(90deg,#12294B,#2C4A75)" },
  { title: "A Grain of Wheat", author: "Ngũgĩ wa Thiong'o", copies: 4, available: 0, color: "linear-gradient(90deg,#0E7C5A,#3FAE85)" },
  { title: "Advanced Mathematics for East Africa", author: "M. Kimani", copies: 20, available: 12, color: "linear-gradient(90deg,#6B4FA0,#8A6BC1)" },
  { title: "The River Between", author: "Ngũgĩ wa Thiong'o", copies: 5, available: 5, color: "linear-gradient(90deg,#1B93A6,#3FAE85)" },
  { title: "Physics for Senior Secondary", author: "J. Byaruhanga", copies: 15, available: 3, color: "linear-gradient(90deg,#C9962C,#D97A34)" },
  { title: "Weep Not, Child", author: "Ngũgĩ wa Thiong'o", copies: 8, available: 6, color: "linear-gradient(90deg,#C1503E,#D97A34)" },
];

const circulation = [
  { student: "Amina Nakato", cls: "S.4 Blue", book: "Things Fall Apart", issued: "10 Jul", due: "24 Jul", status: "checked-out" },
  { student: "Brian Okwir", cls: "S.2 Gold", book: "Advanced Mathematics for East Africa", issued: "5 Jul", due: "19 Jul", status: "overdue" },
  { student: "Faith Namutebi", cls: "S.6 Emerald", book: "Physics for Senior Secondary", issued: "15 Jul", due: "29 Jul", status: "checked-out" },
  { student: "Grace Achieng", cls: "S.4 Blue", book: "The River Between", issued: "1 Jul", due: "15 Jul", status: "returned" },
];

const fines = [
  { student: "Brian Okwir", cls: "S.2 Gold", book: "Advanced Mathematics for East Africa", daysLate: 1, amount: 3000, status: "due-soon" },
  { student: "Derrick Ssenyonga", cls: "S.1 Ruby", book: "A Grain of Wheat", daysLate: 12, amount: 24000, status: "overdue" },
  { student: "Isaac Mugabi", cls: "S.3 Green", book: "Weep Not, Child", daysLate: 0, amount: 0, status: "paid" },
];

const digital = [
  { title: "Encyclopaedia Britannica School Edition", type: "Reference database", access: "All students & staff" },
  { title: "O-Level Past Papers Archive", type: "PDF collection", access: "S.1–S.4" },
  { title: "African Literature Anthology (e-book)", type: "e-Book", access: "S.5–S.6 Literature" },
  { title: "Khan Academy Science Library", type: "Video resource", access: "All students" },
];

const topBorrowed = [
  { title: "Things Fall Apart", count: 34 }, { title: "Weep Not, Child", count: 28 },
  { title: "Adv. Mathematics", count: 25 }, { title: "The River Between", count: 19 },
  { title: "Physics S.S.", count: 15 },
];

function ugx(n: number) {
  return "UGX " + n.toLocaleString();
}

const subnavItems = [
  { id: "catalog", label: "Catalog", icon: BookOpen },
  { id: "circulation", label: "Circulation", icon: RefreshCcw },
  { id: "fines", label: "Fines & Overdue", icon: Wallet },
  { id: "digital", label: "Digital Library", icon: Laptop },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

export default function MonaLearnLibrary() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("catalog");
  const [query, setQuery] = useState("");

  // Real fetch against GET /library/catalog — the endpoint that never
  // existed at all until it was added specifically to close this gap.
  // Field names (title, author, copies, available) match the Book model
  // exactly, so no response-shape mapping is needed here.
  const [catalog, setCatalog] = useState(sampleCatalog);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/library/catalog?page=1&pageSize=50", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((result) => {
        if (result.data?.length) {
          setCatalog(
            result.data.map((b, i) => ({
              ...b,
              color: sampleCatalog[i % sampleCatalog.length].color, // backend has no color field; reuse the design system's palette cycle
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const filteredCatalog = catalog.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()));
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">4,280 items catalogued</div>
            <h1 className="h1">Library</h1>
            <p className="sub">Catalog, circulation, fines, digital resources, and usage reports.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Add book</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "catalog" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total titles</div><div className="stat-val">1,240</div></div>
              <div className="stat-card green"><div className="stat-label">Copies available</div><div className="stat-val">2,860</div></div>
              <div className="stat-card gold"><div className="stat-label">Checked out</div><div className="stat-val">318</div></div>
              <div className="stat-card red"><div className="stat-label">Overdue</div><div className="stat-val">22</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search by title, author, or shelf location…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="chip">Subject <ChevronDown size={13} /></div>
              <div className="chip">Availability <ChevronDown size={13} /></div>
            </div>
            <div className="book-grid">
              {filteredCatalog.map((b) => (
                <div className="book-card" key={b.title}>
                  <div className="book-cover" style={{ background: b.color }} />
                  <div className="book-title">{b.title}</div>
                  <div className="book-author">{b.author}</div>
                  <div className="book-meta">
                    <span>{b.available} of {b.copies} available</span>
                    <span className={`pill ${b.available > 0 ? "available" : "reserved"}`}>{b.available > 0 ? "In stock" : "All out"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "circulation" && (
          <>
            <div className="scan-box">
              <ScanLine size={26} color="var(--emerald-600)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Scan student ID, then scan book barcode</div>
                <div className="panel-note">Checkout and return complete in under 5 seconds — due date is set automatically from the loan policy.</div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Book</th><th>Issued</th><th>Due</th><th>Status</th></tr></thead>
                <tbody>
                  {circulation.map((c, i) => (
                    <tr key={i}>
                      <td className="name">{c.student}</td>
                      <td>{c.cls}</td>
                      <td>{c.book}</td>
                      <td className="mono">{c.issued}</td>
                      <td className="mono">{c.due}</td>
                      <td><span className={`pill ${c.status}`}>{c.status === "returned" ? <Check size={11} /> : c.status === "overdue" ? <AlertCircle size={11} /> : null} {c.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "fines" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Outstanding fines</div><div className="stat-val">UGX 27,000</div></div>
              <div className="stat-card red"><div className="stat-label">Overdue items</div><div className="stat-val">22</div></div>
              <div className="stat-card gold"><div className="stat-label">Lost/damaged</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Collected this term</div><div className="stat-val">UGX 61,000</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Book</th><th>Days late</th><th>Fine</th><th>Status</th></tr></thead>
                <tbody>
                  {fines.map((f, i) => (
                    <tr key={i}>
                      <td className="name">{f.student}</td>
                      <td>{f.cls}</td>
                      <td>{f.book}</td>
                      <td className="mono">{f.daysLate}</td>
                      <td className="mono">{ugx(f.amount)}</td>
                      <td><span className={`pill ${f.status}`}>{f.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "digital" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Laptop size={15} /> Digital library</div>
              <p className="panel-note">E-books, past papers, and reference databases accessible from the student and teacher portals — no physical checkout needed.</p>
            </div>
            <div className="digital-grid">
              {digital.map((d) => (
                <div className="digital-card" key={d.title}>
                  <div className="digital-icon"><Laptop size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{d.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{d.type}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{d.access}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "reports" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-head">
                <div className="panel-title"><BarChart3 size={15} /> Most borrowed this term</div>
                <div className="panel-tag">Top 5</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topBorrowed} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="title" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0E7C5A" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="panel">
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">Ngũgĩ wa Thiong'o titles account for 3 of the top 5 borrowed books — consider ordering additional copies of "A Grain of Wheat," which has zero copies currently available.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
