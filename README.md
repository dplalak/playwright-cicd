# MERN App with Automated Testing

Full-stack MERN application (MongoDB, Express, React, Node.js) with a focus on automated testing using Playwright

## Tech Stack

- Frontend: React 17, Redux, React Router, Axios
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB
- Testing: Playwright
- CI/CD: GitHub Actions + GitHub Pages (Playwright HTML reports)
- Containers: Docker Compose

## Project Structure

```text
.
|- client/                 # React app
|- server/                 # Express API
|- playwright/             # Tests, fixtures, test-data, config files
|- .github/workflows/      # CI workflows
|- docker-compose.yml      # Local stack (mongo + server + client)
`- package.json            # Root scripts
```

# Usage (run fullstack app on your machine)

## Prerequisites

- Node.js 20+
- npm 9+
- Docker Desktop

## Environment Variables

### 1) Root `.env` (used by Docker Compose)

Create a file `.env` in the repository root:

```env
MONGODB_URI=mongodb://mongo:27017/mern
JWT_SECRET=your-strong-jwt-secret
```

## Run the Application

Run everything with Docker Compose:

```bash
npm ci
docker compose up -d --build
```

Services:
- Client: `http://localhost:3000`
- API: `http://localhost:8000`
- Health check endpoint: `http://localhost:8000/ping`

Stop:

```bash
docker compose down
```

## Playwright Tests

### What is covered

- Login scenarios:
  - valid credentials
  - invalid email
  - invalid password
- Registration scenarios:
  - valid registration
  - password mismatch
  - existing email
- Smoke subset:
  - tagged with `@Smoke` for fast confidence checks

### Test architecture

- `playwright/tests/` - test specs
- `playwright/pages/` - page object models
- `playwright/fixtures/fixtures.ts` - reusable fixtures (including API setup)
- `playwright/test-data/testUsers.json` - static test data
- `playwright/playwright.config.ts` - projects

### Using Faker in tests

Faker is used in `playwright/tests/registration.spec.ts` to generate unique, realistic values per run:
- `faker.person.firstName()` and `faker.person.lastName()` for profile inputs
- `faker.internet.email()` to avoid collisions in signup tests
- `faker.internet.password()` for password flows

### Environment required by tests

Required for full test reliability:
- `BASE_URL` (default `http://localhost:3000`)
- `API_URL` (usually `http://localhost:8000`)
- `EMAIL`
- `PASSWORD`

Install browser dependencies:

```bash
npx playwright install --with-deps chromium
```

Run all tests:

```bash
npm run test:all
```

Run smoke tests only:

```bash
npm run test:smoke
```

Run by project:

```bash
npm run test:desktop
npm run test:mobile
```

Run selected suites:

```bash
npm run test:login
npm run test:registration
```

### Recommended local test flow

1. Start full stack with Docker:
   - `docker compose up -d --build`
2. Verify services:
   - client on `http://localhost:3000`
   - api on `http://localhost:8000/ping`
3. Run smoke first:
   - `npm run test:smoke`
4. Run full matrix locally:
   - `npm run test:chromium`
   - `npm run test:mobile`

### Debugging failed tests

- Use UI mode for step-by-step diagnosis
- Inspect generated `playwright-report/`
- Re-run only one suite (`login` or `registration`) to isolate failures

### Playwright linting safeguards

Before pushing changes, run:

```bash
npm run lint:playwright
```

What this lint checks:
- Scope: `playwright/tests/**/*.ts` (test specs)
- Ignores: `node_modules/`, `dist/`, `playwright-report/`, `test-results/`
- `no-unused-vars` as warning
- `quotes` with single quotes (template literals allowed)
- `no-restricted-properties` as error to block focused runs (`test.only`, `describe.only`, `it.only`)

This lint is also executed in CI before tests, so focused tests cannot be merged by accident.

## CI/CD Overview (Testing Pipeline)

Workflow in `.github/workflows/ci.yaml`:
- Runs tests checks automatically on:
  - `push` to `release/*`
  - `pull_request` to `master`, `release/*`, `develop`
- Starts Docker stack in CI
- Executes Playwright tests in a matrix:
  - Desktop Chrome
  - Mobile Chrome
- Uploads Playwright artifacts
- Publishes reports to GitHub Pages

Required GitHub Secrets for tests:
- `JWT_SECRET`
- `EMAIL`
- `PASSWORD`