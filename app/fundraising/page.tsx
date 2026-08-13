"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, Users2,
  Megaphone, GraduationCap, TrendingUp
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
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.active, .pill.awarded, .pill.major{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.review, .pill.regular{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.declined, .pill.closed{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .campaign-bar{width:110px; height:6px; border-radius:99px; background:var(--mist-300); overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px;}
  .campaign-fill{height:100%; background:var(--emerald-600);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleDonors = [
  { name: "James Kavuma (alum, class of '98)", type: "Major donor", totalGiving: 12000000, lastGift: "14 Jun 2026" },
  { name: "Auma Family Foundation", type: "Regular donor", totalGiving: 4200000, lastGift: "2 May 2026" },
  { name: "Sarah Nakimuli (alum, class of '12)", type: "Regular donor", totalGiving: 850000, lastGift: "20 Mar 2026" },
];

const sampleCampaigns = [
  { name: "Science Lab Renovation Fund", goal: 40000000, raised: 24800000, status: "active" },
  { name: "Bursary & Scholarship Fund", goal: 60000000, raised: 37200000, status: "active" },
  { name: "Library Expansion (2025)", goal: 25000000, raised: 25000000, status: "closed" },
];

const sampleScholarshipApps = [
  { student: "Isaac Mugabi", cls: "S.3 Green", fund: "Bursary & Scholarship Fund", requested: 560000, status: "awarded" },
  { student: "Patience Nakayima", cls: "S.2 Gold", fund: "Bursary & Scholarship Fund", requested: 480000, status: "review" },
  { student: "New applicant — Peter Lubega", cls: "S.1 (applying)", fund: "Bursary & Scholarship Fund", requested: 620000, status: "review" },
];

const givingHistory = [
  { m: "Feb", amt: 3.2 }, { m: "Mar", amt: 4.8 }, { m: "Apr", amt: 2.1 },
  { m: "May", amt: 6.4 }, { m: "Jun", amt: 5.9 }, { m: "Jul", amt: 3.6 },
];

function ugx(n: number) { return "UGX " + n.toLocaleString(); }

const subnavItems = [
  { id: "donors", label: "Donor Directory", icon: Users2 },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "scholarships", label: "Scholarship Applications", icon: GraduationCap },
  { id: "reports", label: "Giving Reports", icon: TrendingUp },
];

export default function MonaLearnFundraising() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("donors");
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";
  const [donors, setDonors] = useState(sampleDonors);
  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const [scholarshipApps, setScholarshipApps] = useState(sampleScholarshipApps);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    // Added GET /fundraising/donors, /campaigns, /scholarships/applications
    // during this wiring pass — the backend previously only supported
    // single-record writes and a per-campaign progress read. Donor has
    // no "type" (major/regular) field and Campaign has no "status"
    // (active/closed) field in the schema, so those columns show "—"
    // live rather than a fabricated category.
    fetch("/api/fundraising/donors", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setDonors(data.map((d) => ({
          name: d.fullName,
          type: null,
          totalGiving: d.totalGiving,
          lastGift: d.lastGift ? new Date(d.lastGift).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "—",
        })));
      })
      .catch(() => {});

    fetch("/api/fundraising/campaigns", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setCampaigns(data.map((c) => ({ name: c.name, goal: c.goal, raised: c.raised, status: null })));
      })
      .catch(() => {});

    fetch("/api/fundraising/scholarships/applications", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setScholarshipApps(data.map((s) => ({
          student: s.student?.fullName ?? "—",
          cls: s.student?.class?.name ?? "—",
          fund: s.campaign?.name ?? "—",
          requested: Number(s.requested),
          status: s.status,
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
            <div className="eyebrow">Advancement office</div>
            <h1 className="h1">Fundraising & Advancement</h1>
            <p className="sub">Donor stewardship, giving campaigns, and scholarship application-to-disbursement workflow.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> New donor</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "donors" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Total donors</div><div className="stat-val">340</div></div>
              <div className="stat-card green"><div className="stat-label">Raised this year</div><div className="stat-val">UGX 62M</div></div>
              <div className="stat-card gold"><div className="stat-label">Major donors</div><div className="stat-val">12</div></div>
              <div className="stat-card red"><div className="stat-label">Lapsed (12+ months)</div><div className="stat-val">28</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Donor</th><th>Type</th><th>Total giving</th><th>Last gift</th></tr></thead>
                <tbody>
                  {donors.map((d, i) => (
                    <tr key={i}>
                      <td className="name">{d.name}</td>
                      <td>{d.type ? <span className={`pill ${d.type === "Major donor" ? "major" : "regular"}`}>{d.type}</span> : "—"}</td>
                      <td className="mono">{ugx(d.totalGiving)}</td>
                      <td className="mono">{d.lastGift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "campaigns" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Campaign</th><th>Progress</th><th>Status</th></tr></thead>
              <tbody>
                {campaigns.map((c, i) => {
                  const pct = Math.round((c.raised / c.goal) * 100);
                  return (
                    <tr key={i}>
                      <td className="name">{c.name}</td>
                      <td><div className="campaign-bar"><div className="campaign-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div>{ugx(c.raised)} of {ugx(c.goal)} ({pct}%)</td>
                      <td>{c.status ? <span className={`pill ${c.status}`}>{c.status}</span> : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tabView === "scholarships" && (
          <>
            {scholarshipApps === sampleScholarshipApps && (
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
                <p className="panel-note">The Bursary & Scholarship Fund has UGX 22.8M still available against 2 pending applications requesting a combined UGX 1.1M — well within capacity to approve both.</p>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Fund</th><th>Requested</th><th>Status</th></tr></thead>
                <tbody>
                  {scholarshipApps.map((s, i) => (
                    <tr key={i}>
                      <td className="name">{s.student}</td>
                      <td>{s.cls}</td>
                      <td>{s.fund}</td>
                      <td className="mono">{ugx(s.requested)}</td>
                      <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "reports" && (
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Monthly giving</div>
              <div className="panel-tag">UGX millions, last 6 months</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={givingHistory}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="amt" fill="#C9962C" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
