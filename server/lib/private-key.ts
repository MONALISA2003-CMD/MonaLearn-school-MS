// Getting a multi-line PEM private key correctly through a single-line
// environment-variable input (Vercel's dashboard, in this project's
// case) is a well-known source of subtle corruption — and very likely
// explains a large fraction of this project's entire deployment
// troubleshooting history: every earlier failure showed only a generic
// crash, with nothing surfacing the ACTUAL underlying error until the
// NestJS layer was removed and a real error message finally got
// through: `error:1E08010C:DECODER routines::unsupported` — a Node/
// OpenSSL error that occurs specifically when a private key can't be
// parsed as valid PEM. This function normalizes the most common ways a
// pasted key value gets subtly mangled, then validates the result
// actually looks like a real key before handing it to Firestore's
// credentials, rather than passing a malformed value silently forward
// into a cryptic OpenSSL error again.
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  // Strip one layer of surrounding quotes — happens if the whole
  // `FIREBASE_PRIVATE_KEY="-----BEGIN..."` line got pasted into
  // Vercel's value field instead of just the value itself. Vercel's
  // input takes the raw string as-is; a literal `"` becomes part of
  // the key and breaks parsing.
  if (key.length > 1) {
    const first = key[0];
    const last = key[key.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      key = key.slice(1, -1).trim();
    }
  }

  // If the value already contains real newlines and no literal
  // backslash-n sequences, it's already in the right shape — some
  // paste paths preserve real line breaks even through a single-line
  // input, depending on exactly how the value was copied.
  const hasRealNewlines = key.includes('\n');
  const hasLiteralBackslashN = key.includes('\\n');

  if (hasRealNewlines && !hasLiteralBackslashN) {
    return key;
  }

  // Otherwise, convert literal backslash-n sequences to real newlines.
  // Repeats the pass in case the value went through an extra layer of
  // escaping somewhere along the way (turning \n into \\n) — each pass
  // only ever removes one layer, and a value with no more literal
  // backslash-n sequences left is simply returned unchanged by the next
  // pass, so this can't loop forever or over-convert a value that only
  // needed one pass.
  let previous: string;
  do {
    previous = key;
    key = key.replace(/\\n/g, '\n');
  } while (key !== previous && key.includes('\\n'));

  return key;
}

export function validatePrivateKey(key: string): { valid: true } | { valid: false; reason: string } {
  if (!key) {
    return { valid: false, reason: 'FIREBASE_PRIVATE_KEY is empty' };
  }
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    return { valid: false, reason: 'FIREBASE_PRIVATE_KEY is missing its "-----BEGIN PRIVATE KEY-----" header — the value may be truncated, or copied from the wrong field in the downloaded JSON file' };
  }
  if (!key.includes('-----END PRIVATE KEY-----')) {
    return { valid: false, reason: 'FIREBASE_PRIVATE_KEY is missing its "-----END PRIVATE KEY-----" footer — the value may have been cut off while pasting' };
  }
  // A real key body has multiple lines between the header and footer —
  // if everything collapsed onto one line, the \n conversion above
  // didn't find anything to convert, which usually means the ORIGINAL
  // pasted value wasn't in the expected literal-backslash-n format at
  // all (e.g. real newlines got stripped somewhere before reaching
  // Vercel, rather than being present as literal \n characters).
  const lineCount = key.split('\n').filter((l) => l.trim().length > 0).length;
  if (lineCount < 3) {
    return {
      valid: false,
      reason: `FIREBASE_PRIVATE_KEY has no line breaks in its body (only ${lineCount} non-empty line(s) found) — a real private key has many. The value likely lost its line breaks before this code ever saw it; re-copy it fresh from the downloaded service account JSON file, pasting it with literal \\n characters exactly as they appear in that file`,
    };
  }
  return { valid: true };
}
