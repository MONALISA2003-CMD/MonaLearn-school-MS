"use client";

import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Palette, ShieldCheck, Plug, CalendarRange, History,
  Check, X as XIcon, Globe, Lock, FileCheck, AlertTriangle
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
  .ml-icon-btn{width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary); flex-shrink:0;}
  .ml-btn{font-family:var(--font-body); font-weight:600; font-size:13px; border-radius:var(--radius-sm); padding:9px 15px; cursor:pointer; border:1px solid transparent; display:flex; align-items:center; gap:6px;}
  .ml-btn-primary{background:var(--ink-700); color:#fff;}
  .subnav{display:flex; gap:6px; margin:22px 0 22px; border-bottom:1px solid var(--border); overflow-x:auto; padding-bottom:1px;}
  .subnav-item{display:flex; align-items:center; gap:7px; padding:10px 14px; font-size:13px; font-weight:600; color:var(--text-secondary); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0;}
  .subnav-item.active{color:var(--ink-700); border-bottom-color:var(--ink-700);}
  [data-theme="dark"] .subnav-item.active{color:var(--emerald-400); border-bottom-color:var(--emerald-400);}
  .panel{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px 22px; margin-bottom:16px;}
  .panel-title{font-family:var(--font-display); font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom:6px;}
  .panel-note{font-size:12.5px; color:var(--text-secondary); margin:0 0 16px;}
  .field{margin-bottom:16px; max-width:420px;}
  .field label{display:block; font-size:12px; font-weight:600; margin-bottom:6px; color:var(--text-secondary);}
  .field-input{display:flex; align-items:center; gap:8px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg); padding:0 12px;}
  .field-input input, .field-input select{border:none; outline:none; background:transparent; padding:10px 0; font-family:var(--font-body); font-size:14px; width:100%; color:var(--text-primary);}
  .swatch-row{display:flex; gap:10px; margin-bottom:16px;}
  .swatch{width:38px; height:38px; border-radius:10px; border:2px solid var(--border); cursor:pointer;}
  .swatch.selected{border-color:var(--ink-700);}
  .table-wrap{border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--surface); overflow-x:auto;}
  table{width:100%; border-collapse:collapse; font-size:13px; min-width:600px;}
  thead th{text-align:left; font-family:var(--font-mono); font-size:10.5px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.05em; padding:13px 16px; border-bottom:1px solid var(--border); background:var(--mist-100); white-space:nowrap;}
  tbody td{padding:12px 16px; border-bottom:1px solid var(--border);}
  tbody tr:last-child td{border-bottom:none;}
  .name{font-weight:600;}
  .mono{font-family:var(--font-mono); font-size:12px;}
  .pill{font-family:var(--font-mono); font-size:10.5px; padding:3px 9px; border-radius:999px; font-weight:600; display:inline-flex; align-items:center; gap:4px;}
  .pill.connected, .pill.enabled, .pill.published, .pill.signed, .pill.fulfilled{background:rgba(14,124,90,.12); color:var(--emerald-600);}
  .pill.pending{background:rgba(217,122,52,.14); color:var(--orange);}
  .pill.disconnected, .pill.disabled{background:rgba(193,80,62,.12); color:var(--soft-red);}
  .privacy-row{display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:13px;}
  .privacy-row:last-child{border-bottom:none;}
  .perm-grid{display:grid; grid-template-columns:1fr repeat(4, 70px); gap:8px; align-items:center; font-size:12.5px; padding:10px 0; border-bottom:1px solid var(--border);}
  .perm-grid.header{font-family:var(--font-mono); font-size:10px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.04em;}
  .perm-check{display:flex; justify-content:center;}
  .integration-card{display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--border);}
  .integration-card:last-child{border-bottom:none;}
  .integration-icon{width:36px; height:36px; border-radius:10px; background:var(--ink-700); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
  .audit-row{display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border); font-size:12.5px;}
  .audit-row:last-child{border-bottom:none;}
`;

const brandColors = ["#12294B", "#0E7C5A", "#6B4FA0", "#C9962C", "#1B93A6", "#C1503E"];

const sampleRoles = [
  { name: "Students", view: true, edit: false, delete: false, admin: false },
  { name: "Fees & finance", view: true, edit: true, delete: false, admin: false },
  { name: "Academics", view: true, edit: true, delete: false, admin: false },
  { name: "HR & Payroll", view: false, edit: false, delete: false, admin: false },
  { name: "Settings", view: false, edit: false, delete: false, admin: false },
];

const integrations = [
  { name: "MTN Mobile Money", type: "Payment gateway", status: "connected" },
  { name: "Flutterwave", type: "Payment gateway", status: "connected" },
  { name: "WhatsApp Business API", type: "Communication", status: "connected" },
  { name: "Google Workspace", type: "SSO & email", status: "pending" },
  { name: "QuickBooks", type: "Accounting sync", status: "disconnected" },
];

const sampleAuditLog = [
  { actor: "Grace Namusoke (Bursar)", action: "Recorded payment — UGX 620,000 for ADM-2026-0141", time: "Today, 10:42 AM" },
  { actor: "Mr. Okello", action: "Updated Term 2 gradebook — S.4 Blue Mathematics", time: "Today, 9:15 AM" },
  { actor: "System", action: "Automated fee reminder sent to 63 guardians", time: "Today, 8:00 AM" },
  { actor: "Kabuusu Mohammed (Admin)", action: "Changed school color scheme", time: "Yesterday, 4:20 PM" },
];

const consentRecords = [
  { item: "Annual FERPA-equivalent notice to guardians", status: "published", date: "3 Feb 2026" },
  { item: "Photo/media consent — Class of 2027", status: "published", date: "3 Feb 2026" },
  { item: "Third-party vendor data agreement — WhatsApp Business API", status: "signed", date: "12 Jan 2026" },
  { item: "Third-party vendor data agreement — Flutterwave", status: "signed", date: "8 Jan 2026" },
  { item: "Data processing agreement — new SMS gateway (under review)", status: "pending", date: "—" },
];

const dataRequests = [
  { guardian: "Mrs. Nakato", request: "Access to Amina's full education record", status: "fulfilled" },
  { guardian: "Mr. Ssenyonga", request: "Correction request — guardian phone number", status: "fulfilled" },
  { guardian: "Ms. Auma (staff)", request: "Access to own personnel file", status: "pending" },
];

const subnavItems = [
  { id: "branding", label: "Branding", icon: Palette },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "academic", label: "Academic Configuration", icon: CalendarRange },
  { id: "privacy", label: "Data Privacy & Compliance", icon: Lock },
  { id: "audit", label: "Audit Logs", icon: History },
];

export default function MonaLearnSettings() {
  const [theme, setTheme] = useState("light");
  const [tabView, setTabView] = useState("branding");
  const [color, setColor] = useState(brandColors[0]);
  const [auditLog, setAuditLog] = useState(sampleAuditLog);
  const [roles, setRoles] = useState(sampleRoles);
  const [role, setRole] = useState("Class Teacher");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("monalearn_token") : null;
    if (!token) return;
    // getAuditLog is the read side of the audit trail the sweep added —
    // this page's "audit" tab has shown hardcoded rows since it was
    // first built, so this is what makes it real for the first time.
    fetch("/api/settings/audit-log", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.length) {
          setAuditLog(data.map((a) => ({
            actor: a.user?.fullName ?? "System",
            action: a.action,
            time: new Date(a.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("monalearn_token");
    if (!token) return;
    fetch(`/api/settings/permissions/${encodeURIComponent(role)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // Real matrix only has rows for modules an admin has actually
        // set — sparse by default. Falls back to sample rows so the
        // grid isn't blank until permissions are configured.
        if (data?.length) {
          setRoles(data.map((p) => ({ name: p.module, view: p.canView, edit: p.canEdit, delete: p.canDelete, admin: p.canAdmin })));
        }
      })
      .catch(() => {});
  }, [role]);

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Super Admin</div>
            <h1 className="h1">Settings</h1>
            <p className="sub">Tenant branding, roles & permissions, integrations, academic configuration, and system-wide audit logs.</p>
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

        {tabView === "branding" && (
          <div className="panel">
            <div className="panel-title"><Palette size={15} /> School branding</div>
            <p className="panel-note">Each school on MonaLearn has its own logo, domain, and color scheme — applied across the dashboard, portals, and generated documents.</p>

            <div className="field"><label>School name</label><div className="field-input"><input defaultValue="Kitante Hill School" /></div></div>
            <div className="field"><label>Custom domain</label><div className="field-input"><Globe size={14} /><input defaultValue="kitantehill.monalearn.app" /></div></div>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Primary color</label>
            <div className="swatch-row">
              {brandColors.map((c) => (
                <div key={c} className={`swatch ${color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
            <button className="ml-btn ml-btn-primary">Save branding</button>
          </div>
        )}

        {tabView === "roles" && (
          <div className="panel">
            <div className="panel-title">
              <ShieldCheck size={15} /> Role:{" "}
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ font: "inherit", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 6px" }}>
                <option>Class Teacher</option>
                <option>Bursar</option>
                <option>Admin</option>
                <option>Librarian</option>
              </select>
            </div>
            <p className="panel-note">Permission matrix — what this role can view, edit, delete, or administer per module.</p>
            <div className="perm-grid header">
              <div>Module</div><div style={{ textAlign: "center" }}>View</div><div style={{ textAlign: "center" }}>Edit</div><div style={{ textAlign: "center" }}>Delete</div><div style={{ textAlign: "center" }}>Admin</div>
            </div>
            {roles.map((r) => (
              <div className="perm-grid" key={r.name}>
                <div className="name">{r.name}</div>
                <div className="perm-check">{r.view ? <Check size={14} color="var(--emerald-600)" /> : <XIcon size={14} color="var(--mist-500)" />}</div>
                <div className="perm-check">{r.edit ? <Check size={14} color="var(--emerald-600)" /> : <XIcon size={14} color="var(--mist-500)" />}</div>
                <div className="perm-check">{r.delete ? <Check size={14} color="var(--emerald-600)" /> : <XIcon size={14} color="var(--mist-500)" />}</div>
                <div className="perm-check">{r.admin ? <Check size={14} color="var(--emerald-600)" /> : <XIcon size={14} color="var(--mist-500)" />}</div>
              </div>
            ))}
          </div>
        )}

        {tabView === "integrations" && (
          <div className="table-wrap">
            {integrations.map((i) => (
              <div className="integration-card" key={i.name}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="integration-icon"><Plug size={16} /></div>
                  <div>
                    <div className="name">{i.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{i.type}</div>
                  </div>
                </div>
                <span className={`pill ${i.status}`}>{i.status}</span>
              </div>
            ))}
          </div>
        )}

        {tabView === "academic" && (
          <div className="panel">
            <div className="panel-title"><CalendarRange size={15} /> Academic year configuration</div>
            <p className="panel-note">Defines term dates, grading scale, and promotion rules used across Academics, Attendance, and Fees.</p>
            <div className="field"><label>Current academic year</label><div className="field-input"><select><option>2026</option><option>2025</option></select></div></div>
            <div className="field"><label>Grading system</label><div className="field-input"><select><option>Percentage + letter grade (A–F)</option><option>Competency-based (4 levels)</option></select></div></div>
            <div className="field"><label>Term structure</label><div className="field-input"><select><option>3 terms per year</option><option>2 semesters per year</option></select></div></div>
            <button className="ml-btn ml-btn-primary">Save configuration</button>
          </div>
        )}

        {tabView === "privacy" && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title"><Lock size={15} /> Data privacy & compliance</div>
              <p className="panel-note">Consent notices, vendor data processing agreements, and guardian access/correction requests — the paper trail schools need for FERPA/GDPR-style data protection obligations.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <span className="pill enabled"><Check size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Encryption in transit & at rest</span>
                <span className="pill enabled"><Check size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Role-based access control</span>
                <span className="pill pending"><AlertTriangle size={11} style={{ marginRight: 3, verticalAlign: -1 }} />1 vendor agreement pending review</span>
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-title" style={{ fontSize: 13.5 }}><FileCheck size={14} /> Consent & vendor agreements</div>
              {consentRecords.map((c, i) => (
                <div className="privacy-row" key={i}>
                  <span>{c.item}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--text-secondary)" }}>{c.date}</span>
                    <span className={`pill ${c.status}`}>{c.status}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title" style={{ fontSize: 13.5 }}>Access & correction requests</div>
              {dataRequests.map((r, i) => (
                <div className="privacy-row" key={i}>
                  <span><strong>{r.guardian}</strong> — {r.request}</span>
                  <span className={`pill ${r.status}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tabView === "audit" && (
          <div className="table-wrap" style={{ padding: "4px 20px" }}>
            {auditLog.map((a, i) => (
              <div className="audit-row" key={i}>
                <div><strong>{a.actor}</strong> — {a.action}</div>
                <div className="mono" style={{ color: "var(--text-secondary)", flexShrink: 0, marginLeft: 12 }}>{a.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
