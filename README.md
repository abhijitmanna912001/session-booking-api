# Session Booking API

REST API where teachers publish available sessions, users book them, and completed sessions appear in the user's history.

**Stack:** Node.js, TypeScript, Express 5, MongoDB, Mongoose, Zod.

## Setup

1. Install dependencies:

```bash
   npm install
```

2. Copy the env template and fill it in:

```bash
   cp .env.example .env
```

| Variable    | Description                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`      | Port to listen on (default 3000)                                                                                                                                        |
| `NODE_ENV`  | `development`, `production` or `test`                                                                                                                                   |
| `MONGO_URI` | MongoDB connection string, including a database name, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/session-booking` or `mongodb://127.0.0.1:27017/session-booking` |

3. Seed two teachers (there is no create-teacher endpoint). Copy a printed teacher id for creating sessions:

```bash
   npm run seed
```

Note: the seed deletes existing teachers first. Use it on a development database only. 4. Run:

```bash
   npm run dev
```

Production: `npm run build && npm start`.

Other scripts: `npm run typecheck`.

## API

| Method | Path                                 | Description                                                    | Success |
| ------ | ------------------------------------ | -------------------------------------------------------------- | ------- |
| POST   | `/users`                             | Create user (email unique)                                     | 201     |
| POST   | `/sessions`                          | Create session for a teacher (status AVAILABLE)                | 201     |
| GET    | `/sessions/available?dateTimestamp=` | AVAILABLE sessions for a date (aggregation pipeline)           | 200     |
| POST   | `/sessions/:id/book`                 | Book a session, body `{ "userId": "..." }`                     | 200     |
| PATCH  | `/sessions/:id/complete`             | Mark a BOOKED session COMPLETED                                | 200     |
| GET    | `/users/:id/sessions`                | `{ upcoming, completed }` (aggregation pipeline with `$facet`) | 200     |

Errors use `{ "success": false, "message": "...", "details": ... }` with these codes: 400 validation or malformed id, 404 not found, 409 conflict (duplicate email, session not in the required status), 500 unexpected.

## Design decisions and assumptions

- **Layering:** routes, controllers (HTTP only), services (business rules), models. Errors are thrown as `AppError` or Zod errors and handled in one middleware.
- **No double booking:** booking and completing use a single atomic `findOneAndUpdate` filtered on the required status, so concurrent requests cannot both succeed (verified with parallel requests).
- **`dateTimestamp`** is in milliseconds since epoch. "The date" is the UTC calendar day of that timestamp (start inclusive, next midnight exclusive).
- **Upcoming sessions** are all BOOKED sessions for the user, sorted by start time. Completed sessions are sorted by most recently completed.
- **No authentication:** the booking user id is passed in the request body.
- **Not implemented (not in the spec):** overlap checks for a teacher's sessions, blocking completion before the start time, a teacher CRUD API.
- Indexes: `{ status, startTime }` for available sessions, `{ userId, status }` for the user session list, unique `email` on users.

## Postman

Import `postman/session-booking-api.postman_collection.json`, set the `teacherId` collection variable to an id printed by `npm run seed`, and run the requests in order. `userId` and `sessionId` are filled in automatically.
