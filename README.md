# EventZen - Event Management System

A full-stack event management platform built with Spring Boot microservices and React for the CloudThat capstone project (Deloitte problem statement).

EventZen helps an event planning company manage venues, events, bookings, and vendors through a web application with separate admin and customer flows.

## Project Structure

```
eventzen/
├── user-service/          # Spring Boot - Auth & user management (port 8081)
├── venue-service/         # Spring Boot - Venue & vendor management (port 8082)
├── event-service/         # Spring Boot - Event & booking management (port 8083)
├── frontend/              # React + Vite SPA (port 5173)
├── docs/                  # Documentation (ER diagram, wireframes, user flows)
├── docker-compose.yml     # Full stack orchestration
└── README.md
```

## Tech Stack

**Backend:** Java 21, Spring Boot 3.4, Spring Security, JWT (jjwt), Spring Data JPA, H2 Database, Maven

**Frontend:** React 18, Vite, React Router, Axios

**DevOps:** Docker (multi-stage builds), Docker Compose, Nginx

## Modules

### 1. User & Auth Service (port 8081)

Handles registration, login, and user profile management. Issues JWT tokens (HS512, 24h expiry) used for authentication across the platform. Passwords are hashed with BCrypt.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/logout` | Logout (stateless) |
| GET | `/users` | List all users |
| GET | `/users/{id}` | Get user by ID |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

### 2. Venue & Vendor Service (port 8082)

Manages venues (with search/filter by location and capacity) and vendor service providers.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/GET/PUT/DELETE | `/venues` | Venue CRUD |
| GET | `/venues?location=X&capacity=Y` | Search venues |
| GET | `/venues/{id}/availability` | Check availability |
| POST/GET/PUT/DELETE | `/vendors` | Vendor CRUD |

### 3. Event & Booking Service (port 8083)

Manages events and handles the booking workflow. Customers create bookings (status: PENDING), admins approve or reject them.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/GET/PUT/DELETE | `/events` | Event CRUD |
| POST | `/bookings` | Create booking |
| GET | `/bookings?userId=X` | Get user bookings |
| PUT | `/bookings/{id}/cancel` | Cancel booking |
| GET | `/admin/bookings` | All bookings (admin) |
| PUT | `/admin/bookings/{id}/approve` | Approve booking |
| PUT | `/admin/bookings/{id}/reject` | Reject booking |

### 4. Frontend (port 5173)

React SPA with dark themed UI. Role-based views for customers and admins.

| Page | Route | Description |
|------|-------|-------------|
| Login / Register | `/login`, `/register` | JWT auth |
| Dashboard | `/` | Stats and recent activity |
| Venues | `/venues`, `/venues/:id` | Browse and search venues |
| Events | `/events`, `/events/:id` | Browse events, book tickets |
| My Bookings | `/bookings` | View and cancel bookings |
| Admin Panel | `/admin/*` | Manage bookings, venues, events, vendors |

## How to Run

### Prerequisites

- Java 21
- Maven
- Node.js 18+

### Start Backend (3 separate terminals)

```bash
cd user-service && mvn spring-boot:run
cd venue-service && mvn spring-boot:run
cd event-service && mvn spring-boot:run
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Using Docker

```bash
docker-compose up --build
```

This starts all 3 backend services and the frontend (served via Nginx on port 5173).

## Documentation

All documentation is in the `docs/` folder:

- **er-diagram.md** - Database schema and entity relationships (Mermaid diagrams)
- **wireframes.md** - UI wireframes for all pages
- **userflow.md** - Customer and admin user journey flows
- **features.md** - Detailed API documentation and feature list

## Database

Each service uses its own H2 in-memory database (auto-created on startup):

- `usersdb` - users table
- `venuesdb` - venues, vendors tables
- `eventsdb` - events, bookings tables

H2 console is accessible at `http://localhost:{port}/h2-console` for each service.
