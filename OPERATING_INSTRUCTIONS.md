# Field Service Academy — Operating Instructions

This guide covers how to use and locally operate the independent learning application in this repository. It is not a manufacturer manual, an employer procedure, a safety plan, or a professional qualification.

> **Independence notice:** This platform is not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies. Product names are used for educational orientation. Diagrams and equipment examples are conceptual.

## 1. Start the application

### Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

The development command applies pending database migrations, seeds the course content, and starts the Next.js development server on port 3000. With no `DATABASE_URL`, local PGlite data is stored under `data/pgdata/` (or the directory specified by `PG_DATA_DIR`). Keep that directory out of source control.

Open `http://localhost:3000`, choose **Create account**, and register a learner account. The seed routine does not create published demo credentials. Local development has a development-only fallback session secret; do not use that fallback in a shared or production environment.

### PostgreSQL and production configuration

When `DATABASE_URL` is set, the application connects to PostgreSQL and applies versioned SQL migrations. `DATABASE_URL` is required when `NODE_ENV=production`; the production app will not substitute local PGlite storage.

Configure a private `JWT_SECRET` of at least 32 characters in production. Optional database settings are `DATABASE_SSL=true`, `DATABASE_SSL_REJECT_UNAUTHORIZED=false` only when explicitly required by a trusted provider, `DATABASE_POOL_SIZE`, and `PG_DATA_DIR` for local PGlite use. Store secrets in the deployment secret manager; do not commit them or paste them into tickets.

A production build, hosting account, managed database, backup plan, or deployment is not created by this repository. Configure and verify those items for the intended environment before exposing the service to users.

## 2. Learner workflow

### Sign-in and saved learning

1. Register at `/register` or sign in at `/login`.
2. The dashboard at `/` shows the selected track, saved lesson completion, recommendations, recent learning activity, and other study summaries available for the account.
3. Use **Resume Learning** or the course navigation to open a lesson. Changing a profile setting such as the active track is saved to the signed-in account.
4. Lesson reading can be saved as in-progress. Read the instructional sections and practice prompts at your own pace; the assessment is available when you are ready.
5. Submit the lesson knowledge check to save an attempt. A passing score is 80% or higher; only a passing saved knowledge check marks that lesson complete. Review the feedback before retrying.
6. Personal notes, lesson progress, quiz attempts, flashcard reviews, interview practice, and scenario runs are associated with the authenticated account. A practice score is a learning signal, not a measure of professional competence.

### Study paths and learning pages

- **14-Day Course (`/course`)** — the self-paced curriculum, with lesson pages at `/lessons/[slug]`.
- **3-Day Bootcamp (`/course?track=bootcamp`)** — a shorter interview-preparation path that groups selected curriculum lessons by bootcamp day. The Day 1 company/product-family association and Day 3 equipment-safety lesson slug are stable seed content; do not replace those identities when changing recommendations or course links.
- **Systems Map (`/systems-map`)** — interactive, conceptual workflow nodes and practice questions. The map is not a proprietary product schematic or proof of a specific installed integration.
- **Printer Lab (`/printer-lab`)** — conceptual printer-system learning areas. Use current model-specific documentation for any real equipment detail or action.
- **Troubleshooting (`/troubleshooting`)** — general symptom scoping, evidence limits, stop-work decisions, and escalation practice. It does not provide repair or energy-isolation steps.
- **Scenarios (`/scenarios`)** — 10 simulated branching cases. Choices are recorded against the learner's active run; restarting retains the old run as abandoned history. A case outcome is not a real equipment diagnosis or proof that a repair was performed.
- **Color Lab (`/color-lab`)** — interactive illustrative CIELAB values, Delta E calculations, substrate examples, and measurement-condition learning. The on-screen coordinates and swatches are not instrument readings. A Delta E value is not, by itself, an acceptance decision; use the agreed target, substrate, conditions, method, and tolerance.
- **METIS (`/metis`) and ORIS (`/oris`)** — public product-family orientation and simulated workflow/requirement exercises. ORIS requirement-check responses and scores are saved to the signed-in account. Verify any current model, version, feature, or integration claim against an appropriate primary source.
- **Flashcards (`/flashcards`)** — review cards by category or search and save a review response.
- **Interview Studio (`/interview`)** — practice responses and review a disclosed heuristic rubric. It does not verify technical truth, work history, qualification, or hiring readiness.
- **Service Tickets (`/service-tickets`)** — create and edit private, account-scoped training records, then print the selected record. Use simulated or sanitized examples; do not enter passwords, tokens, or unnecessary customer data. The form is not an official OEM, employer, warranty, audit-certified, or compliance document.
- **Print Center (`/print-center`)** — select and print the educational worksheets. The safety sheet is a stop-work boundary summary, not a site-specific LOTO sequence or emergency response plan.

## 3. Safety and technical-content boundaries

For any real equipment or workplace concern, follow the employer/site safety program, current equipment documentation for the exact model and configuration, and qualified authorized guidance. A stop button or emergency stop does not by itself establish hazardous-energy isolation. This application does not grant service authorization, select PPE, prescribe service-menu access, or provide electrical, chemical, mechanical, calibration, cleaning, or parts-replacement procedures.

The lessons distinguish reports, observations, hypotheses, tests, and verified outcomes. For example, a clean static print pattern does not rule out every printhead or dynamic fault; banding does not identify a single cause; and device families can differ in heads, inks, curing, options, and workflows. Do not generalize one model's feature or procedure to another.

Source notes describe what a citation supports and what it does not. Public portfolio pages are not feature matrices, service manuals, or records of a customer's installed configuration. ISO references and formula descriptions do not set universal customer acceptance tolerances. Use the full current source and job/site-specific requirements when appropriate.

## 4. Service-record and account handling

Server routes resolve the signed-in identity and scope learner records to that user. Do not treat a user-supplied record ID as authorization to view or change someone else's information. Administrator privileges are checked on the server; changing client-side text or a URL does not grant an administrator role.

Use training aliases and non-sensitive content in learning exercises. Do not use this independent application as an employer's source of record, service log, safety certification, or customer-document exchange. Follow the data-handling and retention rules of the organization responsible for any real customer information.

## 5. Administrator operations

### Create an administrator

Public registration creates a learner account only. After configuring the database, create an administrator through the protected bootstrap command:

```bash
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD='a-unique-secret-of-at-least-12-characters' \
ADMIN_NAME='Academy Administrator' \
npm run db:bootstrap-admin
```

Supply these values through a secure local environment or secret manager, not through a committed file. The command does not print the password. Existing accounts are not silently promoted if an email already exists.

### Admin console

An administrator can use `/admin` to review available platform counts, registered accounts, and content revision history, and to revise lesson title, summary, and estimated study time. The API verifies the current database role on the server. Learner accounts cannot use those privileged endpoints. Seeded lesson bodies and question content are maintained in `src/lib/db/seed-data/`; edits that conflict with the seed should be made and reviewed there, then seeded deliberately.

### Migrations and seed content

```bash
npm run db:migrate
npm run seed
```

Migrations are versioned under `src/lib/db/migrations/`. Seeding inserts or updates course content and scenario graphs; it does not create learner accounts. Review changes to seed files before reseeding a database that contains in-progress learner activity.

## 6. Verification commands

```bash
npm run typecheck
npm run test          # unit and integration tests, excluding E2E
npm run test:e2e      # isolated database and local HTTP acceptance tests
npm run build
```

Run and report the commands against the current checkout; historical test results do not establish the status of later changes. Tests do not replace a security, safety, technical-content, or deployment review.

## 7. Useful project locations

- Application pages and API routes: `src/app/`
- Authentication and authorization helpers: `src/lib/auth.ts`, `src/lib/accounts.ts`, `src/proxy.ts`
- Database connection and transactions: `src/lib/db/index.ts`
- SQL migrations: `src/lib/db/migrations/`
- Curriculum and learning content: `src/lib/db/seed-data/`
- Seed routine: `src/lib/db/seed.ts`
- Automated tests: `tests/`
- Development, migration, seed, and E2E scripts: `scripts/`
