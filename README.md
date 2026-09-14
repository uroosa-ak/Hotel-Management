# LuxuryStay Hospitality — Hotel Management System

A MERN hotel management system for LuxuryStay Hospitality: a public booking website for
guests and a role-based staff portal for running the hotel.

The public site uses the **Motela** hotel template (its theme, typography, header/footer and
room-card layout), driven by live data from the application's own API.

---

## Technology

| Layer    | Stack |
|----------|-------|
| Frontend | React 19, Vite, React Router, Tailwind (utilities only), Apache ECharts |
| Backend  | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Auth     | JWT (httpOnly cookie + bearer token), bcrypt password hashing |
| Media    | Cloudinary (configured via environment variables) |

---

## Getting started

### 1. Prerequisites

- Node.js 18 or newer
- A MongoDB instance (local `mongod`, or a MongoDB Atlas cluster)

### 2. Backend

```bash
cd server
npm install
cp .env.example .env     # then fill in the values (see below)
npm run seed             # creates the demo accounts and rooms
npm run dev              # http://localhost:5000
```

`server/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/hotel-management
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The server refuses to start without `MONGO_URI` and `JWT_SECRET` — it will not fall back to
an insecure default.

### 3. Frontend

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

`client/.env` (optional — this is the default):

```
VITE_API_URL=http://localhost:5000/api
```

---

## Demo accounts

Created by `npm run seed`. Use `npm run seed -- --reset` to wipe users, rooms, bookings and
guests before reseeding.

| Role         | Email                         | Password               |
|--------------|-------------------------------|------------------------|
| Admin        | admin@luxurystay.com          | `AdminPassword123!`    |
| Manager      | manager@luxurystay.com        | `ManagerPassword123!`  |
| Receptionist | reception@luxurystay.com      | `StaffPassword123!`    |
| Housekeeping | housekeeping@luxurystay.com   | `HousekeepingPass123!` |
| Guest        | guest@luxurystay.com          | `GuestPassword123!`    |

The sign-in page has one-click buttons for each of these.

---

## Roles and access

Every rule below is enforced in the API, not only in the UI — requesting a page or endpoint
directly without the right role returns 401/403.

| Area                     | Admin | Manager | Receptionist | Housekeeping | Guest |
|--------------------------|:-----:|:-------:|:------------:|:------------:|:-----:|
| Staff portal             | ✔ | ✔ | ✔ | ✔ | — |
| Rooms: view              | ✔ | ✔ | ✔ | ✔ | ✔ (public) |
| Rooms: create / delete   | ✔ | ✔ | — | — | — |
| Rooms: update status     | ✔ | ✔ | — | ✔ | — |
| Reservations             | ✔ | ✔ | ✔ | — | own only |
| Check-in / check-out     | ✔ | ✔ | ✔ | — | — |
| Guest records            | ✔ | ✔ | ✔ | — | — |
| Payments & audit         | ✔ | ✔ | ✔ (payments) | — | — |
| Housekeeping/maintenance | ✔ | ✔ | — | ✔ | report only |
| Staff & user management  | ✔ | ✔ | — | — | — |
| Roles/permissions        | ✔ | — | — | — | — |

---

## API overview

All routes are prefixed with `/api`.

| Area | Routes |
|------|--------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `GET /user/all`, `GET|PUT /user/profile`, `PUT /user/change-password`, `PUT /user/:id`, `PATCH /user/:id/toggle-status`, `DELETE /user/:id` |
| Rooms | `GET /rooms`, `GET /rooms/:id`, `POST /rooms`, `PUT /rooms/:id`, `DELETE /rooms/:id` |
| Bookings | `POST /booking`, `GET /booking`, `GET /booking/my/bookings`, `GET /booking/:id`, `PUT /booking/:id`, `PATCH /booking/:id/status`, `PATCH /booking/:id/cancel`, `DELETE /booking/:id` |
| Guests | `GET|POST /guest`, `PUT|DELETE /guest/:id` |
| Check-in/out | `GET|POST /checkinout`, `GET /checkinout/active/list`, `PUT /checkinout/:id/checkout`, … |
| Housekeeping | `GET|POST /maintenance`, `PUT|DELETE /maintenance/:id` |
| Payments | `GET|POST /payment`, `GET|POST /paymentaudit` |
| Services | `GET|POST /service`, `PUT|DELETE /service/:id` |
| Contact | `POST /contact` (public), `GET|PUT /contact` (staff) |
| Other | `/feedback`, `/promotions`, `/taxes`, `/loyalty`, `/inventory`, `/notifications`, `/roles`, `/roomphotos` |
| Health | `GET /api/health` |

Booking rules enforced server-side: the guest is taken from the JWT (never the request
body), overlapping stays for the same room are rejected with `409`, and the total is
calculated from the room rate × nights rather than trusting the client.

---

## Testing

With both servers running and the database seeded:

```bash
cd client
npx playwright install chromium   # first time only
npm run test:e2e                  # full role + booking walkthrough
npm run test:responsive           # mobile/tablet layout check
```

`test:e2e` signs in as every role, books a room as a guest, confirms the booking appears in
My Bookings and in the staff portal, and checks that a guest cannot reach `/admin`.
Screenshots are written to `client/tests/screenshots`.

Also available: `npm run lint` and `npm run build` in `client`.

---

## Project layout

```
client/
  public/wp-mirror/      Motela template assets (CSS, fonts, images, vendor JS)
  public/images/         Room and header photography
  src/components/template/   Template header, footer, room card, page hero, legacy renderer
  src/legacy/            Template page markup used by About and Services
  src/pages/             Public pages, guest area, staff portal
  src/services/          API client and per-domain services
  tests/                 Playwright end-to-end and responsive checks

server/
  config/                Database and Cloudinary configuration
  Controller/            Request handlers
  Middleware/            Auth, role checks, uploads, error handling
  models/                Mongoose schemas
  Routes/                Route definitions and their role guards
  utils/                 Shared validators
  seed.js                Demo data
```

---

## Notes

- The template's stylesheets are loaded into a `template` CSS cascade layer so Tailwind
  utilities in the staff portal still apply over them.
- Tailwind's preflight is disabled (it would flatten the template's own styling); the staff
  portal and auth screens get a scoped reset via the `.app-shell` class instead.
