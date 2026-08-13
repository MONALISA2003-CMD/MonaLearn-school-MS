"use client";

import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Users, GraduationCap, UserCheck, Heart, Wallet, CalendarCheck,
  BookOpen, MessageSquare, ClipboardList, Bell, Award, Briefcase, Gift, Video
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

  .ml-icon-btn{
    width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center;
    background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary); flex-shrink:0;
  }
  .ml-btn{
    font-family:var(--font-body); font-weight:600; font-size:13px; border-radius:var(--radius-sm); padding:9px 15px;
    cursor:pointer; border:1px solid transparent; display:flex; align-items:center; gap:6px;
  }
  .ml-btn-primary{background:var(--ink-700); color:#fff;}

  .subnav{display:flex; gap:6px; margin:22px 0 22px; border-bottom:1px solid var(--border); overflow-x:auto; padding-bottom:1px;}
  .subnav-item{
    display:flex; align-items:center; gap:7px; padding:10px 14px; font-size:13px; font-weight:600; color:var(--text-secondary);
    cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;
  }
  .subnav-item.active{color:var(--ink-700); border-bottom-color:var(--ink-700);}
  [data-theme="dark"] .subnav-item.active{color:var(--emerald-400); border-bottom-color:var(--emerald-400);}

  .preview-frame{
    border:1px solid var(--border); border-radius:var(--radius-lg); background:var(--surface); padding:22px; margin-bottom:16px;
  }
  .preview-tag{
    display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase;
    letter-spacing:.06em; background:var(--mist-100); color:var(--text-secondary); padding:4px 10px; border-radius:999px; margin-bottom:14px;
  }

  .greet{font-family:var(--font-display); font-size:19px; font-weight:700; margin-bottom:4px;}
  .greet-sub{font-size:12.5px; color:var(--text-secondary); margin-bottom:18px;}

  .card-row{display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:16px;}
  @media (max-width:700px){ .card-row{grid-template-columns:repeat(2,1fr);} }
  .mini-card{background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; position:relative; overflow:hidden;}
  .mini-card::before{content:""; position:absolute; left:0; top:0; bottom:0; width:3px;}
  .mini-card.blue::before{background:var(--ink-700);} .mini-card.green::before{background:var(--emerald-600);}
  .mini-card.gold::before{background:var(--gold);} .mini-card.purple::before{background:var(--amethyst);}
  .mini-label{font-size:11px; color:var(--text-secondary); font-weight:600; display:flex; align-items:center; gap:5px;}
  .mini-val{font-family:var(--font-mono); font-size:17px; font-weight:600; margin-top:5px;}

  .list-row{display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .list-row:last-child{border-bottom:none;}
  .list-icon{width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;}

  .quick-actions{display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;}
  .quick-btn{
    display:flex; align-items:center; gap:6px; border:1px solid var(--border); background:var(--bg); border-radius:999px;
    padding:8px 14px; font-size:12.5px; font-weight:600; cursor:pointer; color:var(--text-primary);
  }
  .quick-btn:hover{border-color:var(--ink-700);}

  .avatar{width:40px; height:40px; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--font-display); font-weight:700; font-size:14px; flex-shrink:0;}
`;

const subnavItems = [
  { id: "parent", label: "Parent Portal", icon: Heart },
  { id: "teacher", label: "Teacher Portal", icon: GraduationCap },
  { id: "student", label: "Student Portal", icon: BookOpen },
  { id: "alumni", label: "Alumni Portal", icon: Briefcase },
];

export default function MonaLearnPortals() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("parent");

  // Parent Portal is the one tab with a real, working backend endpoint
  // (getParentSnapshot — the one that had the cross-school IDOR fix
  // during the sweep). Teacher/Student/Alumni portals stay on sample
  // data: their backend methods are genuine unimplemented stubs
  // (e.g. getTeacherSnapshot just returns a placeholder message), so
  // wiring them would fake data rather than show anything real.
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    fetch("/api/students?pageSize=20", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const list = data?.data ?? data;
        if (list?.length) {
          setStudents(list);
          setSelectedStudent(list[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    fetch(`/api/portals/parent/${selectedStudent}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setSnapshot)
      .catch(() => setSnapshot(null));
  }, [selectedStudent]);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">

        <div className="page-head">
          <div>
            <div className="eyebrow">Role-based access</div>
            <h1 className="h1">Portals</h1>
            <p className="sub">A tailored home screen for parents, teachers, students, and alumni — each seeing only what's relevant to them.</p>
          </div>
          <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "parent" && (
          <div className="preview-frame">
            <div className="preview-tag"><Heart size={11} /> Parent Portal preview</div>
            {students.length > 0 && (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                style={{ marginBottom: 10, font: "inherit", border: "1px solid var(--ink-100)", borderRadius: 6, padding: "4px 8px" }}
              >
                {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            )}
            <div className="greet">Welcome back, Mrs. Nakato</div>
            <div className="greet-sub">
              {snapshot ? `Viewing ${snapshot.fullName} · ${snapshot.class}` : "Viewing Amina Nakato · S.4 Blue"}
            </div>

            <div className="card-row">
              <div className="mini-card blue"><div className="mini-label"><CalendarCheck size={12} /> Attendance</div><div className="mini-val">{snapshot?.attendancePct != null ? `${snapshot.attendancePct}%` : "96%"}</div></div>
              <div className="mini-card gold"><div className="mini-label"><Wallet size={12} /> Fee balance</div><div className="mini-val">{snapshot ? `UGX ${snapshot.feeBalance.toLocaleString()}` : "UGX 140,000"}</div></div>
              <div className="mini-card green"><div className="mini-label"><GraduationCap size={12} /> Avg. grade</div><div className="mini-val">{snapshot?.avgGrade != null ? snapshot.avgGrade.toFixed(1) : "B+"}</div></div>
            </div>

            <div className="list-row"><div className="list-icon" style={{ background: "var(--turquoise)" }}><Bell size={14} /></div><div>Mid-term exams begin 22 July — timetable shared</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--orange)" }}><Wallet size={14} /></div><div>Term 2 balance due by 30 July</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--emerald-600)" }}><MessageSquare size={14} /></div><div>New message from Ms. Nabirye (English)</div></div>

            <div className="quick-actions">
              <div className="quick-btn"><Wallet size={13} /> Pay fees</div>
              <div className="quick-btn"><MessageSquare size={13} /> Message teacher</div>
              <div className="quick-btn"><CalendarCheck size={13} /> View timetable</div>
            </div>
          </div>
        )}

        {tabView === "teacher" && (
          <div className="preview-frame">
            <div className="preview-tag"><GraduationCap size={11} /> Teacher Portal preview</div>
            <div className="greet">Good morning, Mr. Okello</div>
            <div className="greet-sub">Mathematics · S.4 Blue, S.2 Gold, S.1 Ruby</div>

            <div className="card-row">
              <div className="mini-card blue"><div className="mini-label">Classes today</div><div className="mini-val">4</div></div>
              <div className="mini-card green"><div className="mini-label">Assignments to grade</div><div className="mini-val">18</div></div>
              <div className="mini-card gold"><div className="mini-label">Syllabus coverage</div><div className="mini-val">78%</div></div>
            </div>

            <div className="list-row"><div className="list-icon" style={{ background: "var(--ink-700)" }}><ClipboardList size={14} /></div><div>Algebra worksheet 4 — 34 of 38 submitted</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--soft-red)" }}><CalendarCheck size={14} /></div><div>S.4 Blue attendance not yet taken for today</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--amethyst)" }}><Video size={14} /></div><div>Next lesson plan due for approval — Quadratic Equations Part 2</div></div>

            <div className="quick-actions">
              <div className="quick-btn"><CalendarCheck size={13} /> Take attendance</div>
              <div className="quick-btn"><ClipboardList size={13} /> Grade assignments</div>
              <div className="quick-btn"><BookOpen size={13} /> Open gradebook</div>
            </div>
          </div>
        )}

        {tabView === "student" && (
          <div className="preview-frame">
            <div className="preview-tag"><BookOpen size={11} /> Student Portal preview</div>
            <div className="greet">Hey Amina 👋</div>
            <div className="greet-sub">S.4 Blue · Term 2, Week 6</div>

            <div className="card-row">
              <div className="mini-card blue"><div className="mini-label">Assignments due</div><div className="mini-val">2</div></div>
              <div className="mini-card green"><div className="mini-label">Avg. grade</div><div className="mini-val">87.7%</div></div>
              <div className="mini-card gold"><div className="mini-label">Attendance</div><div className="mini-val">96%</div></div>
            </div>

            <div className="list-row"><div className="list-icon" style={{ background: "var(--ink-700)" }}><ClipboardList size={14} /></div><div>Algebra worksheet 4 due tomorrow</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--turquoise)" }}><Video size={14} /></div><div>Physics live class starts in 20 minutes</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--gold)" }}><Award size={14} /></div><div>New badge earned: "Consistent Attendance — Term 2"</div></div>

            <div className="quick-actions">
              <div className="quick-btn"><ClipboardList size={13} /> Submit assignment</div>
              <div className="quick-btn"><Video size={13} /> Join live class</div>
              <div className="quick-btn"><BookOpen size={13} /> My courses</div>
            </div>
          </div>
        )}

        {tabView === "alumni" && (
          <div className="preview-frame">
            <div className="preview-tag"><Briefcase size={11} /> Alumni Portal preview</div>
            <div className="greet">Welcome back, Faith Namutebi</div>
            <div className="greet-sub">Class of 2024 · S.6 Emerald</div>

            <div className="card-row">
              <div className="mini-card blue"><div className="mini-label">Alumni network</div><div className="mini-val">1,340</div></div>
              <div className="mini-card green"><div className="mini-label">Upcoming events</div><div className="mini-val">2</div></div>
              <div className="mini-card gold"><div className="mini-label">Giving this year</div><div className="mini-val">UGX 2.1M</div></div>
            </div>

            <div className="list-row"><div className="list-icon" style={{ background: "var(--ink-700)" }}><Users size={14} /></div><div>Alumni Homecoming — 14 December, Main Hall</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--emerald-600)" }}><Briefcase size={14} /></div><div>3 new mentorship requests from current S.6 students</div></div>
            <div className="list-row"><div className="list-icon" style={{ background: "var(--gold)" }}><Gift size={14} /></div><div>Scholarship Fund — 62% of this year's goal reached</div></div>

            <div className="quick-actions">
              <div className="quick-btn"><Users size={13} /> Find classmates</div>
              <div className="quick-btn"><Gift size={13} /> Donate</div>
              <div className="quick-btn"><Briefcase size={13} /> Offer mentorship</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
