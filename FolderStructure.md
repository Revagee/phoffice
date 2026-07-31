# Folder Structure

Complete project directory layout. Every file has a designated home — no orphan utilities.

## Root

```
legal-crm/
├── .cursor/
│   └── rules/                  # 18 Cursor AI rule files (.mdc)
├── .github/
│   └── workflows/              # CI/CD pipelines
├── docs/
│   └── adr/                    # Architecture Decision Records
├── public/                     # Static assets (icons, og-image)
├── src/                        # Application source
├── tests/
│   ├── factories/              # Test data builders
│   ├── helpers/                # Test utilities
│   └── e2e/                    # Playwright specs
├── .env.example
├── .gitignore
├── docker-compose.yml          # Local PostgreSQL
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── README.md
├── Architecture.md
├── Database.md
├── API.md
├── DevelopmentGuide.md
├── CodingStandards.md
├── FolderStructure.md
└── Contributing.md
```

## Source (`src/`)

```
src/
├── app/                                    # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                      # App shell (sidebar + header)
│   │   ├── page.tsx                        # Dashboard home
│   │   ├── cases/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [caseId]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── clients/
│   │   ├── calendar/
│   │   ├── tasks/
│   │   ├── billing/
│   │   │   ├── invoices/
│   │   │   ├── payments/
│   │   │   └── expenses/
│   │   ├── documents/
│   │   ├── reports/
│   │   └── settings/
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── layout.tsx                          # Root layout
│   ├── globals.css
│   ├── not-found.tsx
│   └── error.tsx
│
├── features/                               # Feature modules
│   ├── auth/
│   │   ├── ui/
│   │   ├── actions/
│   │   ├── schemas/
│   │   └── index.ts
│   ├── clients/
│   │   ├── ui/
│   │   ├── actions/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── index.ts
│   ├── cases/
│   ├── hearings/
│   ├── documents/
│   ├── tasks/
│   ├── billing/
│   │   ├── invoices/
│   │   ├── payments/
│   │   └── expenses/
│   ├── calendar/
│   ├── notes/
│   ├── activities/
│   ├── notifications/
│   ├── tags/
│   ├── settings/
│   └── dashboard/
│
├── components/                             # Shared UI
│   ├── ui/                                 # shadcn/ui primitives
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── page-header.tsx
│   │   └── command-palette.tsx
│   ├── data-display/
│   │   ├── data-table.tsx
│   │   ├── stat-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── timeline.tsx
│   │   └── activity-feed.tsx
│   ├── feedback/
│   │   ├── empty-state.tsx
│   │   ├── error-fallback.tsx
│   │   └── skeletons/
│   └── forms/
│       ├── search-input.tsx
│       ├── date-range-picker.tsx
│       └── file-upload.tsx
│
├── shared/                                 # Cross-cutting domain
│   ├── constants/
│   ├── errors/
│   └── domain/
│
├── hooks/                                  # Global hooks
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-keyboard-shortcut.ts
│
├── lib/                                    # Framework utilities
│   ├── prisma.ts                           # Prisma singleton
│   ├── utils.ts                            # cn() helper
│   ├── routes.ts                           # Route constants
│   ├── api/
│   │   └── action-result.ts
│   └── cache/
│       └── tags.ts
│
├── server/                                 # Server-only code
│   ├── auth/
│   │   ├── config.ts
│   │   ├── session.ts
│   │   └── require-auth.ts
│   └── permissions/
│       ├── definitions.ts
│       └── require-permission.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── types/                                  # Global types
│   ├── action-result.ts
│   ├── pagination.ts
│   └── session.ts
│
├── providers/
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   └── toast-provider.tsx
│
├── services/                               # Business logic
│   ├── case.service.ts
│   ├── invoice.service.ts
│   ├── activity.service.ts
│   ├── notification.service.ts
│   └── ai/
│       ├── ai.service.ts
│       └── prompts/
│
├── repositories/                           # Data access
│   ├── case.repository.ts
│   ├── client.repository.ts
│   ├── invoice.repository.ts
│   ├── user.repository.ts
│   └── ...
│
├── actions/                                # Global server actions
│   └── auth/
│
├── utils/                                  # Pure utilities
│   ├── format-currency.ts
│   ├── format-date.ts
│   └── generate-case-number.ts
│
└── middleware.ts                           # Auth route protection
```

## Feature Module Anatomy

Every feature follows this internal structure:

```
features/[feature-name]/
├── ui/                     # Feature-specific React components
│   ├── [feature]-list.tsx
│   ├── [feature]-detail.tsx
│   ├── [feature]-form.tsx
│   └── [feature]-skeleton.tsx
├── actions/                # Server Actions ("use server")
│   ├── create-[feature].ts
│   ├── update-[feature].ts
│   ├── delete-[feature].ts
│   └── get-[feature].ts
├── hooks/                  # React Query hooks
│   └── use-[feature].ts
├── schemas/                # Zod validation schemas
│   └── [feature].schema.ts
├── types/                  # Feature-specific types
│   └── index.ts
└── index.ts                # Public API barrel export
```

## Import Aliases

```json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/features/*": ["./src/features/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/server/*": ["./src/server/*"]
}
```

## File Placement Rules

| Code Type | Location |
|-----------|----------|
| Route page | `src/app/(dashboard)/[route]/page.tsx` |
| Feature component | `src/features/[feature]/ui/` |
| Shared component | `src/components/` |
| Server Action | `src/features/[feature]/actions/` |
| React Query hook | `src/features/[feature]/hooks/` |
| Zod schema | `src/features/[feature]/schemas/` |
| Repository | `src/repositories/` |
| Service | `src/services/` |
| Prisma schema | `src/prisma/schema.prisma` |
| Test | Colocated `*.test.ts` or `tests/` |
