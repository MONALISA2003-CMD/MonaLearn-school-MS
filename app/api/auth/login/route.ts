import { login } from '../../../../server/auth/auth.service';
import { toHttpResponse } from '../../../../server/lib/errors';
import { envCheckResponse } from '../../../../server/lib/env-check';

export async function POST(req: Request) {
  const envError = envCheckResponse();
  if (envError) return envError;

  try {
    const body = await req.json();
    const result = await login(body.email, body.password);
    return Response.json(result);
  } catch (err) {
    return toHttpResponse(err);
  }
}
