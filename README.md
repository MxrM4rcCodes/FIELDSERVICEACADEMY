# Field Service Academy

An independent web application for studying industrial printing and imaging workflows, safe diagnostic reasoning, color measurement, service documentation, and interview communication. The lessons and exercises are educational simulations—not manufacturer service instructions or a professional qualification.

> **Independence notice:** This project is not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies. Product names belong to their respective owners. Diagrams are conceptual and do not represent proprietary schematics.

## What is in the app

- **Two study paths:** a 14-day technical curriculum and a 3-day interview-preparation path. Lessons present instruction before an optional knowledge check; course completion is based on saved lesson assessment results.
- **Authenticated learner accounts:** registration and sign-in use server-managed sessions. Lesson progress, quiz attempts, notes, flashcard reviews, interview practice, scenario activity, and training records are stored in the database and associated with the signed-in user where applicable.
- **Dashboard and course:** track selection, course progress, recommendations, lesson reading, knowledge checks, and saved notes.
- **Interactive systems map and printer lab:** conceptual workflow and subsystem learning aids; actual equipment and customer configurations vary.
- **Troubleshooting practice:** a general safe-triage flow and 10 simulated branching cases. Scenario choices are checked against the active run state in a database transaction; stale or duplicate choices are rejected. A partial unique index limits each learner to one active run per scenario.
- **Color, ORIS, and METIS learning pages:** illustrative CIELAB/Delta E calculator, measurement-condition learning, product-family orientation, and simulated workflow exercises. ORIS requirement-check responses and scores are saved per account. Calculated examples are not instrument readings, product feature guarantees, or universal acceptance limits.
- **Flashcards and interview studio:** database-backed flashcard review and structured interview practice. The interview feedback rubric is a simple heuristic; it does not verify technical truth, candidate experience, or job readiness.
- **Service documentation and print center:** private, user-scoped educational training records plus printable learning worksheets. Neither is an official OEM, warranty, regulatory-compliance, or employer form.
- **Admin tools:** server-checked role access for the administration endpoints and pages.

## Run locally

Prerequisites: Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

The development command applies database migrations, seeds the learning content, and starts Next.js on port 3000. Without `DATABASE_URL`, the app uses a local PGlite database in `data/pgdata/`; that directory is local application data and should not be committed. Visit `http://localhost:3000` and create a learner account at `/register`.

Seeding does **not** create a shared demo learner or publish default passwords. For local development, the app supplies a development-only session secret when `JWT_SECRET` is unset; set a private secret for any shared environment.

Useful commands:

```bash
npm run dev                 # seed and start the development server
npm run seed                # apply seed content to the configured database
npm run db:migrate          # apply pending SQL migrations
npm run typecheck           # TypeScript check
npm run test                # unit and integration tests (excludes E2E)
npm run test:e2e            # start an isolated app/database and run HTTP acceptance tests
npm run build               # production build
npm run start               # serve the production build on 0.0.0.0:3000
```

`npm run test:e2e:only` runs the acceptance test file against an already-running test server. `npm run db:bootstrap-admin` creates an administrator from `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` environment variables; use a unique strong password of at least 12 characters and store it in a secret manager. It does not print the password. Public registration creates learner accounts, not administrators.

## Database and configuration

- For local development and isolated tests, PGlite persists to `PG_DATA_DIR` (or the default `data/pgdata/`). Test runners use separate data directories.
- When `DATABASE_URL` is set, the app connects to PostgreSQL and applies the checked-in SQL migrations. Set `DATABASE_SSL=true` when required by the provider; `DATABASE_SSL_REJECT_UNAUTHORIZED` defaults to `true`. `DATABASE_POOL_SIZE` optionally controls the pool size.
- `DATABASE_URL` is required when `NODE_ENV=production`; the app does not fall back to an ephemeral local database in production.
- Set `JWT_SECRET` to a private random value of at least 32 characters in production. Session cookies are HTTP-only and use the secure flag in production.
- Keep database URLs, signing secrets, and administrator credentials out of source control. Backups, retention, HTTPS, monitoring, and provider-specific deployment configuration are operational responsibilities and are not performed by this repository.

## Safety, technical scope, and sources

Safety education emphasizes stop-work, authorization, and the difference between a stop command and energy isolation. A generic page in this app is not a site-specific LOTO procedure, emergency plan, PPE selection guide, or authorization to service equipment. Follow the applicable employer program, current equipment documentation, and qualified site guidance.

Technical content separates observations from hypotheses and includes source/confidence notes. Public product pages establish only the information they publish; they do not establish an installed system's model, options, software version, integration, service method, or job-specific requirements. Scanner and printer families are not treated as interchangeable. A clean static print test does not rule out every printhead or dynamic fault.

Selected public references used for learning include OSHA 29 CFR 1910.147, ISO 13655, the CIEDE2000 formula literature, IETF RFC 9293, and public CGS ORIS/METIS product overviews. The app's references and lessons note the limits of those sources. Consult the full current source and applicable manufacturer/site documentation for real work.

## Project layout

- `src/app/` — Next.js pages and authenticated API routes.
- `src/lib/db/migrations/` — versioned SQL schema migrations.
- `src/lib/db/seed-data/` — curriculum, scenario, flashcard, interview, and reference content.
- `src/lib/db/seed.ts` — idempotent learning-content seed routine.
- `tests/` — database, authentication, color, competency, scenario, and HTTP acceptance tests.
- `scripts/` — development, migration, seed, admin-bootstrap, and E2E helpers.

## Deployment note

A production build or deployment is not implied by this README. Before exposing an instance to users, configure a managed, persistent PostgreSQL service and production secrets, review authentication and authorization for the intended deployment, establish backups and data-retention policies, and verify build, tests, migrations, and operations in that environment.
