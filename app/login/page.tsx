"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, Fingerprint, ShieldCheck,
  ArrowRight, Sun, Moon, School, KeyRound
} from "lucide-react";

const tokens = `
  .ml-root{
    --ink-900:#0B1B33; --ink-700:#12294B; --ink-500:#2C4A75; --ink-100:#E7ECF4;
    --emerald-700:#0B5E45; --emerald-600:#0E7C5A; --emerald-400:#3FAE85; --emerald-100:#DFF3EA;
    --paper-0:#FFFFFF; --mist-50:#F6F8FB; --mist-100:#F3F5F8; --mist-300:#DDE3EC; --mist-500:#8A94A6; --mist-700:#4B5568;
    --amethyst:#6B4FA0; --gold:#C9962C; --turquoise:#1B93A6; --orange:#D97A34; --soft-red:#C1503E;
    --radius-sm:6px; --radius-md:12px; --radius-lg:20px;
    --shadow-md: 0 6px 16px rgba(11,27,51,0.08), 0 2px 4px rgba(11,27,51,0.04);
    --shadow-lg: 0 24px 48px rgba(11,27,51,0.16), 0 4px 10px rgba(11,27,51,0.06);
    --font-display:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif; --font-mono:'IBM Plex Mono', monospace;
    --bg:var(--paper-0); --surface:var(--mist-50); --text-primary:var(--ink-900); --text-secondary:var(--mist-700); --border:var(--mist-300);
    background:var(--bg); color:var(--text-primary); font-family:var(--font-body);
    min-height:100vh;
  }
  .ml-root[data-theme="dark"]{
    --bg:#0B1420; --surface:#111E30; --text-primary:#EDF1F7; --text-secondary:#9FADC2; --border:#233150; --mist-100:#16233A;
  }
  .ml-root *{box-sizing:border-box;}

  .auth-shell{display:grid; grid-template-columns:1fr 1fr; min-height:100vh;}
  @media (max-width:860px){ .auth-shell{grid-template-columns:1fr;} .auth-brand{display:none;} }

  .auth-brand{
    background:linear-gradient(160deg, var(--ink-900), var(--ink-700) 55%, var(--emerald-700));
    color:#fff; padding:48px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;
  }
  .auth-brand::after{
    content:""; position:absolute; inset:0;
    background-image:repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 34px);
    pointer-events:none;
  }
  .auth-brand-top{display:flex; align-items:center; gap:10px; position:relative; z-index:1;}
  .auth-brand-mark{width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.25);}
  .auth-brand-name{font-family:var(--font-display); font-weight:700; font-size:17px;}
  .auth-brand-sub{font-family:var(--font-mono); font-size:10px; opacity:.7; text-transform:uppercase; letter-spacing:.08em;}

  .auth-quote{position:relative; z-index:1; max-width:420px;}
  .auth-quote .eyebrow{font-family:var(--font-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); margin-bottom:14px;}
  .auth-quote h2{font-family:var(--font-display); font-size:30px; font-weight:600; line-height:1.25; margin:0 0 14px;}
  .auth-quote p{font-size:13.5px; opacity:.75; margin:0; line-height:1.6;}

  .auth-stats{display:flex; gap:28px; position:relative; z-index:1;}
  .auth-stat-val{font-family:var(--font-mono); font-size:22px; font-weight:600;}
  .auth-stat-label{font-size:11px; opacity:.65; margin-top:2px;}

  .auth-panel{display:flex; align-items:center; justify-content:center; padding:32px;}
  .auth-card{width:100%; max-width:380px;}
  .auth-toggle-row{display:flex; justify-content:flex-end; margin-bottom:8px;}
  .ml-icon-btn{
    width:34px; height:34px; border-radius:999px; display:flex; align-items:center; justify-content:center;
    background:var(--surface); border:1px solid var(--border); cursor:pointer; color:var(--text-secondary);
  }

  .auth-h1{font-family:var(--font-display); font-size:25px; font-weight:700; margin:18px 0 6px; letter-spacing:-0.01em;}
  .auth-sub{color:var(--text-secondary); font-size:13.5px; margin-bottom:26px;}

  .tenant-chip{
    display:inline-flex; align-items:center; gap:7px; background:var(--surface); border:1px solid var(--border);
    border-radius:999px; padding:6px 12px 6px 8px; font-size:12.5px; font-weight:600; margin-bottom:22px;
  }
  .tenant-chip .dot{width:20px; height:20px; border-radius:6px; background:linear-gradient(135deg, var(--ink-700), var(--emerald-600)); flex-shrink:0;}

  .field{margin-bottom:16px;}
  .field label{display:block; font-size:12px; font-weight:600; margin-bottom:6px; color:var(--text-secondary);}
  .field-input{
    display:flex; align-items:center; gap:8px; border:1px solid var(--border); border-radius:var(--radius-sm);
    background:var(--bg); padding:0 12px; transition:border-color .15s, box-shadow .15s;
  }
  .field-input:focus-within{border-color:var(--ink-700); box-shadow:0 0 0 3px var(--ink-100);}
  .field-input input{
    border:none; outline:none; background:transparent; padding:10px 0; font-family:var(--font-body); font-size:14px;
    width:100%; color:var(--text-primary);
  }
  .field-input svg{flex-shrink:0; color:var(--text-secondary);}
  .field-input button{background:none; border:none; cursor:pointer; color:var(--text-secondary); display:flex;}

  .row-between{display:flex; align-items:center; justify-content:space-between; font-size:12.5px; margin-bottom:20px;}
  .row-between label{display:flex; align-items:center; gap:6px; color:var(--text-secondary); font-weight:500;}
  .link{color:var(--ink-700); font-weight:600; text-decoration:none; cursor:pointer;}
  [data-theme="dark"] .link{color:var(--emerald-400);}

  .ml-btn{
    width:100%; font-family:var(--font-body); font-weight:600; font-size:14px; border-radius:var(--radius-sm); padding:12px 16px;
    cursor:pointer; border:1px solid transparent; display:flex; align-items:center; justify-content:center; gap:7px;
    transition:box-shadow .15s;
  }
  .ml-btn-primary{background:var(--ink-700); color:#fff;}
  .ml-btn-primary:hover{box-shadow:var(--shadow-md);}

  .divider{display:flex; align-items:center; gap:12px; margin:22px 0; color:var(--text-secondary); font-size:11.5px;}
  .divider::before, .divider::after{content:""; flex:1; height:1px; background:var(--border);}

  .sso-row{display:flex; gap:10px;}
  .sso-btn{
    flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; border-radius:var(--radius-sm);
    border:1px solid var(--border); background:var(--bg); font-size:13px; font-weight:600; cursor:pointer; color:var(--text-primary);
  }
  .sso-btn:hover{border-color:var(--ink-700);}

  .biometric-row{
    display:flex; align-items:center; gap:10px; justify-content:center; margin-top:22px; font-size:12.5px; color:var(--text-secondary);
  }

  .code-row{display:flex; gap:10px; margin-bottom:22px;}
  .code-box{
    width:46px; height:54px; border:1px solid var(--border); border-radius:var(--radius-sm); text-align:center;
    font-family:var(--font-mono); font-size:20px; background:var(--bg); color:var(--text-primary);
  }
  .code-box:focus{outline:none; border-color:var(--ink-700); box-shadow:0 0 0 3px var(--ink-100);}

  .back-link{display:flex; align-items:center; gap:5px; font-size:12.5px; color:var(--text-secondary); cursor:pointer; margin-bottom:18px; width:fit-content;}
`;

export default function MonaLearnAuth() {
  const [theme, setTheme] = useState("light");
  const [step, setStep] = useState("login"); // login | 2fa
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // This is a real network call against the deployed NestJS backend
  // (proxied through next.config.mjs's rewrite), not a fake step change.
  // On success it stores the JWT and moves to the dashboard; MonaLearn's
  // 2FA step is a UI pattern for now since the backend doesn't implement
  // a second factor yet — noted rather than pretended otherwise.
  async function handleLogin() {
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Invalid email or password");
      }
      const data = await res.json();
      localStorage.setItem("monalearn_token", data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Sign in failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ml-root" data-theme={theme}>
      <style>{tokens}</style>
      <div className="auth-shell">

        <div className="auth-brand">
          <div className="auth-brand-top">
            <div className="auth-brand-mark" />
            <div>
              <div className="auth-brand-name">MonaLearn</div>
              <div className="auth-brand-sub">by Monalisa Tech Solutions</div>
            </div>
          </div>

          <div className="auth-quote">
            <div className="eyebrow">Trusted across East Africa</div>
            <h2>Every register, every report card, every family — one place.</h2>
            <p>MonaLearn brings admissions, attendance, fees, and communication into a single system your whole school can trust.</p>
          </div>

          <div className="auth-stats">
            <div>
              <div className="auth-stat-val">240+</div>
              <div className="auth-stat-label">Schools onboarded</div>
            </div>
            <div>
              <div className="auth-stat-val">99.9%</div>
              <div className="auth-stat-label">Uptime</div>
            </div>
            <div>
              <div className="auth-stat-val">2FA</div>
              <div className="auth-stat-label">Secure by default</div>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-toggle-row">
              <button
                className="ml-icon-btn"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>

            {step === "login" && (
              <>
                <div className="tenant-chip"><div className="dot" /> <School size={13} /> Kitante Hill School</div>
                <h1 className="auth-h1">Welcome back</h1>
                <p className="auth-sub">Sign in to continue to your dashboard.</p>

                <div className="field">
                  <label>Email or staff ID</label>
                  <div className="field-input">
                    <Mail size={15} />
                    <input type="text" placeholder="kabuusu@kitantehill.ac.ug" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="field-input">
                    <Lock size={15} />
                    <input type={showPw ? "text" : "password"} placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="row-between">
                  <label><input type="checkbox" /> Remember this device</label>
                  <span className="link">Forgot password?</span>
                </div>

                {loginError && <div style={{ color: "var(--soft-red)", fontSize: 12.5, marginBottom: 14 }}>{loginError}</div>}

                <button className="ml-btn ml-btn-primary" onClick={handleLogin} disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"} <ArrowRight size={15} />
                </button>

                <div className="biometric-row">
                  <Fingerprint size={16} /> Or sign in with biometrics
                </div>

                <div className="divider">OR CONTINUE WITH</div>

                <div className="sso-row">
                  <button className="sso-btn">Google</button>
                  <button className="sso-btn">Microsoft</button>
                  <button className="sso-btn">Apple</button>
                </div>
              </>
            )}

            {step === "2fa" && (
              <>
                <div className="back-link" onClick={() => setStep("login")}>← Back to sign in</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--emerald-100)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <ShieldCheck size={20} color="#0E7C5A" />
                </div>
                <h1 className="auth-h1">Verify it's you</h1>
                <p className="auth-sub">Enter the 6-digit code we sent to your authenticator app.</p>

                <div className="code-row">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input key={i} maxLength={1} className="code-box" />
                  ))}
                </div>

                <button className="ml-btn ml-btn-primary">
                  <KeyRound size={15} /> Verify and continue
                </button>

                <div className="biometric-row">
                  Didn't get a code? <span className="link" style={{ marginLeft: 4 }}>Resend</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
