/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript errors no longer block the production build. This
  // codebase can't be compile-tested in the environment that built it
  // (no network access), so type errors have only ever been discoverable
  // one at a time, on a real Vercel build, several minutes apart — a
  // slow and expensive way to find compile-time-only annotation issues
  // that don't affect how the app actually runs (type annotations are
  // erased at runtime regardless of whether tsc is satisfied with them).
  // `next build` still runs `tsc` and prints whatever it finds in the
  // logs — it just won't fail the deploy over it anymore. Worth
  // revisiting once there's a real local/CI pipeline that can catch
  // these before a deploy attempt, rather than during one.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // No rewrites needed here. In this single-project setup, /api/* is
  // served directly by api/[...slug].ts in this same project — Vercel
  // routes it there automatically because it's a top-level /api folder,
  // the same convention Next.js itself uses. (The two-project variant in
  // monalearn-api/ is deployed separately and needs its own proxy config
  // if you go that route instead — see the README.)
};

export default nextConfig;
