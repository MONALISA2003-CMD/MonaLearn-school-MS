// Deliberately the simplest possible thing Vercel can run: a native
// Next.js Route Handler with zero imports beyond what Next.js itself
// provides, zero dependency on NestJS, Firestore, bcryptjs, the custom
// vercel.json rewrite, or anything else in this project. This is a
// diagnostic isolation test, not a real feature.
//
// If visiting /ping works (shows the JSON below) while /api/health
// still fails, that proves definitively that the problem is specific
// to the custom /api function — its bundle, its dependencies, or the
// rewrite routing to it — and NOT a more fundamental issue with this
// Vercel project, this GitHub repo, or the build pipeline in general.
//
// If /ping ALSO fails the same way /api/health does, that's just as
// valuable to know: it would mean the problem isn't in anything this
// project's custom backend code does at all, and points somewhere more
// fundamental — worth escalating to Vercel's own support with that
// specific, narrowed-down fact in hand.
export async function GET() {
  return Response.json({
    ok: true,
    message: 'This is the simplest possible Vercel route — if you see this, the platform, the build, and the deployment pipeline are all working correctly.',
    timestamp: new Date().toISOString(),
  });
}
