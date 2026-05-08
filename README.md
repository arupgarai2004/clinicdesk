# ClinicDesk

ClinicDesk is an Nx monorepo for clinic operations and appointment management. The workspace currently includes:

- a NestJS API backed by Prisma and PostgreSQL
- an Angular clinic dashboard for staff users
- a Next.js patient app scaffold
- shared Angular data-access, API, model, and layout libraries

## Workspace overview

### Applications

- `apps/api`
  NestJS backend running on port `3333`
- `apps/clinic-dashboard`
  Angular standalone dashboard for clinic staff
- `apps/patient-web`
  Next.js patient-facing app scaffold

### Shared libraries

- `libs/api`
  Angular `HttpClient` services for appointments, clinics, and AI suggestions
- `libs/data-access`
  NgRx Signals stores for appointments, clinics, and AI suggestion state
- `libs/shared/models`
  Shared TypeScript models, DTOs, filters, and store state interfaces
- `libs/ui-layout`
  Shared Angular layout components such as header and footer

## Current architecture

### Appointment flow

```text
Angular dashboard
  -> libs/data-access AppointmentStore
  -> libs/api AppointmentsService
  -> /api/appointments
  -> NestJS AppointmentsModule
  -> PrismaService
  -> PostgreSQL / Neon
```

### Clinic master flow

```text
Angular dashboard
  -> libs/data-access ClinicStore
  -> libs/api ClinicService
  -> /api/clinics
  -> NestJS ClinicsModule
  -> PrismaService
  -> PostgreSQL / Neon
```

### AI suggestion flow

```text
Angular dashboard
  -> libs/data-access AiStore
  -> libs/api AiService
  -> /api/ai/suggestAppointmentDetails
  -> NestJS AiModule
  -> Google Gemini
```

## Backend

The API entrypoint is `apps/api/src/main.ts`.

Current backend modules:

- `AppointmentsModule`
- `ClinicsModule`
- `AiModule`

### Implemented appointment endpoints

- `GET /appointments`
  List appointments with optional `clinicId`, `date`, `status`, and `search` filters
- `GET /appointments/:id`
  Get one appointment
- `POST /appointments`
  Create a new appointment
- `PUT /appointments/:id`
  Update an existing appointment
- `PUT /appointments/:id/status`
  Update only appointment status
- `DELETE /appointments/:id`
  Delete an appointment

Appointment responses now include a lightweight clinic relation:

```json
{
  "clinic": {
    "id": "...",
    "name": "ClinicDesk Amsterdam Central"
  }
}
```

### Implemented clinic endpoints

- `GET /clinics`
  List clinics with optional search filters
- `GET /clinics/:id`
  Get one clinic
- `POST /clinics`
  Create a clinic
- `PUT /clinics/:id`
  Update a clinic
- `DELETE /clinics/:id`
  Delete a clinic

### Implemented AI endpoint

- `POST /ai/suggestAppointmentDetails`
  Returns:

```json
{
  "suggestedDuration": 30,
  "prepNotes": "Please check the patient history before the appointment.",
  "confidence": "low"
}
```

Notes about the current AI implementation:

- Gemini is used from the NestJS backend, not directly from Angular
- the service tries Gemini models in sequence
- if Gemini fails, the current implementation falls back to a default suggestion payload

## Frontend

The Angular clinic dashboard is the main working UI in this repository.

### Current Angular routes

- `/appointment-list`
- `/appointment-details/:id`
- `/manage-appointment`
- `/manage-appointment/:id`
- `/weekly-calendar`
- `/settings`

### Current page status

#### Appointment list

This is one of the most complete screens today.

Implemented features:

- loads appointments from the API
- client-side filters for:
  - patient name
  - clinic
  - reason
  - date
  - status
- CDK virtual scrolling
- responsive Bootstrap-based layout
- row navigation to appointment details

#### Appointment details

Implemented features:

- loads a selected appointment by id
- shows core details such as patient, clinic, reason, status, and schedule
- supports appointment actions from the page:
  - update
  - cancel
  - delete
- AI suggestion section is loaded on demand and cached in store during the current session

#### Manage appointment

Implemented as a create/edit form.

- `/manage-appointment`
  create mode
- `/manage-appointment/:id`
  edit mode

Current features:

- loads clinic options from the clinic store
- validates required fields
- validates date ordering
- creates appointments
- updates appointments

#### Settings

The settings page is now a simple operational entry screen for:

- clinic management entry points
- appointment management entry points
- record counts for clinics and appointments

#### Weekly calendar

Route exists, but this page is still early compared to the appointment list and details flow.

### Next.js patient app

`apps/patient-web` is wired into the workspace and has Nx targets for build, lint, dev, start, and test.

At the moment it is still mostly scaffold/starter content rather than a completed patient booking experience.

## Shared library responsibilities

### `libs/api`

Current Angular services:

- `AppointmentsService`
- `ClinicService`
- `AiService`

These wrap dashboard HTTP calls to the backend.

### `libs/data-access`

Current stores:

- `AppointmentStore`
- `ClinicStore`
- `AiStore`

These stores manage client-side loading, selected records, and transient UI state.

### `libs/shared/models`

Contains shared interfaces and DTOs such as:

- `Appointment`
- `Clinic`
- `CreateAppointmentDto`
- `UpdateAppointmentDto`
- `ClinicCreateDto`
- `ClinicUpdateDto`
- `AiAppointmentSuggestRequest`
- `AiAppointmentSuggestResponse`
- filter/query types
- store state types

## Database design

Prisma schema is at `apps/api/prisma/schema.prisma`.

Prisma config is at `apps/api/prisma.config.ts`.

### Database provider

- PostgreSQL
- Prisma adapter: `@prisma/adapter-pg`
- current development setup targets Neon PostgreSQL

### Prisma models

#### `Clinic`

Clinic master table.

Fields:

- `id`
- `name`
- `address`
- `email`
- `phoneNumber`
- `timezone`
- `workingHours` (`Json`)
- `createdAt`
- `updatedAt`

Relations:

- one-to-many with `Appointment`
- one-to-many with `Availability`

#### `Appointment`

Main appointment transaction table.

Fields:

- `id`
- `clinicId`
- `patientName`
- `patientEmail`
- `reason`
- `startTime`
- `endTime`
- `status`
- `cancelToken`
- `aiSuggestion`
- `createdAt`
- `updatedAt`

Indexes:

- `@@index([clinicId, startTime])`
- `@@index([clinicId, status])`

#### `Availability`

Weekly clinic availability.

Fields:

- `id`
- `clinicId`
- `dayOfWeek`
- `startTime`
- `endTime`
- `isOpen`

Constraint:

- `@@unique([clinicId, dayOfWeek])`

#### `AppStatus`

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

## Seed data

`apps/api/prisma/seed.ts` currently seeds:

- `10` clinics
- `1000` appointments per clinic
- `10,000` appointments total
- weekday availability for each clinic

The seeded clinic master data includes:

- clinic name
- address
- email
- phone number
- timezone
- working hours JSON

## Local development

### Prerequisites

- Node.js
- npm
- a PostgreSQL / Neon connection string
- Gemini API key for AI suggestions

### Environment

The API expects environment variables in `apps/api/.env`.

Typical values:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash
```

### Install dependencies

```bash
npm install
```

### Run the API

```bash
npm exec nx serve api
```

API URL:

- `http://localhost:3333`

### Run the Angular dashboard

```bash
npm exec nx serve clinic-dashboard
```

Dashboard URL:

- `http://localhost:4200`

The dashboard uses `apps/clinic-dashboard/proxy.conf.json` so `/api` calls can reach the backend.

### Run the Next.js patient app

```bash
npm exec nx dev patient-web
```

Typical URL:

- `http://localhost:3000`

## Database workflow

If you change Prisma schema:

```bash
npx prisma db push
npx prisma generate
```

If you need fresh local seed data:

```bash
npx prisma db seed
```

In this workspace, Prisma commands are usually run from `apps/api` when working with the local Prisma config there.

## Useful Nx commands

List projects:

```bash
npx nx show projects
```

Run API:

```bash
npx nx serve api
```

Run Angular dashboard:

```bash
npx nx serve clinic-dashboard
```

Run patient app:

```bash
npx nx dev patient-web
```

Lint dashboard:

```bash
npx nx lint clinic-dashboard
```

Test dashboard:

```bash
npx nx test clinic-dashboard
```

Build API:

```bash
npx nx build api
```

Build dashboard:

```bash
npx nx build clinic-dashboard
```

## Current project summary

ClinicDesk today is no longer just a starter Nx workspace. The backend supports appointments, clinic master data, and AI-assisted suggestions; the Angular dashboard now supports list, detail, create, and update flows for appointments; and the seed data is scaled to a realistic multi-clinic setup with `10,000` appointments.

The patient-facing Next.js app is still the least developed part of the repository and should be treated as future-facing scaffolding for now.
