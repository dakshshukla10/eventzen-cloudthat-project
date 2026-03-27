# EventZen Mentor Presentation

Subtitle: CloudThat Capstone Demo (Deloitte Problem Statement)
Presenter: Daksh
Date: 26 March 2026
Suggested duration: 8-10 minutes (including 5-6 minute live demo)

---

## Slide 1 - What Problem Are We Solving?

Event planning teams often operate with disconnected tools for:
- Venue discovery and availability
- Event publishing and status tracking
- Booking approvals and customer communication
- Vendor management

This creates delays, manual follow-ups, and poor visibility for admins and customers.

Speaker notes:
- Start with business pain, not tech.
- Emphasize operational inefficiency and status confusion.

---

## Slide 2 - Our Solution: EventZen

EventZen is a full-stack event management platform with:
- Customer workflows: browse venues/events, book events, track bookings
- Admin workflows: manage venues, events, vendors, and booking approvals
- Role-aware frontend experience and JWT-based authentication
- Dockerized deployment for one-command startup

Outcome focus:
- Faster booking lifecycle
- Centralized operations
- Clear ownership between customer and admin journeys

Speaker notes:
- Use one sentence: "EventZen is a single control plane for event operations."

---

## Slide 3 - Product Capabilities at a Glance

Customer side:
- Register and login
- Browse/filter venues
- Explore events and create bookings
- View and cancel bookings

Admin side:
- Approve or reject booking requests
- CRUD for venues, events, and vendors
- Dashboard view of platform activity

Speaker notes:
- Mention booking status model: PENDING, APPROVED, REJECTED, CANCELLED.

---

## Slide 4 - Architecture Overview

Microservices architecture:
- User Service (Spring Boot, port 8081): auth and user management
- Venue Service (Spring Boot, port 8082): venues and vendors
- Event Service (Spring Boot, port 8083): events and bookings
- Frontend (React + Vite, served by Nginx in Docker, external port 5173)

Data:
- Separate H2 in-memory DB per service for isolation in demo/dev mode

Infra:
- Docker Compose orchestrates all services on a shared bridge network

Speaker notes:
- Highlight service separation by business capability.

---

## Slide 5 - End-to-End Request Flow

1. User authenticates via User Service and receives JWT token.
2. Frontend stores token and user profile in browser storage.
3. Frontend calls APIs through /api prefix.
4. Vite proxy (dev) and Nginx (Docker) route traffic to correct microservice.
5. Booking lifecycle moves from PENDING to APPROVED/REJECTED by admin.

Speaker notes:
- This is a good point to show confidence in deployment setup and API routing.

---

## Slide 6 - Core Tech Stack

Backend:
- Java 21, Spring Boot 3.4.x, Spring Data JPA, Validation, Lombok
- Spring Security + JWT in user-service

Frontend:
- React, React Router, Axios, Vite
- Auth context + route guards for protected/admin routes

DevOps:
- Multi-stage Dockerfiles for all services
- Docker Compose for full-stack startup

Speaker notes:
- Keep this slide quick; mentors care about tradeoffs, not a long list.

---

## Slide 7 - Live Demo Plan (5-6 Minutes)

1. Login/Register as customer.
2. Browse venues and event list.
3. Create a booking (status becomes PENDING).
4. Show My Bookings from customer view.
5. Login as admin and open Admin Panel.
6. Approve the pending booking.
7. Show status update reflected in booking management.
8. Briefly show CRUD tabs for venues/events/vendors.

Backup line if time is short:
- "I can skip form creation and go directly to booking approval workflow."

Speaker notes:
- Keep browser tabs ready before presentation.
- Use pre-created users if internet/system is slow.

---

## Slide 8 - Engineering Decisions and Rationale

Why microservices?
- Independent domains (user, venue, event) are easier to evolve.

Why JWT?
- Stateless auth is simple for distributed services.

Why separate service databases?
- Strong domain boundaries and reduced coupling.

Why Dockerized deployment?
- Fast environment setup and reproducible demos.

Speaker notes:
- Mention this is a pragmatic architecture for a capstone, with production extensibility.

---

## Slide 9 - Current Gaps (Honest Assessment)

Known limitations in current version:
- Auth/security is strongly implemented in user-service; venue/event services currently rely mostly on frontend-level role restrictions.
- Databases are in-memory H2 (data resets on restart).
- Automated test coverage is minimal (currently basic context-load test only).
- No API gateway/service discovery/centralized logging yet.

Why this matters:
- This demonstrates clear awareness of production hardening needs.

Speaker notes:
- Present this confidently as roadmap maturity, not weakness.

---

## Slide 10 - Roadmap to Production Readiness

Near-term improvements:
- Enforce JWT and role-based authorization in all services.
- Introduce API gateway for centralized auth/routing.
- Replace H2 with persistent DB (MySQL/PostgreSQL).
- Add integration and contract tests for cross-service flows.
- Add observability (structured logs, metrics, tracing).

Stretch goals:
- Event notifications (email/webhook)
- Admin analytics dashboard
- CI/CD pipeline with quality gates

Speaker notes:
- Tie each roadmap item directly to a gap from prior slide.

---

## Slide 11 - Demo Readiness Checklist (Tonight)

Environment:
- Ensure all four containers start with docker-compose up --build
- Confirm frontend at http://localhost:5173

Data prep:
- Keep one customer and one admin account ready
- Keep at least one upcoming event and one venue present

Flow prep:
- Rehearse full run once with timer
- Keep fallback script in case of API latency

Speaker notes:
- Mention that you validated both customer and admin journey paths.

---

## Slide 12 - Closing

EventZen demonstrates:
- A complete role-based event operations workflow
- Clear microservice separation by business capability
- Realistic deployment and API routing setup
- Thoughtful understanding of production hardening path

Thank you. Happy to deep-dive into architecture, security, or scaling strategy.

Speaker notes:
- Invite questions in these areas: security hardening, scaling, and test strategy.

---

## Optional Q and A Cheat Answers

Q: Why not a monolith for this scope?
A: A monolith would be faster initially, but this domain naturally splits into user, venue, and event bounded contexts. We optimized for separation and future scaling.

Q: What is the biggest production risk today?
A: Cross-service authorization consistency. User-service is secure, and next milestone is enforcing JWT + RBAC in venue/event services.

Q: How would you make this production-ready in 2 sprints?
A: Sprint 1: API gateway, auth propagation, persistent DB. Sprint 2: testing automation, observability, and CI/CD quality gates.

Q: How does Docker help here?
A: It standardizes runtime across machines and makes full-stack startup reproducible with one command.
