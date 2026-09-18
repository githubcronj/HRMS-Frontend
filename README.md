# HRMS Frontend (React + Vite + Tailwind)

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. API calls to `/api/*` are proxied to
`http://localhost:5001` (your Express backend) — change the target in
`vite.config.js` if your backend runs elsewhere.

## Auth

`AuthContext` expects `POST /api/auth/login` to return:

```json
{
  "token": "jwt...",
  "user": { "id": "...", "name": "...", "role": "superadmin|client|candidate" }
}
```

The token is stored in `localStorage` and attached to every request via the
axios interceptor in `src/api/axios.js`. A 401 response clears the session
and redirects to `/login`.

## Routes

| Path | Role | Page |
|---|---|---|
| `/login` | — | `LoginPage` |
| `/superadmin/clients` | superadmin | `ClientsPage` — add/deactivate clients |
| `/superadmin/candidates` | superadmin | `CandidatesPage` — filter + add candidates |
| `/client/dashboard` | client | `DashboardPage` — stat cards + candidate list |
| `/client/candidates/:candidateId` | client | `CandidateDetailPage` — monthly attendance report |
| `/candidate/attendance` | candidate | `AttendancePage` — punch in/out + own history |

`ProtectedRoute` checks `user.role` against the route's allowed role(s) and
redirects to `/login` if it doesn't match — this mirrors the server-side
scoping middleware from the design doc, but is a UX guard only. The backend
must still enforce access control independently.

## Still to wire up

- Backend Express routes matching `src/api/axios.js` calls (see the API
  surface in the design doc)
- Superadmin "delete candidate" action (only client deactivation is wired
  in `ClientsPage`)
- Form validation / toast notifications on save errors
