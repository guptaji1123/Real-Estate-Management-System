# Plot Booking Management System

A full-stack web application for managing real-estate/land **projects**, their **plots**, and **bookings** made against those plots. It has role-based access (Admin / Worker), JWT-based authentication, and a REST API backend paired with a React frontend.

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication, stored in an HTTP-only cookie
- `bcryptjs` for password hashing
- `validator` for input validation (email, mobile number, etc.)
- `dotenv` for environment configuration
- `cookie-parser`

**Frontend**
- React 19
- Vite 8
- Tailwind CSS 4
- `lucide-react` (icons) and `motion` (animations)
- ESLint for linting

## Project Structure

```
New folder/
├── BACKEND/
│   ├── server.js                  # Entry point — connects DB and starts the server
│   └── source/
│       ├── app.js                 # Express app setup and route mounting
│       ├── database/
│       │   └── database.js        # MongoDB connection logic
│       ├── middleware/
│       │   └── auth.middleware.js # JWT auth & admin-only guards
│       ├── models/
│       │   ├── user.model.js
│       │   ├── project.model.js
│       │   ├── plot.model.js
│       │   └── booking.model.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── user.controller.js
│       │   ├── project.controller.js
│       │   ├── plot.controller.js
│       │   └── booking.controller.js
│       └── routes/
│           ├── auth.routes.js
│           ├── user.rotes.js
│           ├── project.routes.js
│           ├── plot.routes.js
│           └── booking.routes.js
│
└── FRONTEND/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css / App.css
        ├── pages/
        │   ├── Login.jsx
        │   └── dashboard.jsx
        └── assets/
```

## Data Model

- **User** — `username`, `password` (hashed), `fullname`, `number`, `email`, `role` (`WORKER` | `ADMIN`)
- **Project** — `name`, `description`, `location`, `status` (`PLANNING` | `ONGOING` | `COMPLETED` | `ON_HOLD`)
- **Plot** — belongs to a `Project`; `plotNumber`, `description`, `area`, `unit` (`SQFT` | `SQM` | `BIGHA` | `ACRE`), `status` (`AVAILABLE` | `BOOKED` | `SOLD`), `price`
- **Booking** — belongs to a `Plot` and `Project`; `name`, `number`, `amount`, `bookedBy` (User), `bookingDate`, `remarks`, `status` (`PENDING` | `COMPLETED`)

## API Overview

All routes are prefixed with `/api`.

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Log in with username/password, sets JWT cookie |
| POST | `/logout` | Clears the JWT cookie |

### Users (`/api/user`) — Admin only unless noted
| Method | Endpoint | Description |
|---|---|---|
| POST | `/createUser` | Create a new user (Admin) |
| PATCH | `/updateUser` | Update the logged-in user's profile |
| GET | `/getUser` | Get the logged-in user's profile |
| GET | `/getAllUser` | List all users (Admin) |
| DELETE | `/deleteUser/:_idUser` | Delete a user (Admin) |

### Projects (`/api/project`) — Create/Update/Delete require Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/createProject` | Create a project |
| PATCH | `/updateProject/:_idProject` | Update a project |
| GET | `/search` | Search projects |
| GET | `/getProjects` | List all projects |
| GET | `/getProject/:_idProject` | Get a single project |
| GET | `/getProjects/:status` | Filter projects by status |
| DELETE | `/deleteProject/:_idProject` | Delete a project |

### Plots (`/api/plot`) — Create/Update/Delete require Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/createPlot/:_idProject` | Create a plot within a project |
| PATCH | `/updatePlot/:_idProject/:_idPlot` | Update a plot |
| GET | `/search/:_idProject` | Search plots within a project |
| GET | `/getPlots/:_idProject` | List plots in a project |
| GET | `/getPlot/:_idProject/:_idPlot` | Get a single plot |
| GET | `/getPlots/:_idProject/priceRange` | Filter plots by price range |
| GET | `/getPlots/:_idProject/areaRange` | Filter plots by area range |
| GET | `/getPlots/:_idProject/:status` | Filter plots by status |
| DELETE | `/deletePlot/:_idProject/:_idPlot` | Delete a plot |

### Bookings (`/api/booking`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/createBooking/:_idProject/:_idPlot` | Book a plot |
| PATCH | `/updateBooking/:_idProject/:_idPlot` | Update a booking |
| GET | `/search/:_idProject` | Search bookings within a project |
| GET | `/getBookings/:_idProject` | List bookings for a project |
| GET | `/getBooking/:_idProject/:_idPlot` | Get a single booking |
| GET | `/getBookings` | Get the logged-in user's bookings |
| GET | `/getAllBookings/:_idUser` | Get all bookings of a user (Admin) |
| GET | `/getBookings/:_idProject/priceRange` | Filter bookings by amount range |
| GET | `/getBookings/:_idProject/dateRange` | Filter bookings by date range |
| GET | `/getBookings/:_idProject/:status` | Filter bookings by status |
| DELETE | `/deleteBooking/:_idProject/:_idBooking` | Delete a booking |

## Authentication & Authorization

- On login, a JWT is issued (3-day expiry) and set as an HTTP-only cookie (`token`). It can also be sent via the `Authorization: Bearer <token>` header.
- `authenticate` middleware verifies the token and attaches `request.user`.
- `authenticateAdmin` middleware additionally checks `request.user.role === 'ADMIN'`.

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A MongoDB instance (local or Atlas)

### 1. Backend Setup
```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/`:
```env
PORT=3000
DATABASE=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Run the server:
```bash
node server.js
```
The API will be available at `http://localhost:3000`.

### 2. Frontend Setup
```bash
cd FRONTEND
npm install
npm run dev
```
The frontend will be available at the Vite dev server URL (typically `http://localhost:5173`).

### Build for production
```bash
cd FRONTEND
npm run build
```

## Notes

- The frontend `package.json` currently pins some very new/unusual version numbers (React 19, Vite 8, ESLint 10, `lucide-react` 1.30) — double check these resolve correctly with `npm install`, and pin exact versions if you hit registry issues.
- `BACKEND/source/routes/user.rotes.js` has a typo in the filename (`rotes` instead of `routes`) — safe to leave as-is or rename, just update the `require` in `app.js` if you do.
- Make sure `.env` is never committed (`BACKEND/.gitignore` already excludes it).

## License

ISC (as declared in `BACKEND/package.json`) — update as appropriate for your project.