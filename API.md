# API Reference

Legal CRM uses **Server Actions** as the primary internal API. Route Handlers are reserved for external integrations (webhooks, OAuth).

## Response Format

All Server Actions return a typed `ActionResult`:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

## Pagination Format

List actions return:

```typescript
type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};
```

Default page size: 25. Maximum: 100.

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Zod validation failed |
| `UNAUTHORIZED` | Not authenticated |
| `FORBIDDEN` | Missing permission |
| `NOT_FOUND` | Resource not found or wrong tenant |
| `CONFLICT` | Duplicate or invalid state transition |
| `INTERNAL_ERROR` | Unexpected server error |

---

## Authentication

| Action | File | Permission |
|--------|------|------------|
| `login` | `features/auth/actions/login.ts` | Public |
| `register` | `features/auth/actions/register.ts` | Public |
| `logout` | `features/auth/actions/logout.ts` | Authenticated |
| `getSession` | `features/auth/actions/get-session.ts` | Authenticated |

---

## Clients

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getClients` | Query | `clients:read` | Paginated client list with filters |
| `getClient` | Query | `clients:read` | Single client by ID |
| `createClient` | Mutation | `clients:create` | Create new client |
| `updateClient` | Mutation | `clients:update` | Update client details |
| `deleteClient` | Mutation | `clients:delete` | Soft delete client |
| `searchClients` | Query | `clients:read` | Full-text search |

**Filters**: `status`, `type`, `assignedToId`, `search`, `page`, `pageSize`

---

## Cases

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getCases` | Query | `cases:read` | Paginated case list |
| `getCase` | Query | `cases:read` | Case with client, assignee |
| `createCase` | Mutation | `cases:create` | Create case with auto case number |
| `updateCase` | Mutation | `cases:update` | Update case details |
| `updateCaseStatus` | Mutation | `cases:update` | Status transition with validation |
| `deleteCase` | Mutation | `cases:delete` | Soft delete |
| `closeCase` | Mutation | `cases:update` | Close with invoice check |

**Filters**: `status`, `priority`, `clientId`, `assignedToId`, `practiceArea`, `search`

---

## Hearings

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getHearings` | Query | `cases:read` | List by case or date range |
| `createHearing` | Mutation | `cases:update` | Schedule hearing |
| `updateHearing` | Mutation | `cases:update` | Update hearing details |
| `deleteHearing` | Mutation | `cases:update` | Cancel hearing |

---

## Documents

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getDocuments` | Query | `documents:read` | List by case/client |
| `uploadDocument` | Mutation | `documents:create` | Upload to S3, save metadata |
| `deleteDocument` | Mutation | `documents:delete` | Soft delete |
| `getDocumentUrl` | Query | `documents:read` | Presigned download URL |

---

## Tasks

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getTasks` | Query | `tasks:read` | List with filters |
| `createTask` | Mutation | `tasks:create` | Create task |
| `updateTask` | Mutation | `tasks:update` | Update task |
| `completeTask` | Mutation | `tasks:update` | Mark done |
| `deleteTask` | Mutation | `tasks:delete` | Soft delete |

**Filters**: `status`, `priority`, `assignedToId`, `caseId`, `dueBefore`, `dueAfter`

---

## Billing — Invoices

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getInvoices` | Query | `invoices:read` | Paginated invoice list |
| `getInvoice` | Query | `invoices:read` | Invoice with line items |
| `createInvoice` | Mutation | `invoices:create` | Create draft invoice |
| `updateInvoice` | Mutation | `invoices:update` | Update draft invoice |
| `sendInvoice` | Mutation | `invoices:send` | Mark as sent, notify client |
| `voidInvoice` | Mutation | `invoices:void` | Void invoice |

---

## Billing — Payments

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getPayments` | Query | `invoices:read` | Payment history |
| `recordPayment` | Mutation | `invoices:update` | Record payment against invoice |
| `refundPayment` | Mutation | `invoices:update` | Refund payment |

---

## Billing — Expenses

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getExpenses` | Query | `invoices:read` | Expense list |
| `createExpense` | Mutation | `invoices:create` | Record expense |
| `updateExpense` | Mutation | `invoices:update` | Update expense |
| `deleteExpense` | Mutation | `invoices:delete` | Delete expense |

---

## Notes

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getNotes` | Query | `cases:read` | Notes for case/client |
| `createNote` | Mutation | `cases:update` | Add note |
| `updateNote` | Mutation | `cases:update` | Edit note |
| `deleteNote` | Mutation | `cases:update` | Soft delete |

---

## Activities

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getActivities` | Query | Authenticated | Timeline for entity |
| `logActivity` | Internal | — | Called by services automatically |

---

## Calendar

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getCalendarEvents` | Query | Authenticated | Events by date range |
| `createCalendarEvent` | Mutation | Authenticated | Create event |
| `updateCalendarEvent` | Mutation | Authenticated | Update event |
| `deleteCalendarEvent` | Mutation | Authenticated | Delete event |

---

## Notifications

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getNotifications` | Query | Authenticated | User notifications |
| `markNotificationRead` | Mutation | Authenticated | Mark as read |
| `markAllNotificationsRead` | Mutation | Authenticated | Mark all read |

---

## Tags

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getTags` | Query | Authenticated | Org tags |
| `createTag` | Mutation | `settings:update` | Create tag |
| `assignTag` | Mutation | Authenticated | Tag entity |
| `removeTag` | Mutation | Authenticated | Untag entity |

---

## Settings

| Action | Method | Permission | Description |
|--------|--------|------------|-------------|
| `getSettings` | Query | `settings:read` | Org settings |
| `updateSetting` | Mutation | `settings:update` | Update setting |

---

## Route Handlers (External Only)

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/webhooks/stripe` | POST | Signature | Stripe payment webhooks |
| `/api/auth/[...nextauth]` | * | — | Auth.js handler |

---

## Cache Tags

Used with `revalidateTag()`:

| Tag | Invalidated When |
|-----|------------------|
| `cases` | Any case mutation |
| `case:{id}` | Specific case update |
| `clients` | Any client mutation |
| `client:{id}` | Specific client update |
| `invoices` | Any invoice mutation |
| `dashboard` | Stats-affecting changes |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Login | 5 attempts / 15 min |
| Search | 30 req / min |
| File upload | 10 req / min |
| Webhooks | 100 req / min |
