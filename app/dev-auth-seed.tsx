"use client";

import { useEffect } from "react";

// Auth is temporarily disabled while the rest of the app is built and
// tested — see server/lib/jwt.ts for the matching backend bypass and
// the reasoning behind it. This seeds a placeholder token so every
// page's existing "if (!token) return" check (which predates this
// bypass, built during normal live-data wiring) passes and pages fetch
// real data instead of silently falling back to sample data forever.
// The backend doesn't actually validate this token's contents right
// now — its mere presence is all that matters until auth comes back.
export default function DevAuthSeed() {
  useEffect(() => {
    if (!localStorage.getItem("monalearn_token")) {
      localStorage.setItem("monalearn_token", "dev-mode-no-auth");
    }
  }, []);
  return null;
}
