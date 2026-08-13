"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  LayoutGrid, Users, CalendarCheck, Wallet, GraduationCap,
  MessageSquare, Settings, Search, Bell, Sparkles, ArrowUpRight,
  ArrowDownRight, Sun, Moon, Plus, Clock, CheckCircle2
} from "lucide-react";

const tokens = `
  .ml-root{
    --ink-900:#0B1B33; --ink-700:#12294B; --ink-500:#2C4A75; --ink-100:#E7ECF4;
    --emerald-700:#0B5E45; --emerald-600:#0E7C5A; --emerald-400:#3FAE85; --emerald-100:#DFF3EA;
    --paper-0:#FFFFFF; --mist-50:#F6F8FB; --mist-100:#F3F5F8; --mist-300:#DDE3EC; --mist-500:#8A94A6; --mist-700:#4B5568;
    --amethyst:#6B4FA0; --gold:#C9962C; --turquoise:#1B93A6; --orange:#D97A34; --soft-red:#C1503E;
    --radius-sm:6px; --radius-md:12px; --radius-lg:20px;
    --shadow-sm: 0 1px 2px rgba(11,27,51,0.06), 0 1px 1px rgba(11,27,51,0.04);
    --shadow-md: 0 6px 16px rgba(11,27,51,0.08), 0 2px 4px rgba(11,27,51,0.04);
    --font-display:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif; --font-mono:'IBM Plex Mono', monospace;
    --bg:var(--paper-0); --surface:var(--mist-50); --text-primary:var(--ink-900); --text-secondary:var(--mist-700); --border:var(--mist-300);
    background:var(--bg); color:var(--text-primary); font-family:var(--font-body);
    min-height:100vh;
  }
  .ml-root[data-theme="dark"]{
    --bg:#0B1420; --surface:#111E30; --text-primary:#EDF1F7; --text-secondary:#9FADC2; --border:#233150; --mist-100:#16233A;
  }
  .ml-root *{box-sizing:border-box;}
  .ml-shell{display:flex; min-height:100vh;}
  .ml-sidebar{
    width:220px; flex-shrink:0; border-right:1px solid var(--border); padding:20px 14px; display:flex; flex-direction:column; gap:4px;
  }
  .ml-brand{display:flex; align-items:center; gap:10px; padding:6px 8px 22px;}
  .ml-brand-mark{width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg, var(--ink-700), var(--emerald-600)); flex-shrink:0;}
  .ml-brand-name{font-family:var(--font-display); font-weight:700; font-size:16px;}
  .ml-brand-sub{font-family:var(--font-mono); font-size:9px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.06em;}
  .ml-nav-item{
    display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:var(--radius-sm);
    font-size:13.5px; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:background .15s;
  }
  .ml-nav-item:hover{background:var(--surface);}
  .ml-nav-item.active{background:var(--ink-700); color:#fff;}
  .ml-main{flex:1; min-width:0;}
  .ml-topbar{
    display:flex; align-items:center; justify-content:space-between; padding:16px 28px; border-bottom:1px solid var(--border);
  }
  .ml-search{
    display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border);
    border-radius:999px; padding:8px 14px; width:280px; color:var(--text-secondary); font-size:13px;
  }
  .ml-icon-btn{
    width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center;
    background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary); position:relative;
  }
  .ml-avatar{width:36px; height:36px; border-radius:999px; background:linear-gradient(135deg, var(--emerald-600), var(--turquoise)); display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:600; font-size:13px;}
  .ml-content{padding:26px 28px 60px;}
  .ml-eyebrow{font-family:var(--font-mono); font-size:11px; color:var(--emerald-600); text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px;}
  .ml-h1{font-family:var(--font-display); font-size:28px; font-weight:700; letter-spacing:-.01em; margin:0;}
  .ml-sub{color:var(--text-secondary); font-size:13.5px; margin-top:4px;}
  .ml-quick-actions{display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;}
  .ml-btn{
    font-family:var(--font-body); font-weight:600; font-size:13px; border-radius:var(--radius-sm); padding:9px 15px;
    cursor:pointer; border:1px solid transparent; display:flex; align-items:center; gap:6px;
  }
  .ml-btn-primary{background:var(--ink-700); color:#fff;}
  .ml-btn-outline{background:transparent; border-color:var(--border); color:var(--text-primary);}

  .ml-kpi-grid{display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-top:26px;}
  @media (max-width:900px){ .ml-kpi-grid{grid-template-columns:repeat(2,1fr);} }
  .ml-kpi{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:18px 20px; position:relative; overflow:hidden;}
  .ml-kpi::before{content:""; position:absolute; left:0; top:0; bottom:0; width:4px;}
  .ml-kpi.blue::before{background:var(--ink-700);} .ml-kpi.green::before{background:var(--emerald-600);}
  .ml-kpi.gold::before{background:var(--gold);} .ml-kpi.purple::before{background:var(--amethyst);}
  .ml-kpi-label{font-size:12px; color:var(--text-secondary); font-weight:600; display:flex; align-items:center; gap:6px;}
  .ml-kpi-value{font-family:var(--font-mono); font-size:26px; font-weight:600; margin:8px 0 4px;}
  .ml-kpi-delta{font-size:12px; display:flex; align-items:center; gap:3px; font-weight:600;}
  .ml-kpi-delta.up{color:var(--emerald-600);} .ml-kpi-delta.down{color:var(--soft-red);}

  .ml-row{display:grid; grid-template-columns:1.4fr 1fr; gap:16px; margin-top:16px;}
  @media (max-width:900px){ .ml-row{grid-template-columns:1fr;} }
  .ml-panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .ml-panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .ml-panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600;}
  .ml-panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}

  .ml-ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:20px 22px;}
  .ml-ai-item{display:flex; gap:10px; padding:10px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ml-ai-item:last-child{border-bottom:none;}
  .ml-ai-icon{width:26px; height:26px; border-radius:8px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

  .ml-event{display:flex; gap:12px; align-items:flex-start; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .ml-event:last-child{border-bottom:none;}
  .ml-event-date{font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); width:44px; flex-shrink:0; text-align:center; background:var(--mist-100); border-radius:8px; padding:6px 4px;}

  table.ml-table{width:100%; border-collapse:collapse; font-size:13px;}
  table.ml-table th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding-bottom:10px; border-bottom:1px solid var(--border);}
  table.ml-table td{padding:10px 0; border-bottom:1px solid var(--border);}
  table.ml-table tr:last-child td{border-bottom:none;}
  .ml-pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600;}
  .ml-pill.paid{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .ml-pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
`;

const attendanceData = [
  { day: "Mon", value: 92 }, { day: "Tue", value: 94 }, { day: "Wed", value: 89 },
  { day: "Thu", value: 96 }, { day: "Fri", value: 91 }, { day: "Sat", value: 97 },
];

const revenueData = [
  { term: "Wk1", amount: 8.2 }, { term: "Wk2", amount: 11.4 }, { term: "Wk3", amount: 9.8 },
  { term: "Wk4", amount: 14.1 }, { term: "Wk5", amount: 12.6 }, { term: "Wk6", amount: 16.3 },
];

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Users, label: "Students", href: "/students" },
  { icon: CalendarCheck, label: "Attendance", href: "/attendance" },
  { icon: Wallet, label: "Fees", href: "/fees" },
  { icon: GraduationCap, label: "Academics", href: "/academics" },
  { icon: MessageSquare, label: "Communication", href: "/communication" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function MonaLearnDashboard() {
  const [theme, setTheme] = useState("light");

  const gridStroke = theme === "dark" ? "#233150" : "#DDE3EC";
  const textMuted = theme === "dark" ? "#9FADC2" : "#4B5568";

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="ml-shell">

        <aside className="ml-sidebar">
          <div className="ml-brand">
            <div className="ml-brand-mark" />
            <div>
              <div className="ml-brand-name">MonaLearn</div>
              <div className="ml-brand-sub">Kitante Hill School</div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`ml-nav-item ${item.active ? "active" : ""}`} style={{ textDecoration: "none" }}>
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </aside>

        <main className="ml-main">
          <div className="ml-topbar">
            <div className="ml-search">
              <Search size={15} />
              Search students, fees, reports…
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                className="ml-icon-btn"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
              <div className="ml-icon-btn" aria-label="Notifications">
                <Bell size={15} />
              </div>
              <div className="ml-avatar">KM</div>
            </div>
          </div>

          <div className="ml-content">
            <div className="ml-eyebrow">Monday, 20 July</div>
            <h1 className="ml-h1">Good morning, Kabuusu</h1>
            <p className="ml-sub">Term 2 is 62% complete. Here's how the school is doing today.</p>

            <div className="ml-quick-actions">
              <button className="ml-btn ml-btn-primary"><Plus size={14} /> Enroll student</button>
              <button className="ml-btn ml-btn-outline"><CalendarCheck size={14} /> Take attendance</button>
              <button className="ml-btn ml-btn-outline"><Wallet size={14} /> Record payment</button>
            </div>

            <div className="ml-kpi-grid">
              <div className="ml-kpi blue">
                <div className="ml-kpi-label"><Users size={13} /> Total students</div>
                <div className="ml-kpi-value">1,842</div>
                <div className="ml-kpi-delta up"><ArrowUpRight size={13} /> +24 this term</div>
              </div>
              <div className="ml-kpi green">
                <div className="ml-kpi-label"><CalendarCheck size={13} /> Attendance today</div>
                <div className="ml-kpi-value">93.6%</div>
                <div className="ml-kpi-delta up"><ArrowUpRight size={13} /> +2.1% vs avg</div>
              </div>
              <div className="ml-kpi gold">
                <div className="ml-kpi-label"><Wallet size={13} /> Fees collected</div>
                <div className="ml-kpi-value">UGX 42.1M</div>
                <div className="ml-kpi-delta down"><ArrowDownRight size={13} /> 22% still due</div>
              </div>
              <div className="ml-kpi purple">
                <div className="ml-kpi-label"><GraduationCap size={13} /> Staff present</div>
                <div className="ml-kpi-value">118 / 124</div>
                <div className="ml-kpi-delta up"><ArrowUpRight size={13} /> 95% today</div>
              </div>
            </div>

            <div className="ml-row">
              <div className="ml-panel">
                <div className="ml-panel-head">
                  <div className="ml-panel-title">Attendance trend</div>
                  <div className="ml-panel-tag">Last 6 days</div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0E7C5A" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#0E7C5A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#0E7C5A" strokeWidth={2.5} fill="url(#attGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="ml-ai-panel">
                <div className="ml-panel-head">
                  <div className="ml-panel-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={15} color="#6B4FA0" /> AI insights
                  </div>
                </div>
                <div className="ml-ai-item">
                  <div className="ml-ai-icon"><Sparkles size={13} /></div>
                  <div>3 students in S.3 Green show a rising absence pattern. Consider a check-in this week.</div>
                </div>
                <div className="ml-ai-item">
                  <div className="ml-ai-icon"><Sparkles size={13} /></div>
                  <div>Fee collection is trending 9% ahead of this point last term.</div>
                </div>
                <div className="ml-ai-item">
                  <div className="ml-ai-icon"><Sparkles size={13} /></div>
                  <div>Suggested timetable fix: Mr. Okello has back-to-back classes with no gap on Thursdays.</div>
                </div>
              </div>
            </div>

            <div className="ml-row">
              <div className="ml-panel">
                <div className="ml-panel-head">
                  <div className="ml-panel-title">Fees collected (weekly)</div>
                  <div className="ml-panel-tag">UGX millions</div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={revenueData}>
                    <CartesianGrid stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="term" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#12294B" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="ml-panel">
                <div className="ml-panel-head">
                  <div className="ml-panel-title">Upcoming events</div>
                  <div className="ml-panel-tag">This week</div>
                </div>
                <div className="ml-event">
                  <div className="ml-event-date">22<br />Jul</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Mid-term exams begin</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>All senior classes</div>
                  </div>
                </div>
                <div className="ml-event">
                  <div className="ml-event-date">24<br />Jul</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Parent-teacher meeting</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>4:00 PM, Main Hall</div>
                  </div>
                </div>
                <div className="ml-event">
                  <div className="ml-event-date">26<br />Jul</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Inter-house sports day</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>All day, school grounds</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-panel" style={{ marginTop: 16 }}>
              <div className="ml-panel-head">
                <div className="ml-panel-title">Recent payments</div>
                <div className="ml-panel-tag">Today</div>
              </div>
              <table className="ml-table">
                <thead>
                  <tr><th>Student</th><th>Class</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr><td>Amina Nakato</td><td>S.4 Blue</td><td style={{ fontFamily: "var(--font-mono)" }}>UGX 620,000</td><td><span className="ml-pill paid"><CheckCircle2 size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Paid</span></td></tr>
                  <tr><td>Brian Okwir</td><td>S.2 Gold</td><td style={{ fontFamily: "var(--font-mono)" }}>UGX 300,000</td><td><span className="ml-pill pending"><Clock size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Pending</span></td></tr>
                  <tr><td>Faith Namutebi</td><td>S.6 Emerald</td><td style={{ fontFamily: "var(--font-mono)" }}>UGX 780,000</td><td><span className="ml-pill paid"><CheckCircle2 size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Paid</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
