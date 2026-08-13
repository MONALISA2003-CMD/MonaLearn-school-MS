"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronDown, Sun, Moon, Sparkles, Download, Stethoscope,
  BedDouble, Pill, Syringe
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
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.discharged, .pill.in-stock, .pill.complete{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.occupied, .pill.low-stock, .pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.referred, .pill.out-of-stock{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .pill.vacant{background:rgba(27,147,166,.14); color:var(--turquoise);}
  .bed-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:14px;}
  .bed-card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px; text-align:center;}
  .bed-icon{width:36px; height:36px; border-radius:10px; background:var(--ink-700); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0;}
`;

const sampleVisits = [
  { student: "Faith Namutebi", cls: "S.6 Emerald", complaint: "Fever & headache", time: "9:20 AM", outcome: "Rested, given paracetamol", status: "discharged" },
  { student: "Brian Okwir", cls: "S.2 Gold", complaint: "Asthma flare-up during PE", time: "11:05 AM", outcome: "Inhaler administered, monitored", status: "occupied" },
  { student: "Isaac Mugabi", cls: "S.3 Green", complaint: "Sprained ankle — football", time: "1:40 PM", outcome: "Referred to clinic for X-ray", status: "referred" },
];

const beds = [
  { bed: "Sick Bay — Bed 1", status: "occupied", patient: "Brian Okwir" },
  { bed: "Sick Bay — Bed 2", status: "vacant", patient: "—" },
  { bed: "Sick Bay — Bed 3", status: "vacant", patient: "—" },
  { bed: "Isolation Room", status: "vacant", patient: "—" },
];

const dispensary = [
  { medicine: "Paracetamol 500mg", stock: 320, unit: "tablets", status: "in-stock" },
  { medicine: "Oral Rehydration Salts", stock: 18, unit: "sachets", status: "low-stock" },
  { medicine: "Antihistamine syrup", stock: 0, unit: "bottles", status: "out-of-stock" },
  { medicine: "Antiseptic wound spray", stock: 14, unit: "bottles", status: "in-stock" },
];

const immunizations = [
  { student: "Amina Nakato", cls: "S.4 Blue", vaccine: "Tetanus booster", date: "Due Sep 2026", status: "pending" },
  { student: "Derrick Ssenyonga", cls: "S.1 Ruby", vaccine: "HPV (dose 2)", date: "Completed 14 Jun", status: "complete" },
  { student: "Grace Achieng", cls: "S.4 Blue", vaccine: "Tetanus booster", date: "Completed 2 May", status: "complete" },
];

const subnavItems = [
  { id: "visits", label: "Clinic Visits", icon: Stethoscope },
  { id: "beds", label: "Sick Bay Beds", icon: BedDouble },
  { id: "dispensary", label: "Medicine Dispensary", icon: Pill },
  { id: "immunizations", label: "Immunizations", icon: Syringe },
];

export default function MonaLearnMedical() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("visits");
  const [query, setQuery] = useState("");
  const [visits, setVisits] = useState(sampleVisits);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // getOccupiedBeds only returns status="occupied" visits, so
    // discharged/referred sample rows correctly vanish once live data
    // loads — same "only the active subset" pattern as Hostel's open
    // incidents and Visitors' on-campus list.
    fetch("/api/medical/beds/occupied", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setVisits(data.map((v) => ({
          student: v.student?.fullName ?? "—",
          cls: v.student?.class?.name ?? "—",
          complaint: v.complaint,
          time: new Date(v.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          outcome: v.outcome ?? "—",
          status: v.status,
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = visits.filter((v) => v.student.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">School clinic</div>
            <h1 className="h1">Medical Center</h1>
            <p className="sub">Clinic visits, sick bay bed status, medicine dispensary, and immunization records.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ml-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button className="ml-btn ml-btn-outline"><Download size={14} /> Export</button>
            <button className="ml-btn ml-btn-primary"><Plus size={14} /> Log visit</button>
          </div>
        </div>

        <div className="subnav">
          {subnavItems.map((t) => (
            <div key={t.id} className={`subnav-item ${tabView === t.id ? "active" : ""}`} onClick={() => setTabView(t.id)}>
              <t.icon size={14} /> {t.label}
            </div>
          ))}
        </div>

        {tabView === "visits" && (
          <>
            <div className="stat-grid">
              <div className="stat-card blue"><div className="stat-label">Visits today</div><div className="stat-val">3</div></div>
              <div className="stat-card green"><div className="stat-label">Discharged</div><div className="stat-val">1</div></div>
              <div className="stat-card gold"><div className="stat-label">Currently in sick bay</div><div className="stat-val">1</div></div>
              <div className="stat-card red"><div className="stat-label">Referred out</div><div className="stat-val">1</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Class</th><th>Complaint</th><th>Time</th><th>Outcome</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={i}>
                      <td className="name">{v.student}</td>
                      <td>{v.cls}</td>
                      <td>{v.complaint}</td>
                      <td className="mono">{v.time}</td>
                      <td>{v.outcome}</td>
                      <td><span className={`pill ${v.status}`}>{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "beds" && (
          <div className="bed-grid">
            {beds.map((b) => (
              <div className="bed-card" key={b.bed}>
                <div className="bed-icon"><BedDouble size={17} /></div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{b.bed}</div>
                <span className={`pill ${b.status}`}>{b.status}</span>
                {b.patient !== "—" && <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 8 }}>{b.patient}</div>}
              </div>
            ))}
          </div>
        )}

        {tabView === "dispensary" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Sparkles size={15} color="#6B4FA0" /> AI insight</div>
              <p className="panel-note">Antihistamine syrup is out of stock and ORS is running low — both commonly needed during the current flu season. Recommend reordering this week.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Medicine</th><th>Stock</th><th>Status</th></tr></thead>
                <tbody>
                  {dispensary.map((d, i) => (
                    <tr key={i}>
                      <td className="name">{d.medicine}</td>
                      <td className="mono">{d.stock} {d.unit}</td>
                      <td><span className={`pill ${d.status}`}>{d.status.replace("-", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tabView === "immunizations" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Class</th><th>Vaccine</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {immunizations.map((im, i) => (
                  <tr key={i}>
                    <td className="name">{im.student}</td>
                    <td>{im.cls}</td>
                    <td>{im.vaccine}</td>
                    <td className="mono">{im.date}</td>
                    <td><span className={`pill ${im.status}`}>{im.status}</span></td>
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
