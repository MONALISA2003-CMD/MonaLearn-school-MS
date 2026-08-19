import { redirect } from "next/navigation";

// Login is temporarily disabled while the rest of the app is still
// being built and tested — see server/lib/jwt.ts for the corresponding
// backend bypass. Change this back to redirect("/login") once auth is
// re-enabled.
export default function Home() {
  redirect("/modules");
}
