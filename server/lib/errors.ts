// Replaces @nestjs/common's UnauthorizedException/ConflictException/
// NotFoundException/BadRequestException/ForbiddenException. NestJS used
// to catch these automatically and map them to the right HTTP status —
// without that framework machinery, each route handler does the same
// mapping explicitly via toHttpResponse() below. Every service function
// throws these exactly the way it threw the NestJS versions before;
// only the import changed.
export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// Every route handler's catch block calls this — turns a thrown
// AppError into the right status code + JSON body, and anything else
// (a genuine bug, a Firestore error) into a 500 with the real message
// visible in the response, the same diagnostic philosophy used
// throughout this project's troubleshooting.
export function toHttpResponse(err: unknown): Response {
  if (err instanceof AppError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : String(err);
  return Response.json({ error: 'Internal server error', message }, { status: 500 });
}
