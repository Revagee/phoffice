# Development Guide

Complete development roadmap for Legal CRM. Work milestone-by-milestone — do not start the next milestone until the current one meets all acceptance criteria.

## Milestone Overview

| # | Name | Duration | Status |
|---|------|----------|--------|
| M1 | Project Scaffold & Auth | 2 weeks | Not Started |
| M2 | Core CRM (Clients & Cases) | 3 weeks | Not Started |
| M3 | Documents & Tasks | 2 weeks | Not Started |
| M4 | Calendar, Hearings & Activities | 2 weeks | Not Started |
| M5 | Billing (Invoices, Payments, Expenses) | 3 weeks | Not Started |
| M6 | Notifications, Settings & Polish | 2 weeks | Not Started |
| M7 | AI Features & Advanced Search | 2 weeks | Not Started |
| M8 | Client Portal & Trust Accounting | 3 weeks | Not Started |

---

## Milestone 1: Project Scaffold & Auth

**Duration**: 2 weeks

### Goals

- Initialize Next.js 15 project with full tooling
- Configure Tailwind, shadcn/ui, dark theme
- Set up Prisma + PostgreSQL with migrations
- Implement Auth.js authentication
- Build app shell (sidebar, header, command palette)
- RBAC foundation (roles, permissions)

### Files

```
package.json, tsconfig.json, next.config.ts, tailwind.config.ts
src/app/layout.tsx, globals.css
src/app/(auth)/login/page.tsx, register/page.tsx
src/app/(dashboard)/layout.tsx, page.tsx
src/server/auth/config.ts, require-auth.ts
src/server/permissions/definitions.ts, require-permission.ts
src/middleware.ts
src/lib/prisma.ts, utils.ts, routes.ts
src/providers/query-provider.tsx, theme-provider.tsx
src/components/layout/app-shell.tsx, sidebar.tsx, header.tsx
src/components/ui/* (shadcn: button, input, form, dialog, etc.)
src/prisma/seed.ts
docker-compose.yml
.github/workflows/ci.yml
vitest.config.ts, playwright.config.ts
```

### Components

- `AppShell` — dashboard layout wrapper
- `Sidebar` — navigation with icons, collapsible
- `Header` — breadcrumbs, search trigger, user menu
- `CommandPalette` — Cmd+K navigation
- `LoginForm`, `RegisterForm`
- `ThemeToggle`
- Skeleton components for dashboard

### Database Changes

- Run initial migration from `schema.prisma`
- Seed: 1 org, 5 roles, permissions matrix, 3 users

### API

- Auth.js routes via `/api/auth/[...nextauth]`
- Server Actions: `login`, `register`, `logout`, `getSession`

### Testing

- Unit: `requireAuth`, `requirePermission`, permission matrix
- E2E: login flow, redirect unauthenticated users, role-based nav visibility

### Acceptance Criteria

- [ ] `pnpm dev` runs without errors
- [ ] User can register, login, logout
- [ ] Dashboard shell renders with sidebar navigation
- [ ] Dark mode works and persists
- [ ] Middleware redirects unauthenticated users to login
- [ ] Admin vs Attorney see different nav items based on permissions
- [ ] CI pipeline passes: lint, typecheck, test, build
- [ ] Command palette opens with Cmd+K

---

## Milestone 2: Core CRM (Clients & Cases)

**Duration**: 3 weeks

### Goals

- Full CRUD for Clients and Cases
- Data tables with sorting, filtering, pagination
- Case detail page with tabs (Overview, Activity placeholder)
- Client detail page with linked cases
- Activity logging on all mutations
- Tags on cases and clients

### Files

```
src/features/clients/ui/client-list.tsx, client-detail.tsx, client-form.tsx
src/features/clients/actions/*.ts, hooks/use-clients.ts, schemas/client.schema.ts
src/features/cases/ui/case-list.tsx, case-detail.tsx, case-form.tsx, case-status-badge.tsx
src/features/cases/actions/*.ts, hooks/use-cases.ts, schemas/case.schema.ts
src/features/tags/ui/tag-badge.tsx, tag-selector.tsx
src/features/activities/services/activity.service.ts
src/repositories/client.repository.ts, case.repository.ts, tag.repository.ts
src/services/case.service.ts, client.service.ts
src/app/(dashboard)/clients/page.tsx, [clientId]/page.tsx, new/page.tsx
src/app/(dashboard)/cases/page.tsx, [caseId]/page.tsx, new/page.tsx
src/components/data-display/data-table.tsx, status-badge.tsx, stat-card.tsx
src/components/feedback/empty-state.tsx
src/utils/generate-case-number.ts
```

### Components

- `DataTable` — reusable sortable, filterable table (TanStack Table)
- `ClientList`, `ClientDetail`, `ClientForm`
- `CaseList`, `CaseDetail`, `CaseForm`, `CaseStatusBadge`
- `TagBadge`, `TagSelector`
- `EmptyClients`, `EmptyCases`
- `PageHeader` with action buttons

### Database Changes

- No schema changes (uses M1 migration)
- Seed: 10 clients, 20 cases with varied statuses

### API

- Client actions: `getClients`, `getClient`, `createClient`, `updateClient`, `deleteClient`, `searchClients`
- Case actions: `getCases`, `getCase`, `createCase`, `updateCase`, `updateCaseStatus`, `deleteCase`, `closeCase`
- Tag actions: `getTags`, `createTag`, `assignTag`, `removeTag`

### Testing

- Unit: case number generation, status transitions, closeCase with open invoices blocked
- Unit: repository org-scoping (cross-tenant returns null)
- Integration: create client → create case → verify link
- E2E: create client, create case, filter cases by status

### Acceptance Criteria

- [ ] CRUD clients with individual and company types
- [ ] CRUD cases linked to clients with auto case numbers
- [ ] Case list filterable by status, priority, assignee
- [ ] Case detail shows client info, status, priority, assignee
- [ ] Client detail shows linked cases
- [ ] Tags can be created and assigned to cases/clients
- [ ] Activity logged on create/update/delete
- [ ] Pagination works (25 per page)
- [ ] Empty states with "Create" CTAs
- [ ] Skeleton loaders on all list/detail pages

---

## Milestone 3: Documents & Tasks

**Duration**: 2 weeks

### Goals

- Document upload/download via S3/R2
- Document list on case/client detail tabs
- Task management with due dates and assignments
- Task list view and case-embedded task list

### Files

```
src/features/documents/ui/document-list.tsx, document-upload.tsx
src/features/documents/actions/*.ts, schemas/document.schema.ts
src/features/tasks/ui/task-list.tsx, task-form.tsx, task-board.tsx
src/features/tasks/actions/*.ts, hooks/use-tasks.ts, schemas/task.schema.ts
src/repositories/document.repository.ts, task.repository.ts
src/services/storage.service.ts
src/components/forms/file-upload.tsx
src/app/(dashboard)/tasks/page.tsx
src/app/api/webhooks/ (placeholder)
```

### Components

- `DocumentList`, `DocumentUpload`, `FileUpload`
- `TaskList`, `TaskForm`, `TaskBoard` (kanban-style optional)
- `DocumentListSkeleton`, `TaskListSkeleton`

### Database Changes

- No schema changes
- Seed: sample documents (metadata), 30 tasks

### API

- Document: `getDocuments`, `uploadDocument`, `deleteDocument`, `getDocumentUrl`
- Task: `getTasks`, `createTask`, `updateTask`, `completeTask`, `deleteTask`

### Testing

- Unit: file MIME validation, size limit enforcement
- Integration: upload document → verify metadata in DB
- E2E: upload document on case, create task with due date

### Acceptance Criteria

- [ ] Upload documents to case/client with category selection
- [ ] Download via presigned URL
- [ ] Document list with category filter
- [ ] Privilege flag on documents
- [ ] CRUD tasks with assignee, due date, priority
- [ ] Task list filterable by status, assignee, due date
- [ ] Tasks visible on case detail tab
- [ ] File size limit enforced (50MB default)
- [ ] MIME type validation

---

## Milestone 4: Calendar, Hearings & Activities

**Duration**: 2 weeks

### Goals

- Calendar view (month/week/day)
- Hearing management linked to cases
- Activity timeline on case/client detail
- Hearing reminders (in-app notifications)

### Files

```
src/features/calendar/ui/calendar-view.tsx, event-form.tsx
src/features/calendar/actions/*.ts, schemas/calendar.schema.ts
src/features/hearings/ui/hearing-list.tsx, hearing-form.tsx
src/features/hearings/actions/*.ts, schemas/hearing.schema.ts
src/features/activities/ui/activity-feed.tsx, activity-item.tsx
src/features/activities/actions/get-activities.ts
src/features/notifications/services/notification.service.ts
src/repositories/hearing.repository.ts, calendar.repository.ts, activity.repository.ts
src/app/(dashboard)/calendar/page.tsx
```

### Components

- `CalendarView` — month/week/day grid
- `EventForm`, `HearingList`, `HearingForm`
- `ActivityFeed`, `ActivityItem`
- `Timeline` (shared component)

### Database Changes

- No schema changes
- Seed: 15 hearings, 10 calendar events, activity records

### API

- Calendar: `getCalendarEvents`, `createCalendarEvent`, `updateCalendarEvent`, `deleteCalendarEvent`
- Hearing: `getHearings`, `createHearing`, `updateHearing`, `deleteHearing`
- Activity: `getActivities`

### Testing

- Unit: hearing status transitions
- Integration: create hearing → verify calendar event
- E2E: view calendar, create hearing on case

### Acceptance Criteria

- [ ] Calendar displays events and hearings
- [ ] Create/edit/delete calendar events
- [ ] Schedule hearings on cases with type, location, duration
- [ ] Activity feed on case/client detail (cursor paginated)
- [ ] Hearing reminder notification created 24h before
- [ ] Upcoming hearings visible on dashboard

---

## Milestone 5: Billing (Invoices, Payments, Expenses)

**Duration**: 3 weeks

### Goals

- Invoice creation with line items
- Invoice PDF generation
- Payment recording against invoices
- Expense tracking per case
- Billing dashboard with revenue stats

### Files

```
src/features/billing/invoices/ui/invoice-list.tsx, invoice-detail.tsx, invoice-form.tsx
src/features/billing/invoices/actions/*.ts, schemas/invoice.schema.ts
src/features/billing/payments/ui/payment-form.tsx
src/features/billing/payments/actions/*.ts
src/features/billing/expenses/ui/expense-list.tsx, expense-form.tsx
src/features/billing/expenses/actions/*.ts
src/repositories/invoice.repository.ts, payment.repository.ts, expense.repository.ts
src/services/invoice.service.ts
src/utils/format-currency.ts
src/app/(dashboard)/billing/invoices/page.tsx, [invoiceId]/page.tsx
src/app/(dashboard)/billing/payments/page.tsx
src/app/(dashboard)/billing/expenses/page.tsx
src/components/data-display/stat-card.tsx (revenue stats)
```

### Components

- `InvoiceList`, `InvoiceDetail`, `InvoiceForm`, `InvoiceLineItems`
- `PaymentForm`, `ExpenseList`, `ExpenseForm`
- `BillingDashboard` — revenue, outstanding, overdue stats

### Database Changes

- No schema changes
- Seed: 10 invoices with line items, 5 payments, 15 expenses

### API

- Invoice: `getInvoices`, `getInvoice`, `createInvoice`, `updateInvoice`, `sendInvoice`, `voidInvoice`
- Payment: `getPayments`, `recordPayment`, `refundPayment`
- Expense: `getExpenses`, `createExpense`, `updateExpense`, `deleteExpense`

### Testing

- Unit: tax calculation, invoice total, payment status update
- Unit: cannot edit sent invoice, cannot void paid invoice
- Integration: create invoice → record payment → status PAID
- E2E: create invoice, add line items, record payment

### Acceptance Criteria

- [ ] Create draft invoices with multiple line items
- [ ] Auto-calculate subtotal, tax, total
- [ ] Send invoice (status SENT)
- [ ] Record full and partial payments
- [ ] Invoice status auto-updates (PARTIAL, PAID, OVERDUE)
- [ ] Expense CRUD linked to cases
- [ ] Billing dashboard with stats
- [ ] Cannot close case with unpaid invoices
- [ ] Invoice numbers sequential per org

---

## Milestone 6: Notifications, Settings & Polish

**Duration**: 2 weeks

### Goals

- In-app notification center
- Organization settings page
- User profile management
- Dashboard with widgets (stats, upcoming, recent activity)
- Performance optimization pass
- Accessibility audit

### Files

```
src/features/notifications/ui/notification-center.tsx, notification-bell.tsx
src/features/notifications/actions/*.ts
src/features/settings/ui/settings-form.tsx, org-settings.tsx
src/features/settings/actions/*.ts
src/features/dashboard/ui/dashboard-widgets.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/settings/profile/page.tsx
src/app/(dashboard)/settings/organization/page.tsx
src/app/(dashboard)/settings/team/page.tsx
```

### Components

- `NotificationCenter`, `NotificationBell`
- `DashboardWidgets` — stats, upcoming hearings, recent cases, tasks due
- `SettingsForm`, `OrgSettings`, `TeamManagement`

### Database Changes

- Seed settings keys for org

### API

- Notification: `getNotifications`, `markNotificationRead`, `markAllNotificationsRead`
- Settings: `getSettings`, `updateSetting`

### Testing

- E2E: full user journey — login → create client → case → task → invoice → payment
- Accessibility: axe-core audit on main pages
- Performance: Lighthouse score >90 on dashboard

### Acceptance Criteria

- [ ] Notification bell with unread count
- [ ] Notification center with mark read/all read
- [ ] Org settings: name, timezone, currency, case number prefix
- [ ] User profile: name, avatar, password change
- [ ] Team management: invite, assign roles
- [ ] Dashboard widgets functional
- [ ] Lighthouse performance >90
- [ ] WCAG AA audit passes
- [ ] All keyboard shortcuts documented

---

## Milestone 7: AI Features & Advanced Search

**Duration**: 2 weeks

### Goals

- Global search across cases, clients, documents
- AI case summary generation
- AI document draft assistance
- Smart deadline extraction from documents

### Files

```
src/features/search/ui/global-search.tsx, search-results.tsx
src/features/search/actions/search.ts
src/features/ai/ui/ai-summary-panel.tsx, ai-draft-panel.tsx
src/services/ai/ai.service.ts, prompts/*.ts, sanitizers/pii-redactor.ts
```

### Components

- `GlobalSearch` — Cmd+K enhanced with search
- `AiSummaryPanel`, `AiDraftPanel`
- `SearchResults`

### Database Changes

- Optional: add `search_vector` tsvector columns (Phase 2)

### API

- `globalSearch` — cross-entity search
- `summarizeCase` — AI summary
- `draftDocument` — AI document draft

### Testing

- Unit: PII redaction before AI calls
- Unit: AI permission check
- Integration: AI audit log entries

### Acceptance Criteria

- [ ] Global search returns cases, clients, documents
- [ ] AI case summary with disclaimer
- [ ] PII redacted before external API calls
- [ ] AI features behind permission and feature flag
- [ ] Audit log for all AI interactions

---

## Milestone 8: Client Portal & Trust Accounting

**Duration**: 3 weeks

### Goals

- Separate client portal auth
- Clients view their cases, documents, invoices
- Trust account (IOLTA) tracking
- Conflict check on new client/case
- Data export and retention policies

### Files

```
src/app/(portal)/ — separate route group
src/features/portal/ui/*
src/features/trust-accounting/ui/*, services/*
src/features/conflict-check/services/*
```

### Acceptance Criteria

- [ ] Client portal with limited access
- [ ] Clients see own cases, documents, invoices only
- [ ] Trust account balance tracking
- [ ] Conflict check before client/case creation
- [ ] Data export with audit trail

---

## Local Development

```bash
# Start database
docker compose up -d

# Install and setup
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Development
pnpm dev

# Testing
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
pnpm lint          # ESLint
pnpm typecheck     # TypeScript
```

## Definition of Done (Every Task)

- [ ] Code follows architecture layers
- [ ] TypeScript strict, no `any`
- [ ] Zod validation on inputs
- [ ] Auth + permission checks
- [ ] Loading, empty, error UI states
- [ ] Unit tests for business logic
- [ ] No secrets in code
- [ ] Cursor rules respected
- [ ] Documentation updated if API/schema changed

## Current Status

**Phase**: Pre-implementation planning complete.

**Next step**: Begin Milestone 1 — Project Scaffold & Auth.

Do not proceed to Milestone 2 until all M1 acceptance criteria are met.
