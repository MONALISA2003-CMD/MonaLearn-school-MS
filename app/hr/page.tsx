"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, X, Sun, Moon, Sparkles, Download, Users,
  Wallet, FileCheck, UserPlus, Star, Phone, Mail, MoreHorizontal
} from "lucide-react";

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
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:640px;}
  thead th{
    text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase;
    letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;
  }
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  tbody tr.clickable{cursor:pointer; transition:background .12s;}
  tbody tr.clickable:hover{background:var(--mist-100);}
  .staff-cell{display:flex; align-items:center; gap:10px;}
  .avatar{width:32px; height:32px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:12px; flex-shrink:0;}
  .name{font-weight:600;}
  .adm{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);}
  .mono{font-family:var(--font-mono); font-size:12px;}

  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.approved, .pill.paid, .pill.active, .pill.hired{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending, .pill.review, .pill.interview{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.declined, .pill.overdue{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.processing, .pill.applied{background:rgba(27,147,166,.14); color:var(--turquoise);}

  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

  .payslip-line{display:flex; justify-content:space-between; font-size:12.5px; padding:7px 0; border-bottom:1px dashed var(--border); color:var(--text-secondary);}
  .payslip-line.deduct span:last-child{color:var(--soft-red);}
  .payslip-line.total{border-bottom:none; font-weight:700; color:var(--text-primary); font-size:13.5px; padding-top:10px;}

  .stars{display:flex; gap:2px;}
  .leave-track{display:flex; gap:6px; margin-top:6px;}
  .leave-dot{width:16px; height:6px; border-radius:99px; background:var(--mist-300);}
  .leave-dot.used{background:var(--emerald-600);}

  /* Drawer */
  .overlay{position:fixed; inset:0; background:rgba(11,20,32,0.4); z-index:30;}
  .drawer{
    position:fixed; top:0; right:0; bottom:0; width:420px; max-width:92vw; background:var(--bg); z-index:31;
    box-shadow:var(--shadow-lg); overflow-y:auto; border-left:1px solid var(--border);
  }
  @media (max-width:500px){ .drawer{width:100vw;} }
  .drawer-head{padding:22px 22px 18px; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; justify-content:space-between;}
  .drawer-profile{display:flex; gap:14px; align-items:center;}
  .drawer-avatar{width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:700; font-size:18px; flex-shrink:0;}
  .drawer-name{font-family:var(--font-display); font-size:18px; font-weight:700;}
  .drawer-meta{font-size:12px; color:var(--text-secondary); margin-top:2px;}
  .drawer-body{padding:20px 22px 40px;}
`;

const sampleStaff = [
  { id: "STF-0041", name: "Mr. Okello", dept: "Mathematics", role: "Teacher", phone: "0772 118 004", email: "okello@kitantehill.ac.ug", status: "active", color: "linear-gradient(135deg,#12294B,#2C4A75)" },
  { id: "STF-0042", name: "Ms. Nabirye", dept: "English", role: "Teacher", phone: "0701 552 890", email: "nabirye@kitantehill.ac.ug", status: "active", color: "linear-gradient(135deg,#0E7C5A,#3FAE85)" },
  { id: "STF-0043", name: "Mr. Kato", dept: "Science", role: "Head of Department", phone: "0755 903 214", email: "kato@kitantehill.ac.ug", status: "active", color: "linear-gradient(135deg,#6B4FA0,#8A6BC1)" },
  { id: "STF-0044", name: "Grace Namusoke", dept: "Finance", role: "Bursar", phone: "0782 447 601", email: "namusoke@kitantehill.ac.ug", status: "active", color: "linear-gradient(135deg,#C9962C,#D97A34)" },
];

const samplePayroll = [
  { name: "Mr. Okello", role: "Teacher", gross: 2400000, paye: 421000, nssf: 240000, lst: 25000, net: 1714000, status: "processing" },
  { name: "Ms. Nabirye", role: "Teacher", gross: 2200000, paye: 371000, nssf: 220000, lst: 25000, net: 1584000, status: "paid" },
  { name: "Mr. Kato", role: "Head of Department", gross: 3100000, paye: 651000, nssf: 310000, lst: 25000, net: 2114000, status: "paid" },
  { name: "Grace Namusoke", role: "Bursar", gross: 2600000, paye: 461000, nssf: 260000, lst: 25000, net: 1854000, status: "processing" },
];

const leave = [
  { name: "Ms. Nabirye", type: "Annual", dates: "28 Jul – 2 Aug", used: 12, balance: 9, status: "pending" },
  { name: "Mr. Kato", type: "Sick", dates: "18 Jul", used: 4, balance: 6, status: "approved" },
  { name: "Grace Namusoke", type: "Maternity", dates: "1 Sep – 30 Nov", used: 0, balance: 90, status: "approved" },
];

const recruitment = {
  Applied: [{ name: "Dennis Kaggwa", meta: "Applying for Physics Teacher" }],
  Interview: [{ name: "Patricia Nabatanzi", meta: "Bursar assistant · interview 24 Jul" }],
  Offered: [{ name: "Samuel Wanyama", meta: "PE Teacher · offer sent" }],
  Hired: [{ name: "Joyce Kembabazi", meta: "Librarian · starts 1 Aug" }],
};

const performance = [
  { name: "Mr. Okello", role: "Teacher", rating: 5, note: "Consistently strong exam results and student feedback." },
  { name: "Ms. Nabirye", role: "Teacher", rating: 4, note: "Excellent classroom engagement; syllabus slightly behind." },
  { name: "Mr. Kato", role: "Head of Department", rating: 4, note: "Strong department leadership; science coverage lagging school average." },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}
function ugx(n: number) {
  return "UGX " + n.toLocaleString();
}

const subnavItems = [
  { id: "directory", label: "Staff Directory", icon: Users },
  { id: "payroll", label: "Payroll", icon: Wallet },
  { id: "leave", label: "Leave Management", icon: FileCheck },
  { id: "recruitment", label: "Recruitment", icon: UserPlus },
  { id: "performance", label: "Performance", icon: Star },
];

export default function MonaLearnHR() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("directory");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [staff, setStaff] = useState(sampleStaff);
  const [payroll, setPayroll] = useState(samplePayroll);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const palette = ["linear-gradient(135deg,#12294B,#2C4A75)", "linear-gradient(135deg,#0E7C5A,#3FAE85)", "linear-gradient(135deg,#6B4FA0,#8A6BC1)", "linear-gradient(135deg,#C9962C,#D97A34)"];

    // Added GET /hr/staff during this wiring pass — no listing endpoint
    // existed before, only single-record leave toggles. Real Staff has
    // no "status" field beyond onLeave, so status shows active/on-leave
    // derived from that boolean rather than a fabricated finer state.
    fetch("/api/hr/staff", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setStaff(data.map((s, i) => ({
          id: s.staffNo,
          name: s.fullName,
          dept: s.department ?? "—",
          role: s.role,
          phone: s.phone ?? "—",
          email: s.email ?? "—",
          status: s.onLeave ? "pending" : "active",
          statusLabel: s.onLeave ? "on leave" : "active",
          color: palette[i % palette.length],
        })));
      })
      .catch(() => {});

    // Also fixed a tenant-scoping bug here: getPayrollRun previously had
    // no schoolId filter at all, so any authenticated user could pull
    // another school's payroll by guessing a period string.
    const period = new Date().toISOString().slice(0, 7);
    fetch(`/api/hr/payroll/${period}`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setPayroll(data.map((p) => ({
          name: p.staff?.fullName ?? "—",
          role: p.staff?.role ?? "—",
          gross: Number(p.grossSalary),
          paye: Number(p.paye),
          nssf: Number(p.nssf),
          lst: Number(p.lst),
          net: Number(p.netPay),
          status: p.status,
        })));
      })
      .catch(() => {});
  }, []);

  const filteredStaff = staff.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">124 staff members</div>
            <h1 className="h1">HR & Payroll</h1>
            <p className="sub">Staff records, payroll processing, leave, recruitment, and performance reviews.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Add staff</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "directory" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total staff</div><div className="stat-val">{staff.length}</div></div>
              <div className="stat-card green"><div className="stat-label">Teaching staff</div><div className="stat-val">{staff.filter((s) => s.role?.toLowerCase().includes("teacher")).length}</div></div>
              <div className="stat-card gold"><div className="stat-label">Support staff</div><div className="stat-val">{staff.filter((s) => !s.role?.toLowerCase().includes("teacher")).length}</div></div>
              <div className="stat-card red"><div className="stat-label">On leave today</div><div className="stat-val">{staff.filter((s) => s.status === "pending").length}</div></div>
            </div>
            <div className="toolbar">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search staff…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="chip">Department <ChevronDown size={13} /></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Staff</th><th>Department</th><th>Role</th><th>Contact</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="clickable" onClick={() => setSelected(s)}>
                      <td>
                        <div className="staff-cell">
                          <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
                          <div>
                            <div className="name">{s.name}</div>
                            <div className="adm">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.dept}</td>
                      <td>{s.role}</td>
                      <td className="mono">{s.phone}</td>
                      <td><span className={`pill ${s.status}`}>{s.statusLabel ?? s.status}</span></td>
                      <td><MoreHorizontal size={15} color="var(--text-secondary)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "payroll" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Gross payroll</div><div className="stat-val">{ugx(payroll.reduce((s, p) => s + p.gross, 0))}</div></div>
              <div className="stat-card green"><div className="stat-label">Net payout</div><div className="stat-val">{ugx(payroll.reduce((s, p) => s + p.net, 0))}</div></div>
              <div className="stat-card gold"><div className="stat-label">PAYE remitted</div><div className="stat-val">{ugx(payroll.reduce((s, p) => s + p.paye, 0))}</div></div>
              <div className="stat-card red"><div className="stat-label">NSSF remitted</div><div className="stat-val">{ugx(payroll.reduce((s, p) => s + p.nssf, 0))}</div></div>
            </div>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><Wallet size={15} /> {new Date().toLocaleDateString([], { month: "long", year: "numeric" })} payroll run</div>
              <p className="panel-note">Statutory deductions calculated automatically per Uganda's PAYE, NSSF (10% employer + 5% employee), and Local Service Tax requirements.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Staff</th><th>Role</th><th>Gross</th><th>PAYE</th><th>NSSF</th><th>LST</th><th>Net pay</th><th>Status</th></tr></thead>
                <tbody>
                  {payroll.map((p, i) => (
                    <tr key={i}>
                      <td className="name">{p.name}</td>
                      <td>{p.role}</td>
                      <td className="mono">{ugx(p.gross)}</td>
                      <td className="mono" style={{ color: "var(--soft-red)" }}>-{ugx(p.paye)}</td>
                      <td className="mono" style={{ color: "var(--soft-red)" }}>-{ugx(p.nssf)}</td>
                      <td className="mono" style={{ color: "var(--soft-red)" }}>-{ugx(p.lst)}</td>
                      <td className="mono" style={{ fontWeight: 700 }}>{ugx(p.net)}</td>
                      <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "leave" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Pending requests</div><div className="stat-val">1</div></div>
              <div className="stat-card green"><div className="stat-label">Approved this month</div><div className="stat-val">6</div></div>
              <div className="stat-card gold"><div className="stat-label">On leave today</div><div className="stat-val">3</div></div>
              <div className="stat-card red"><div className="stat-label">Maternity/paternity active</div><div className="stat-val">1</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Staff</th><th>Type</th><th>Dates</th><th>Balance</th><th>Status</th></tr></thead>
                <tbody>
                  {leave.map((l, i) => (
                    <tr key={i}>
                      <td className="name">{l.name}</td>
                      <td>{l.type}</td>
                      <td className="mono">{l.dates}</td>
                      <td>{l.balance} days left</td>
                      <td><span className={`pill ${l.status}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "recruitment" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Open positions</div><div className="stat-val">2</div></div>
              <div className="stat-card green"><div className="stat-label">Candidates in pipeline</div><div className="stat-val">4</div></div>
              <div className="stat-card gold"><div className="stat-label">Offers pending</div><div className="stat-val">1</div></div>
              <div className="stat-card red"><div className="stat-label">Hired this term</div><div className="stat-val">1</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {Object.entries(recruitment).map(([stage, apps]) => (
                <div className="panel" key={stage} style={{ padding: 14 }}>
                  <div className="panel-title" style={{ fontSize: 12.5, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>{stage} <span className="panel-tag">{apps.length}</span></div>
                  {apps.map((a, i) => (
                    <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", marginBottom: 8, fontSize: 12.5 }}>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: 11 }}>{a.meta}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "performance" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Staff</th><th>Role</th><th>Rating</th><th>Appraisal note</th></tr></thead>
              <tbody>
                {performance.map((p, i) => (
                  <tr key={i}>
                    <td className="name">{p.name}</td>
                    <td>{p.role}</td>
                    <td>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={13} fill={n <= p.rating ? "#C9962C" : "none"} color={n <= p.rating ? "#C9962C" : "var(--mist-300)"} />
                        ))}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <div className="drawer-meta">{selected.role} · {selected.dept}</div>
                </div>
              </div>
              <button className="ml-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={15} /></button>
            </div>
            <div className="drawer-body">
              <div className="payslip-line"><span><Phone size={12} style={{ verticalAlign: -2, marginRight: 4 }} />Phone</span><span>{selected.phone}</span></div>
              <div className="payslip-line"><span><Mail size={12} style={{ verticalAlign: -2, marginRight: 4 }} />Email</span><span>{selected.email}</span></div>
              <div className="payslip-line"><span>Staff ID</span><span className="mono">{selected.id}</span></div>

              <div style={{ marginTop: 18 }}>
                <div className="panel-title" style={{ fontSize: 13.5, marginBottom: 8 }}><Wallet size={14} /> Latest payslip — July 2026</div>
                <div className="payslip-line"><span>Gross salary</span><span>{ugx(2400000)}</span></div>
                <div className="payslip-line deduct"><span>PAYE</span><span>{ugx(421000)}</span></div>
                <div className="payslip-line deduct"><span>NSSF (employee 5%)</span><span>{ugx(120000)}</span></div>
                <div className="payslip-line deduct"><span>Local Service Tax</span><span>{ugx(25000)}</span></div>
                <div className="payslip-line total"><span>Net pay</span><span>{ugx(1834000)}</span></div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="panel-title" style={{ fontSize: 13.5, marginBottom: 8 }}>Annual leave balance</div>
                <div className="leave-track">
                  {Array.from({ length: 21 }).map((_, i) => <div key={i} className={`leave-dot ${i < 12 ? "used" : ""}`} />)}
                </div>
                <div className="panel-note" style={{ marginTop: 6 }}>12 of 21 days used this year</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
