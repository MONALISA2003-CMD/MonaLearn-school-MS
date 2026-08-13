"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { School, Mail, Lock, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";

const tokens = `
  .setup-root{
    --ink-900:#0B1B33; --ink-700:#12294B; --ink-500:#2C4A75;
    --emerald-700:#0B5E45; --emerald-600:#0E7C5A; --emerald-400:#3FAE85; --emerald-100:#DFF3EA;
    --paper-0:#FFFFFF; --mist-50:#F6F8FB; --mist-300:#DDE3EC; --mist-500:#8A94A6; --mist-700:#4B5568;
    --soft-red:#C1503E;
    --radius-md:12px; --radius-lg:20px;
    --shadow-lg: 0 24px 48px rgba(11,27,51,0.16), 0 4px 10px rgba(11,27,51,0.06);
    --font-display:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif;
    background:var(--mist-50); color:var(--ink-900); font-family:var(--font-body);
    min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .setup-root *{box-sizing:border-box;}
  .setup-card{
    width:100%; max-width:440px; background:var(--paper-0); border-radius:var(--radius-lg);
    box-shadow:var(--shadow-lg); padding:36px 32px; border:1px solid var(--mist-300);
  }
  .setup-mark{
    width:44px; height:44px; border-radius:var(--radius-md);
    background:linear-gradient(135deg,var(--ink-700),var(--emerald-600));
    display:flex; align-items:center; justify-content:center; color:#fff; margin-bottom:20px;
  }
  .setup-title{font-family:var(--font-display); font-size:24px; font-weight:700; margin:0 0 6px;}
  .setup-sub{color:var(--mist-700); font-size:14px; margin:0 0 28px; line-height:1.5;}
  .setup-field{margin-bottom:16px;}
  .setup-label{display:block; font-size:13px; font-weight:600; color:var(--ink-700); margin-bottom:6px;}
  .setup-input-wrap{
    display:flex; align-items:center; gap:8px; border:1px solid var(--mist-300);
    border-radius:var(--radius-md); padding:10px 14px; background:var(--mist-50);
  }
  .setup-input-wrap input{
    border:none; background:transparent; outline:none; font-size:14px; width:100%; color:var(--ink-900);
  }
  .setup-btn{
    width:100%; padding:13px; border:none; border-radius:var(--radius-md);
    background:var(--ink-700); color:#fff; font-size:15px; font-weight:600; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px;
  }
  .setup-btn:disabled{opacity:0.6; cursor:not-allowed;}
  .setup-error{color:var(--soft-red); font-size:13px; margin:0 0 16px;}
  .setup-done{text-align:center; padding:12px 0;}
`;

export default function MonaLearnSetup() {
  const [schoolName, setSchoolName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const router = useRouter();

  // This exists because the system has no self-registration by design —
  // accounts are meant to be provisioned by an admin. A freshly deployed
  // database has zero User rows, so without this page there would be no
  // way to ever log in at all. The backend refuses to run this a second
  // time the moment any User exists (see AuthService.bootstrapAdmin) —
  // that's what happens if you land here after an admin already exists.
  async function handleSetup() {
    setError("");
    setLoading(true);
    try {
      const derivedDomain = domain.trim() || schoolName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".monalearn.app";
      const res = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, domain: derivedDomain, email, password }),
      });
      if (res.status === 409) {
        setAlreadyDone(true);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body.missing?.length
          ? `Missing environment variable(s): ${body.missing.join(", ")}. ${body.fix ?? ""}`
          : body.message || body.error;
        throw new Error(detail || "Setup failed — please try again");
      }
      const data = await res.json();
      localStorage.setItem("monalearn_token", data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Setup failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  if (alreadyDone) {
    return (
      <div className="setup-root">
        <style>{tokens}</style>
        <div className="setup-card setup-done">
          <div className="setup-mark" style={{ margin: "0 auto 20px" }}><CheckCircle2 size={22} /></div>
          <div className="setup-title">Already set up</div>
          <p className="setup-sub">
            An admin account already exists for this deployment — this
            one-time setup step can't run again. Head to the login page
            to sign in with the account that was created the first time
            this ran.
          </p>
          <button className="setup-btn" onClick={() => router.push("/login")}>
            Go to login <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-root">
      <style>{tokens}</style>
      <div className="setup-card">
        <div className="setup-mark"><School size={22} /></div>
        <div className="setup-title">Set up MonaLearn</div>
        <p className="setup-sub">
          This runs once, the very first time this deployment goes live.
          It creates your school and the first admin account — the one
          you'll use to log in and set everything else up from there.
        </p>

        {error && <p className="setup-error">{error}</p>}

        <div className="setup-field">
          <label className="setup-label">School name</label>
          <div className="setup-input-wrap">
            <School size={16} color="var(--mist-500)" />
            <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Kitante Hill School" />
          </div>
        </div>

        <div className="setup-field">
          <label className="setup-label">Admin email</label>
          <div className="setup-input-wrap">
            <Mail size={16} color="var(--mist-500)" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>

        <div className="setup-field">
          <label className="setup-label">Password</label>
          <div className="setup-input-wrap">
            <Lock size={16} color="var(--mist-500)" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" />
          </div>
        </div>

        <button className="setup-btn" onClick={handleSetup} disabled={loading || !schoolName || !email || !password}>
          {loading ? "Setting up…" : <>Create admin account <KeyRound size={16} /></>}
        </button>
      </div>
    </div>
  );
}
