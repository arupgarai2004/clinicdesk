# ClinicDesk

ClinicDesk is an Nx monorepo for a clinic appointment workflow. The repository currently contains a NestJS API, an Angular clinic dashboard, a Next.js patient-facing app, and shared libraries for models, API access, state, and layout components.

## What is in the repo

- `apps/api`
  NestJS backend with Prisma and PostgreSQL. Exposes appointment endpoints and an AI suggestion endpoint.
- `apps/clinic-dashboard`
  Angular dashboard for clinic staff. It loads appointment data from the API and renders the main admin experience.
- `apps/patient-web`
  Next.js patient-facing app. This app is present in the workspace, but its main page is still scaffolded starter content rather than a full booking flow.
- `libs/shared/models`
  Shared TypeScript models for appointments and AI request/response shapes.
- `libs/api`
  Angular HTTP client service used by the dashboard.
- `libs/data-access`
  NGRX Signals store that coordinates appointment loading for the dashboard.
- `libs/ui-layout`
  Shared Angular layout components such as header and footer.

## Architecture

The implemented request flow today is:

```text
Angular clinic dashboard
  -> libs/data-access AppointmentStore
  -> libs/api AppointmentsService
  -> /api/appointments
  -> NestJS appointments module
  -> Prisma service
  -> PostgreSQL
```

AI-assisted appointment suggestions follow a similar path:

```text
Client
  -> /ai/suggestAppointmentDetails
  -> NestJS AI module
  -> Google Gemini
  -> JSON suggestion response
```

### App responsibilities

#### API

The API is a NestJS application bootstrapped from `apps/api/src/main.ts` and listens on port `3333`. CORS is enabled, environment variables are loaded from `apps/api/.env`, and Prisma is registered through a dedicated `PrismaModule`.

Main modules:

- `AppointmentsModule`
  Handles appointment listing, creation, and status updates.
- `AiModule`
  Generates scheduling suggestions such as recommended duration and preparation notes.

Implemented endpoints:

- `GET /appointments`
  Returns appointments with optional `clinicId`, `date`, `status`, and `search` filters.
- `POST /appointments`
  Creates an appointment.
- `PUT /appointments/:id/status`
  Updates an appointment status.
- `POST /ai/suggestAppointmentDetails`
  Returns AI-generated duration and prep guidance.

#### Clinic dashboard

The clinic dashboard is an Angular application in `apps/clinic-dashboard`. It uses standalone components, Angular routing, hydration support, and an `/api` proxy to the backend running on `http://localhost:3333`.

Current routes:

- `/appointment-list`
- `/appointment-details/:id`
- `/weekly-calendar`
- `/settings`

Current implementation status:

- `appointment-list` is the most complete screen. It loads appointments through a signal store and renders them with Angular CDK virtual scrolling for large result sets.
- `appointment-details`, `weekly-calendar`, and `settings` routes exist, but their components are currently placeholders.

#### Patient web

The patient app is a Next.js application in `apps/patient-web`. The project is wired into Nx and has build, dev, start, lint, and test targets. At the moment, the main page still contains default starter content, so the patient booking experience is not yet implemented in the UI.

## Frontend design and UI structure

The current UI design is functional and scaffold-first:

- The Angular dashboard is the main working frontend.
- Shared Angular layout pieces live in `libs/ui-layout`.
- Dashboard state is managed with `@ngrx/signals` in `libs/data-access`.
- The appointments list focuses on performance with CDK virtual scrolling.
- The Next.js patient app is still in starter state and should be treated as a foundation for future patient-facing design work.

If you are onboarding to the project, it is best to think of ClinicDesk today as an API-first admin dashboard with an early-stage patient portal.

## Database design

Prisma schema lives at `apps/api/prisma/schema.prisma`, and Prisma config lives at `apps/api/prisma.config.ts`.

### Database

- Provider: PostgreSQL
- Runtime adapter: `@prisma/adapter-pg`
- Current environment points to Neon PostgreSQL

### Data model

#### `Clinic`

Stores clinic metadata and schedule defaults.

- `id`
- `name`
- `email` (unique)
- `timezone`
- `workingHours` as JSON
- timestamps

Relations:

- one-to-many with `Appointment`
- one-to-many with `Availability`

#### `Appointment`

Core booking entity.

- `id`
- `clinicId`
- `patientName`
- `patientEmail`
- `reason`
- `startTime`
- `endTime`
- `status`
- `cancelToken` (unique, optional)
- `aiSuggestion` as JSON
- timestamps

Indexes:

- `(clinicId, startTime)` for calendar queries
- `(clinicId, status)` for status filtering

#### `Availability`

Weekly operating hours per clinic and weekday.

- `id`
- `clinicId`
- `dayOfWeek`
- `startTime`
- `endTime`
- `isOpen`

Constraint:

- unique per `(clinicId, dayOfWeek)`

#### `AppStatus`

Appointment status enum values:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

### Seed data

`apps/api/prisma/seed.ts` creates:

- a demo clinic in Amsterdam
- weekday availability
- 100 sample appointments with mixed statuses

## Shared libraries

### `libs/shared/models`

Defines shared interfaces used across the stack, including:

- `Appointment`
- `AppointmentFilters`
- `AppointmentQuery`
- `AppointmentState`
- `AiAppointmentSuggestRequest`
- `AiAppointmentSuggestResponse`

### `libs/api`

Contains the Angular service that calls the appointment API using `HttpClient`.

### `libs/data-access`

Contains `AppointmentStore`, implemented with `signalStore`, which:

- manages loading state
- fetches appointment data
- stores the appointment list for dashboard screens

## Local development

### Prerequisites

- Node.js
- npm
- PostgreSQL connection string
- Gemini API key for AI suggestions

### Environment

The API reads environment variables from `apps/api/.env`.

Required values:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... # optional
GEMINI_API_KEY=your-key
```

### Install dependencies

```bash
npm install
```

### Start the backend

```bash
npm exec nx serve api
```

The API runs on `http://localhost:3333`.

### Start the clinic dashboard

```bash
npm exec nx serve clinic-dashboard
```

The dashboard runs on `http://localhost:4200` and proxies `/api` requests to the backend.

### Start the patient app

```bash
npm exec nx dev patient-web
```

The patient app runs on the Next.js dev server, typically `http://localhost:3000`.

## Useful Nx commands

```bash
npm exec nx show projects
npm exec nx graph
npm exec nx build api
npm exec nx build clinic-dashboard
npm exec nx build patient-web
npm exec nx test patient-web
npm exec nx test clinic-dashboard
npm exec nx run-many -t build
```

## Testing

The workspace includes:

- unit and integration-style tests for apps and libraries
- Playwright e2e projects for `clinic-dashboard` and `patient-web`

Examples:

```bash
npm exec nx test clinic-dashboard
npm exec nx test patient-web
npm exec nx e2e clinic-dashboard-e2e
npm exec nx e2e patient-web-e2e
```

## Current state summary

Implemented well today:

- NestJS API with Prisma/Postgres integration
- clinic-facing Angular dashboard shell
- appointment list retrieval and rendering
- shared type models
- AI suggestion endpoint

Partially implemented or placeholder:

- patient-facing Next.js booking experience
- appointment details screen
- weekly calendar screen
- settings screen

## Monorepo structure

```text
apps/
  api/
  clinic-dashboard/
  clinic-dashboard-e2e/
  patient-web/
  patient-web-e2e/
libs/
  api/
  data-access/
  shared/
    constants/
    models/
  ui-layout/
```
