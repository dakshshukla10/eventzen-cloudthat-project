# EventZen - Features & API Documentation

## Overview

EventZen is a full-stack microservices-based event management platform built with Spring Boot (backend) and React (frontend). It allows customers to browse venues, discover events, and make bookings, while administrators can manage all platform resources.

---

## Architecture

| Component       | Technology          | Port  |
|----------------|--------------------| ------|
| User Service   | Spring Boot 3 + Java 21 | 8081 |
| Venue Service  | Spring Boot 3 + Java 21 | 8082 |
| Event Service  | Spring Boot 3 + Java 21 | 8083 |
| Frontend       | React 18 + Vite    | 5173  |
| Database       | H2 In-Memory       | -     |

---

## Module 1: User & Auth Service (Port 8081)

### Features
- User registration with role selection (ADMIN / CUSTOMER)
- JWT-based authentication (HS512, 24-hour expiration)
- BCrypt password hashing
- User profile CRUD operations
- Spring Security integration with JWT filter

### API Endpoints

| Method | Endpoint           | Description              | Auth Required |
|--------|-------------------|--------------------------|---------------|
| POST   | `/auth/register`  | Register a new user       | No            |
| POST   | `/auth/login`     | Login and receive JWT     | No            |
| POST   | `/auth/logout`    | Logout (stateless)        | Yes           |
| GET    | `/users`          | Get all users             | Yes           |
| GET    | `/users/{id}`     | Get user by ID            | Yes           |
| PUT    | `/users/{id}`     | Update user profile       | Yes           |
| DELETE | `/users/{id}`     | Delete user               | Yes           |

### Request/Response Examples

**Register:**
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

---

## Module 2: Venue & Vendor Service (Port 8082)

### Features
- Complete venue CRUD operations
- Venue search by location and minimum capacity
- Venue availability checking
- Vendor management for service providers
- Image URL support for venues

### API Endpoints - Venues

| Method | Endpoint                  | Description                        | Auth Required |
|--------|--------------------------|------------------------------------| --------------|
| POST   | `/venues`                | Create a new venue                 | No            |
| GET    | `/venues`                | List venues (optional filters)     | No            |
| GET    | `/venues/{id}`           | Get venue details                  | No            |
| GET    | `/venues/{id}/availability` | Check venue availability        | No            |
| PUT    | `/venues/{id}`           | Update venue                       | No            |
| DELETE | `/venues/{id}`           | Delete venue                       | No            |

**Query Parameters for GET /venues:**
- `location` (String) — Filter by location (partial match)
- `capacity` (Integer) — Filter by minimum capacity

### API Endpoints - Vendors

| Method | Endpoint          | Description            | Auth Required |
|--------|------------------|------------------------| --------------|
| POST   | `/vendors`       | Create a new vendor    | No            |
| GET    | `/vendors`       | List all vendors       | No            |
| GET    | `/vendors/{id}`  | Get vendor details     | No            |
| PUT    | `/vendors/{id}`  | Update vendor          | No            |
| DELETE | `/vendors/{id}`  | Delete vendor          | No            |

### Request Examples

**Create Venue:**
```json
POST /venues
{
  "name": "Grand Ballroom",
  "location": "Downtown, NYC",
  "capacity": 500,
  "description": "Elegant ballroom for large events",
  "pricePerHour": 150.00,
  "imageUrl": "https://example.com/ballroom.jpg"
}
```

**Create Vendor:**
```json
POST /vendors
{
  "name": "Elite Catering",
  "serviceType": "Catering",
  "contactEmail": "info@elitecatering.com",
  "phone": "+1-555-0100"
}
```

---

## Module 3: Event & Booking Service (Port 8083)

### Features
- Event CRUD with status management (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- Booking creation by customers
- Booking approval/rejection workflow for admins
- Booking cancellation by customers
- Filter events by venue, organizer, or status
- Filter bookings by user, event, or status

### API Endpoints - Events

| Method | Endpoint          | Description          | Auth Required |
|--------|------------------|----------------------| --------------|
| POST   | `/events`        | Create a new event   | No            |
| GET    | `/events`        | List all events      | No            |
| GET    | `/events/{id}`   | Get event details    | No            |
| PUT    | `/events/{id}`   | Update event         | No            |
| DELETE | `/events/{id}`   | Delete event         | No            |

### API Endpoints - Bookings

| Method | Endpoint                         | Description              | Auth Required |
|--------|----------------------------------|--------------------------|---------------|
| POST   | `/bookings`                      | Create a booking         | No            |
| GET    | `/bookings`                      | List bookings (by user)  | No            |
| GET    | `/bookings/{id}`                 | Get booking details      | No            |
| PUT    | `/bookings/{id}/cancel`          | Cancel a booking         | No            |
| GET    | `/admin/bookings`                | List all bookings (admin)| No            |
| PUT    | `/admin/bookings/{id}/approve`   | Approve a booking        | No            |
| PUT    | `/admin/bookings/{id}/reject`    | Reject a booking         | No            |

### Request Examples

**Create Event:**
```json
POST /events
{
  "name": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-06-15",
  "venueId": 1,
  "organizerId": 1,
  "maxAttendees": 500,
  "status": "UPCOMING"
}
```

**Create Booking:**
```json
POST /bookings
{
  "eventId": 1,
  "userId": 2,
  "userName": "Jane Smith",
  "userEmail": "jane@example.com"
}
```

### Booking Status Workflow
```
PENDING → APPROVED (by admin)
PENDING → REJECTED (by admin)
PENDING → CANCELLED (by customer)
APPROVED → CANCELLED (by customer)
```

---

## Frontend Pages

| Page               | Route            | Description                           |
|-------------------|------------------|---------------------------------------|
| Login             | `/login`         | JWT authentication form               |
| Register          | `/register`      | New user registration                 |
| Dashboard         | `/`              | Stats, recent events & bookings       |
| Venue List        | `/venues`        | Browse venues with search/filter      |
| Venue Detail      | `/venues/:id`    | Venue details and availability        |
| Event List        | `/events`        | Browse all events                     |
| Event Detail      | `/events/:id`    | Event details with booking button     |
| My Bookings       | `/bookings`      | Customer's booking history            |
| Admin Panel       | `/admin`         | Admin booking management              |
| Admin - Venues    | `/admin/venues`  | CRUD venue management                 |
| Admin - Events    | `/admin/events`  | CRUD event management                 |
| Admin - Vendors   | `/admin/vendors` | CRUD vendor management                |

---

## Running the Application

### Local Development

1. **Start backend services** (requires Java 21 + Maven):
   ```bash
   # Terminal 1
   cd user-service && mvn spring-boot:run

   # Terminal 2
   cd venue-service && mvn spring-boot:run

   # Terminal 3
   cd event-service && mvn spring-boot:run
   ```

2. **Start frontend** (requires Node.js):
   ```bash
   cd frontend && npm install && npm run dev
   ```

3. **Access the application:** http://localhost:5173

### Docker

```bash
cd eventzen
docker-compose up --build
```

Access the application at http://localhost:5173

---

## Technology Stack

### Backend
- Java 21
- Spring Boot 3.4.4
- Spring Security + JWT (jjwt 0.12.6)
- Spring Data JPA + Hibernate
- H2 Database (in-memory)
- Lombok
- Jakarta Validation
- Maven

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- CSS3 (Dark theme)

### DevOps
- Docker (multi-stage builds)
- Docker Compose
- Nginx (frontend reverse proxy)
