# Contributing

Thank you for contributing to Legal CRM. This guide covers the workflow for code contributions.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local PostgreSQL)
- Git

## Getting Started

```bash
git clone <repo-url>
cd legal-crm
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Branch Strategy

```
main          → production
develop       → staging / integration
feat/*        → new features
fix/*         → bug fixes
chore/*       → tooling, dependencies
docs/*        → documentation
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Examples**:
```
feat(cases): add case timeline with activity feed
fix(billing): correct tax calculation rounding
docs(api): document invoice server actions
test(auth): add cross-tenant isolation tests
```

## Pull Request Process

1. Create feature branch from `develop`
2. Implement changes following [CodingStandards.md](./CodingStandards.md)
3. Ensure all checks pass locally:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
4. Push branch and open PR against `develop`
5. Fill out PR template:
   - Summary of changes
   - Test plan checklist
   - Screenshots (for UI changes)
   - Database migration notes (if applicable)
6. Request review from at least one team member
7. Address review feedback
8. Squash merge after approval

## Code Review Guidelines

### As Author
- Keep PRs focused and <400 lines when possible
- Self-review before requesting review
- Include tests for business logic
- Update documentation if schema/API changed

### As Reviewer
- Check architecture layer compliance
- Verify auth/permission checks on new actions
- Confirm organizationId scoping on queries
- Review UI for loading/empty/error states
- Check for TypeScript `any` types

## Testing Requirements

| Change Type | Required Tests |
|-------------|----------------|
| New service/repository | Unit tests |
| New Server Action | Unit + permission denial |
| New UI component | RTL test for critical paths |
| Bug fix | Regression test |
| Critical user flow | E2E update |

## Database Changes

1. Modify `src/prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name descriptive_name`
3. Update `Database.md` if entity relationships changed
4. Update seed if new required data
5. Include migration in PR

## Adding a New Feature

1. Create feature module: `src/features/[name]/`
2. Follow feature anatomy (ui, actions, hooks, schemas, types, index.ts)
3. Add repository in `src/repositories/`
4. Add service in `src/services/` if business logic needed
5. Add routes in `src/app/(dashboard)/`
6. Add permissions to seed
7. Document actions in `API.md`
8. Add Cursor rule updates if new patterns introduced

## UI Contributions

- Follow design system in `.cursor/rules/05_ui_design.mdc`
- Dark mode first
- Include skeleton, empty, and error states
- Test responsive breakpoints
- Verify keyboard navigation

## Security

- Never commit `.env` or credentials
- All new endpoints must have auth + permission checks
- Report security issues privately to the team lead

## Questions?

Open a discussion or reach out to the tech lead.
