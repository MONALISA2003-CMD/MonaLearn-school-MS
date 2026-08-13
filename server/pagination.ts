import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Query params: ?page=2&pageSize=25 — defaults keep existing callers
// working (page 1, pageSize 25) without any breaking change.
export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // hard ceiling — no client can request 10,000 rows in one call
  pageSize: number = 25;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Wraps any Prisma findMany + count pair into a consistent shape every
// module returns the same way — used by Students, and the pattern any
// other list endpoint converts to the same way.
export function paginate<T>(data: T[], total: number, page: number, pageSize: number): PaginatedResult<T> {
  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
