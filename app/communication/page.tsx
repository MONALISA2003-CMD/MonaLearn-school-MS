"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Send, Mail, MessageSquare,
  Smartphone, Bell, CheckCheck, Clock, Users, ArrowUpRight, Megaphone,
  FileText, Siren, Pin, Paperclip, CalendarClock, Video
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
  .stat-card.gold::before{background:var(--gold);} .stat-card.purple::before{background:var(--amethyst);}
  .stat-label{font-size:11.5px; color:var(--text-secondary); font-weight:600; display:flex; align-items:center; gap:6px;}
  .stat-val{font-family:var(--font-mono); font-size:22px; font-weight:600; margin-top:6px;}
  .stat-delta{font-size:11.5px; display:flex; align-items:center; gap:3px; font-weight:600; margin-top:4px; color:var(--emerald-600);}

  .layout{display:grid; grid-template-columns:1fr 1.15fr; gap:16px;}
  @media (max-width:920px){ .layout{grid-template-columns:1fr;} }
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .panel-title{font-family:var(--font-display); font-size:15.5px; font-weight:600; display:flex; align-items:center; gap:6px;}
  .panel-tag{font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); background:var(--mist-100); padding:3px 8px; border-radius:999px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}

  .channel-row{display:flex; gap:8px; margin-bottom:16px;}
  .channel-btn{
    flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; padding:10px 6px; border-radius:var(--radius-sm);
    border:1px solid var(--border); background:var(--bg); cursor:pointer; font-size:11px; font-weight:600; color:var(--text-secondary);
  }
  .channel-btn.active{border-color:var(--ink-700); background:var(--ink-100); color:var(--ink-700);}
  [data-theme="dark"] .channel-btn.active{background:rgba(63,174,133,0.14); border-color:var(--emerald-400); color:var(--emerald-400);}

  .field{margin-bottom:14px;}
  .field label{display:block; font-size:12px; font-weight:600; margin-bottom:6px; color:var(--text-secondary);}
  .field-input{
    display:flex; align-items:center; gap:8px; border:1px solid var(--border); border-radius:var(--radius-sm);
    background:var(--bg); padding:0 12px;
  }
  .field-input select, .field-input input{
    border:none; outline:none; background:transparent; padding:10px 0; font-family:var(--font-body); font-size:14px;
    width:100%; color:var(--text-primary);
  }
  textarea.compose{
    width:100%; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg); padding:12px;
    font-family:var(--font-body); font-size:13.5px; color:var(--text-primary); min-height:120px; resize:vertical;
  }
  .ai-suggest-btn{
    display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--amethyst); cursor:pointer;
    margin-top:8px;
  }
  .char-count{font-size:11px; color:var(--text-secondary); text-align:right; margin-top:4px;}

  .msg-item{display:flex; gap:12px; padding:13px 0; border-bottom:1px solid var(--border);}
  .msg-item:last-child{border-bottom:none;}
  .msg-icon{width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;}
  .msg-icon.email{background:var(--turquoise);} .msg-icon.sms{background:var(--gold);} .msg-icon.whatsapp{background:var(--emerald-600);} .msg-icon.push{background:var(--amethyst);}
  .msg-title{font-weight:600; font-size:13px;}
  .msg-meta{font-size:11.5px; color:var(--text-secondary); margin-top:2px;}
  .msg-status{display:flex; align-items:center; gap:4px; font-size:11px; color:var(--emerald-600); font-weight:600; margin-left:auto; white-space:nowrap;}
  .msg-status.pending{color:var(--orange);}

  .ai-panel{background:linear-gradient(135deg, rgba(107,79,160,0.08), rgba(107,79,160,0.02)); border:1px solid rgba(107,79,160,0.25); border-radius:var(--radius-lg); padding:18px 20px; margin-top:16px;}
  .ai-item{display:flex; gap:10px; padding:9px 0; border-bottom:1px dashed var(--border); font-size:12.5px;}
  .ai-item:last-child{border-bottom:none;}
  .ai-icon2{width:24px; height:24px; border-radius:7px; background:var(--amethyst); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}

  /* Announcements */
  .notice-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; margin-bottom:12px;}
  .notice-head{display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;}
  .notice-title{font-weight:700; font-size:13.5px; display:flex; align-items:center; gap:6px;}
  .notice-meta{font-size:11.5px; color:var(--text-secondary); margin-top:3px;}
  .notice-body{font-size:12.5px; color:var(--text-secondary); margin-top:8px; line-height:1.5;}
  .pin-badge{display:flex; align-items:center; gap:4px; font-size:10.5px; font-weight:700; color:var(--gold);}

  /* Templates */
  .tpl-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(230px,1fr)); gap:14px;}
  .tpl-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px 18px; cursor:pointer;}
  .tpl-card:hover{border-color:var(--ink-700);}
  .tpl-title{font-weight:700; font-size:13.5px; margin-bottom:6px; display:flex; align-items:center; gap:6px;}
  .tpl-preview{font-size:12px; color:var(--text-secondary); line-height:1.5;}
  .tpl-tag{display:inline-block; font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); background:var(--mist-100); padding:2px 7px; border-radius:999px; margin-top:8px;}

  /* Emergency */
  .emergency-panel{
    background:linear-gradient(135deg, rgba(193,80,62,0.09), rgba(193,80,62,0.02)); border:1px solid rgba(193,80,62,0.3);
    border-radius:var(--radius-lg); padding:22px; margin-bottom:20px;
  }
  .emergency-title{font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--soft-red); display:flex; align-items:center; gap:8px; margin-bottom:6px;}
  .btn-emergency{background:var(--soft-red); color:#fff;}
  .alert-log-item{display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .alert-log-item:last-child{border-bottom:none;}

  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:560px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.confirmed{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.open{background:rgba(27,147,166,.14); color:var(--turquoise);}
`;

const channels = [
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "push", label: "Push", icon: Bell },
];

const log = [
  { type: "sms", title: "Fee reminder — Term 2 balance", to: "63 guardians · S.2 & S.3", time: "10 min ago", status: "delivered" },
  { type: "whatsapp", title: "Mid-term exam timetable shared", to: "All parents", time: "1 hr ago", status: "delivered" },
  { type: "email", title: "Parent-teacher meeting invite", to: "S.4 Blue guardians", time: "3 hrs ago", status: "delivered" },
  { type: "push", title: "New assignment posted: Chemistry", to: "S.6 Emerald students", time: "5 hrs ago", status: "pending" },
  { type: "sms", title: "Transport delay notice — Route 4", to: "41 guardians", time: "Yesterday", status: "delivered" },
];

const announcements = [
  { title: "Mid-term exams begin 22 July", pinned: true, author: "Academic Office", time: "Today, 9:02 AM", body: "All classes should report to their assigned exam rooms by 7:45 AM. Timetables have been shared with class teachers.", audience: "Whole school" },
  { title: "Inter-house sports day — volunteers needed", pinned: false, author: "Ms. Auma", time: "Yesterday", body: "Looking for staff and senior students to help marshal events on 26 July. Sign up at the staff room notice board.", audience: "Staff & S.5–S.6" },
  { title: "Library closed for stocktaking", pinned: false, author: "Librarian", time: "2 days ago", body: "The library will be closed on 23–24 July for annual stocktaking. Returns can be dropped at the front office.", audience: "Whole school" },
];

const templates = [
  { name: "Fee payment reminder", tag: "Fees", preview: "Dear parent, this is a reminder that Term [X] fee balance of [amount] is due by [date]…" },
  { name: "Absence notification", tag: "Attendance", preview: "Dear parent, [student] was marked absent today, [date]. Please contact the class teacher if this is unexpected…" },
  { name: "Exam timetable release", tag: "Academics", preview: "Dear parent, the [term] exam timetable is now available on the parent portal. Exams begin [date]…" },
  { name: "Transport delay notice", tag: "Transport", preview: "Dear parent, Route [X] is running approximately [Y] minutes behind schedule due to [reason]…" },
  { name: "Positive progress update", tag: "Academics", preview: "Dear parent, [student] has shown great improvement in [subject] this term — well done to them!" },
  { name: "School closure / weather alert", tag: "Emergency", preview: "Dear parent, due to [reason], the school will be closed on [date]. Updates will follow as needed…" },
];

const alertHistory = [
  { title: "Heavy rain — early closure at 1:00 PM", time: "14 May, 12:10 PM", channels: "SMS, WhatsApp, Push" },
  { title: "Road closure near main gate — use side entrance", time: "3 Mar, 7:20 AM", channels: "SMS, Push" },
];

const sampleConferenceSlots = [
  { teacher: "Mr. Okello (Mathematics)", guardian: "Mrs. Nakato — re: Amina", time: "24 Jul, 4:00 PM", mode: "In person", status: "confirmed" },
  { teacher: "Ms. Nabirye (English)", guardian: "Mr. Okwir — re: Brian", time: "24 Jul, 4:20 PM", mode: "Video call", status: "confirmed" },
  { teacher: "Mr. Kato (Science)", guardian: "Open slot", time: "24 Jul, 4:40 PM", mode: "In person", status: "open" },
  { teacher: "Ms. Auma (History)", guardian: "Mrs. Mugabi — re: Isaac", time: "24 Jul, 5:00 PM", mode: "In person", status: "pending" },
];

const subnavItems = [
  { id: "compose", label: "Compose", icon: Send },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "conferences", label: "Parent-Teacher Conferences", icon: CalendarClock },
  { id: "emergency", label: "Emergency Alerts", icon: Siren },
];

export default function MonaLearnCommunication() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("compose");
  const [channel, setChannel] = useState("sms");
  const [message, setMessage] = useState("Dear parent, this is a reminder that Term 2 fee balances are due by 30 July. Kindly clear the outstanding balance to avoid disruption to your child's exams.");
  const [sendResult, setSendResult] = useState("");
  const [sending, setSending] = useState(false);

  // Real conference schedule for today via the endpoint that previously
  // had zero controller route at all (found and fixed during the backend
  // sweep) — shows both open and already-booked slots in one call.
  const [conferenceSlots, setConferenceSlots] = useState(sampleConferenceSlots);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    const from = new Date(); from.setHours(0, 0, 0, 0);
    const to = new Date(); to.setHours(23, 59, 59, 999);
    fetch(`/api/conferences/schedule?from=${from.toISOString()}&to=${to.toISOString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setConferenceSlots(
            data.map((s) => ({
              teacher: s.staff?.fullName ?? "—",
              guardian: s.student ? `Re: ${s.student.fullName}` : "Open slot",
              time: new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              mode: s.mode === "VIDEO_CALL" ? "Video call" : "In person",
              status: s.status,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  // Real fetch against POST /communication/send. studentIds is empty here
  // since this page doesn't have an audience-picker wired to real Student
  // records yet — the backend correctly rejects a zero-recipient send
  // (a bug found and fixed during the sweep), so this will surface that
  // validation honestly rather than pretending to have sent anything.
  async function handleSend() {
    setSendResult("");
    setSending(true);
    try {
      const token = localStorage.getItem("monalearn_token");
      const res = await fetch("/api/communication/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel, body: message, studentIds: [] }),
      });
      const data = await res.json().catch(() => ({}));
      setSendResult(res.ok ? "Sent." : data.message || "Send failed");
    } catch {
      setSendResult("Network error — could not reach the backend");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">All channels</div>
            <h1 className="h1">Communication</h1>
            <p className="sub">Compose, announcements, templates, and emergency alerts across SMS, email, WhatsApp, and push.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Users size={14} /> Audience lists</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "compose" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Sent this week</div><div className="stat-val">1,204</div></div>
              <div className="stat-card green">
                <div className="stat-label">Delivery rate</div>
                <div className="stat-val">98.2%</div>
                <div className="stat-delta"><ArrowUpRight size={12} /> +1.1% vs last week</div>
              </div>
              <div className="stat-card gold"><div className="stat-label">Open rate (email)</div><div className="stat-val">64%</div></div>
              <div className="stat-card purple"><div className="stat-label">AI-drafted messages</div><div className="stat-val">18</div></div>
            </div>

            <div className="layout">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">New message</div>
                  <div className="panel-tag">Compose</div>
                </div>

                <div className="channel-row">
                  {channels.map((c) => (
                    <button key={c.id} className={`channel-btn ${channel === c.id ? "active" : ""}`} onClick={() => setChannel(c.id)}>
                      <c.icon size={16} />
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="field">
                  <label>Audience</label>
                  <div className="field-input">
                    <select>
                      <option>Guardians — fees overdue (63)</option>
                      <option>All parents</option>
                      <option>S.4 Blue guardians</option>
                      <option>All teaching staff</option>
                      <option>Custom list…</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Message</label>
                  <textarea className="compose" value={message} onChange={(e) => setMessage(e.target.value)} />
                  <div className="char-count">{message.length} characters</div>
                  <div className="ai-suggest-btn"><Sparkles size={13} /> Rewrite with AI</div>
                </div>

                <button className="ml-btn ml-btn-primary" style={{ width: "100%" }} onClick={handleSend} disabled={sending}>
                  <Send size={14} /> {sending ? "Sending…" : "Send to 63 guardians"}
                </button>
                {sendResult && (
                  <div style={{ fontSize: 12, marginTop: 8, color: sendResult === "Sent." ? "var(--emerald)" : "var(--soft-red)" }}>
                    {sendResult}
                  </div>
                )}
              </div>

              <div>
                <div className="panel">
                  <div className="panel-head">
                    <div className="panel-title">Recent activity</div>
                    <div className="panel-tag">Live</div>
                  </div>
                  {log.map((m, i) => (
                    <div className="msg-item" key={i}>
                      <div className={`msg-icon ${m.type}`}>
                        {m.type === "sms" && <Smartphone size={15} />}
                        {m.type === "email" && <Mail size={15} />}
                        {m.type === "whatsapp" && <MessageSquare size={15} />}
                        {m.type === "push" && <Bell size={15} />}
                      </div>
                      <div>
                        <div className="msg-title">{m.title}</div>
                        <div className="msg-meta">{m.to} · {m.time}</div>
                      </div>
                      <div className={`msg-status ${m.status}`}>
                        {m.status === "delivered" ? <CheckCheck size={13} /> : <Clock size={13} />}
                        {m.status === "delivered" ? "Delivered" : "Sending"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ai-panel">
                  <div className="panel-head"><div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insights</div></div>
                  <div className="ai-item">
                    <div className="ai-icon2"><Sparkles size={12} /></div>
                    <div>WhatsApp messages get opened 3x faster than SMS for this school's parents.</div>
                  </div>
                  <div className="ai-item">
                    <div className="ai-icon2"><Sparkles size={12} /></div>
                    <div>9 guardians haven't opened any message in 30 days — consider a phone call instead.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {tabView === "announcements" && (
          <>
            <div className="toolbar" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button className="ml-btn ml-btn-primary"><Plus size={14} /> New announcement</button>
            </div>
            {announcements.map((a, i) => (
              <div className="notice-card" key={i}>
                <div className="notice-head">
                  <div>
                    <div className="notice-title">
                      {a.pinned && <span className="pin-badge"><Pin size={11} /></span>}
                      {a.title}
                    </div>
                    <div className="notice-meta">{a.author} · {a.time} · {a.audience}</div>
                  </div>
                </div>
                <div className="notice-body">{a.body}</div>
              </div>
            ))}
          </>
        )}

        {tabView === "templates" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><FileText size={15} /> Message templates</div>
              <p className="panel-note">Reusable, pre-approved wording for common scenarios — pick one and it drops straight into Compose with fields ready to fill in.</p>
            </div>
            <div className="tpl-grid">
              {templates.map((t) => (
                <div className="tpl-card" key={t.name}>
                  <div className="tpl-title"><Paperclip size={13} /> {t.name}</div>
                  <div className="tpl-preview">{t.preview}</div>
                  <span className="tpl-tag">{t.tag}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "conferences" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ marginBottom: 6 }}><CalendarClock size={15} /> Parent-Teacher Conference Day — 24 July</div>
              <p className="panel-note">Guardians book directly into open slots from the Parent Portal; teachers can offer either in-person or video call meetings.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Teacher</th><th>Guardian / topic</th><th>Time</th><th>Mode</th><th>Status</th></tr></thead>
                <tbody>
                  {conferenceSlots.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{c.teacher}</td>
                      <td>{c.guardian}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{c.time}</td>
                      <td>{c.mode === "Video call" ? <Video size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> : null}{c.mode}</td>
                      <td><span className={`pill ${c.status}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "emergency" && (
          <>
            <div className="emergency-panel">
              <div className="emergency-title"><Siren size={18} /> Emergency broadcast</div>
              <p className="panel-note" style={{ marginBottom: 14 }}>
                Sends immediately across every channel — SMS, WhatsApp, push, and email — bypassing normal quiet hours and audience filters. Use only for closures, safety incidents, or urgent school-wide notices.
              </p>
              <textarea className="compose" placeholder="e.g. Due to heavy flooding on the main road, school will close early today at 1:00 PM. Please arrange pickup." style={{ marginBottom: 12 }} />
              <button className="ml-btn btn-emergency"><Siren size={14} /> Send emergency alert to entire school</button>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Alert history</div>
                <div className="panel-tag">Last 12 months</div>
              </div>
              {alertHistory.map((a, i) => (
                <div className="alert-log-item" key={i}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{a.time}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{a.channels}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
