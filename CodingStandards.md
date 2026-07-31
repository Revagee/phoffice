# Coding Standards

Project-wide coding conventions. Cursor rules in `.cursor/rules/` provide AI-enforced detail per area.

## Principles

| Principle | Application |
|-----------|-------------|
| **Clean Architecture** | Strict layer boundaries; dependencies point inward |
| **SOLID** | Single responsibility, open/closed, dependency inversion |
| **DRY** | Extract shared logic; never duplicate types or validation |
| **KISS** | Simplest correct solution; no premature abstraction |
| **Feature-first** | Organize by domain feature, not technical layer alone |

## TypeScript

- `strict: true` — no exceptions
- No `any`; use `unknown` and narrow
- Zod schemas as single source of truth for input types
- Explicit return types on exported functions
- `import type` for type-only imports

```typescript
// Schema → Type pipeline
export const createCaseSchema = z.object({ title: z.string().min(1) });
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
```

## React & Next.js

- Server Components by default
- `"use client"` only for hooks, events, browser APIs
- One component per file
- Props interface: `[Component]Props`
- Early return for loading / empty / error states
- React Query for client-side data with 30s staleTime default

## Naming Conventions

| Artifact | Convention | Example |
|----------|------------|---------|
| Files (components) | PascalCase.tsx | `CaseList.tsx` |
| Files (utilities) | kebab-case.ts | `format-currency.ts` |
| Components | PascalCase | `CaseStatusBadge` |
| Hooks | camelCase, `use` prefix | `useCases` |
| Server Actions | camelCase verb | `createCase` |
| Repositories | PascalCase + Repository | `CaseRepository` |
| Services | PascalCase + Service | `InvoiceService` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `CaseWithClient` |
| Enums (Prisma) | SCREAMING_SNAKE values | `IN_PROGRESS` |
| CSS | Tailwind utilities via `cn()` | — |

## Code Organization

```typescript
// File order:
// 1. Imports (type imports first)
// 2. Types/interfaces
// 3. Constants
// 4. Main export
// 5. Sub-components (if colocated)
// 6. Helpers (if colocated)
```

## Error Handling

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Always log server-side, return safe message client-side
try {
  // ...
} catch (error) {
  logger.error('operation failed', { error });
  return { success: false, error: 'Operation failed' };
}
```

## Validation

- Zod at every boundary: forms, Server Actions, webhooks
- Whitelist fields in schemas — never pass raw `req.body` to Prisma
- Reject unknown fields with `.strict()` where appropriate

## Comments

- Code should be self-documenting
- Comment **why**, not **what**
- JSDoc on exported functions, services, repositories
- No commented-out code in commits

## Git

- Conventional Commits: `feat(cases): add status filter`
- Short-lived feature branches off `develop`
- PR required for merge to `main`
- No secrets in commits

## Testing

- Vitest for unit/integration
- React Testing Library for components
- Playwright for E2E critical paths
- Test permission denial and cross-tenant isolation
- Factory functions in `tests/factories/`

## UI Standards

- Dark mode first
- Semantic Tailwind tokens (no hardcoded hex)
- Skeleton loaders for every async view
- Empty states with actionable CTAs
- WCAG AA contrast and keyboard navigation
- Framer Motion: 150–300ms, transform/opacity only

## Security

- Auth check on every protected Server Action
- Permission check per operation
- `organizationId` from session, never client input
- Audit log for sensitive mutations
- Sanitize HTML with DOMPurify

## Performance

- Paginate lists (default 25)
- Select only needed Prisma fields
- Parallel fetches with `Promise.all`
- Lazy-load heavy components
- Debounce search (300ms)

## Pre-Commit Checklist

- [ ] TypeScript compiles with no errors
- [ ] ESLint passes
- [ ] Tests pass
- [ ] No `any` types
- [ ] Input validated with Zod
- [ ] Loading/empty/error states present
- [ ] No secrets in diff
- [ ] Docs updated if schema/API changed
