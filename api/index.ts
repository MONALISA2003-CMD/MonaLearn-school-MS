// TEMPORARY DIAGNOSTIC VERSION — not the real backend.
//
// This deliberately has ZERO imports beyond what Node itself provides.
// No NestJS, no Express, no Firestore, no bcryptjs, nothing from
// server/. The full version (with the real backend) is saved
// separately and will be restored once this test tells us something.
//
// Purpose: isolate whether the top-level /api folder + vercel.json
// rewrite mechanism itself works at all for this specific project, or
// whether the problem is specifically something inside the NestJS/
// Firestore/dependency layer. If THIS bare function also fails the
// same way /api/health has been failing, that rules out everything
// built inside api/index.ts so far and points squarely at the routing
// mechanism (or something even more fundamental) instead.
export default function handler(req: any, res: any) {
  res.status(200).json({
    ok: true,
    message: 'Bare minimum Vercel function — no NestJS, no Firestore, no dependencies at all. If you see this, the top-level /api folder + vercel.json rewrite mechanism works correctly, and the problem is specifically inside the real backend code.',
    timestamp: new Date().toISOString(),
  });
}
