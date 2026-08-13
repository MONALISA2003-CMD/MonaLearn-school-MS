"use client";

import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Sparkles, Download, LayoutDashboard, GitCompareArrows,
  FileBarChart, Bookmark
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip
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
  .row{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;}
  @media (max-width:900px){ .row{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:20px 22px;}
  .ai-item{display:flex; gap:10px; padding:11px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon{width:26px; height:26px; border-radius:8px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
  .report-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:14px;}
  .report-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; cursor:pointer;}
  .report-card:hover{border-color:var(--ink-700);}
  .report-icon{width:34px; height:34px; border-radius:10px; background:var(--ink-700); color:#fff; display:flex; align-items:center; justify-content:center; margin-bottom:10px;}
  .report-title{font-weight:700; font-size:13.5px; margin-bottom:4px;}
  .report-desc{font-size:11.5px; color:var(--text-secondary); line-height:1.5;}
`;

const enrollmentTrend = [
  { term: "T1 '25", students: 1720 }, { term: "T2 '25", students: 1765 }, { term: "T3 '25", students: 1790 },
  { term: "T1 '26", students: 1815 }, { term: "T2 '26", students: 1842 },
];

const sampleCorrelation = [
  { attendance: 96, grade: 88 }, { attendance: 92, grade: 82 }, { attendance: 74, grade: 48 },
  { attendance: 88, grade: 71 }, { attendance: 99, grade: 92 }, { attendance: 68, grade: 51 },
  { attendance: 93, grade: 80 }, { attendance: 85, grade: 68 },
];

const savedReports = [
  { title: "Termly Board Report", desc: "Enrollment, finances, academics, and staffing in one export for the board meeting." },
  { title: "Fee Collection vs. Attendance", desc: "Correlation between family payment status and student attendance patterns." },
  { title: "Teacher Workload Summary", desc: "Periods taught, syllabus coverage, and appraisal ratings side by side." },
  { title: "Facilities Spend Tracker", desc: "Combines Inventory, Maintenance, and Finance budget data." },
];

const subnavItems = [
  { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
  { id: "correlations", label: "Cross-Module Insights", icon: GitCompareArrows },
  { id: "reports", label: "Saved Reports", icon: FileBarChart },
];

export default function MonaLearnAnalytics() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("overview");
  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";
  const [correlation, setCorrelation] = useState(sampleCorrelation);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // Correlations tab → GET /academics/correlation/:term, the same
    // computed endpoint AnalyticsService.getExecutiveOverview already
    // calls internally. Overview tab's enrollment-trend chart and the
    // three hardcoded "cross-module insight" bullets stay on sample
    // data — enrollment history isn't tracked as a time series and the
    // insight text cites specific classes/terms not derivable live.
    fetch(`/api/academics/correlation/${encodeURIComponent("Term 2")}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data?.length) return;
        setCorrelation(data.map((d) => ({ attendance: d.attendancePct, grade: d.avgGrade })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Board-level view</div>
            <h1 className="h1">Analytics & Executive Reports</h1>
            <p className="sub">Insights that pull across every module — not just per-module stats, but how they connect.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Bookmark size={14} /> Save report</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "overview" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Enrollment</div><div className="stat-val">1,842</div></div>
              <div className="stat-card green"><div className="stat-label">Fee collection rate</div><div className="stat-val">78%</div></div>
              <div className="stat-card gold"><div className="stat-label">Avg. academic score</div><div className="stat-val">76.4%</div></div>
              <div className="stat-card red"><div className="stat-label">School-wide attendance</div><div className="stat-val">93.6%</div></div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Enrollment growth</div>
                <div className="panel-tag">Last 5 terms</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="term" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1650, 1900]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#12294B" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tabView === "correlations" && (
          <div className="row">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Attendance vs. academic grade</div>
                <div className="panel-tag">Term 2</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid stroke={gridStroke} />
                  <XAxis type="number" dataKey="attendance" name="Attendance %" domain={[60, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="grade" name="Grade %" domain={[40, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={correlation} fill="#0E7C5A" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="ai-panel">
              <div className="panel-head"><div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> Cross-module insights</div></div>
              <div className="ai-item"><div className="ai-icon"><Sparkles size={13} /></div><div>Students below 80% attendance average 24 points lower in academic scores — attendance interventions may be the highest-leverage academic fix available.</div></div>
              <div className="ai-item"><div className="ai-icon"><Sparkles size={13} /></div><div>Classes with the lowest fee collection rate (S.3) also show the lowest attendance — worth checking whether financial stress is driving absences.</div></div>
              <div className="ai-item"><div className="ai-icon"><Sparkles size={13} /></div><div>Facilities spend is 102% of budget in the same term transport fuel costs dropped 15% — maintenance backlog may be shifting costs between categories.</div></div>
            </div>
          </div>
        )}

        {tabView === "reports" && (
          <div className="report-grid">
            {savedReports.map((r) => (
              <div className="report-card" key={r.title}>
                <div className="report-icon"><FileBarChart size={16} /></div>
                <div className="report-title">{r.title}</div>
                <div className="report-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
