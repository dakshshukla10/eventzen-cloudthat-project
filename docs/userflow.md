# EventZen - User Flow Document

## 1. Customer Journey

### 1.1 Registration & Login

```mermaid
flowchart TD
    A[Landing Page] --> B{Has Account?}
    B -->|No| C[Register Page]
    C --> D[Fill Name, Email, Password]
    D --> E[Select Role: Customer]
    E --> F[Submit Registration]
    F --> G[Redirect to Login]
    B -->|Yes| G[Login Page]
    G --> H[Enter Email & Password]
    H --> I{Valid Credentials?}
    I -->|No| J[Show Error Message]
    J --> G
    I -->|Yes| K[Receive JWT Token]
    K --> L[Store Token in LocalStorage]
    L --> M[Redirect to Dashboard]
```

### 1.2 Browse & Book Events

```mermaid
flowchart TD
    A[Customer Dashboard] --> B[Click 'Events' in Navbar]
    B --> C[View Event List]
    C --> D[Click on Event Card]
    D --> E[View Event Detail Page]
    E --> F{Event Status = UPCOMING?}
    F -->|No| G[No Booking Button Shown]
    F -->|Yes| H[Click 'Book This Event']
    H --> I[Booking Created with PENDING Status]
    I --> J[Success Message Displayed]
    J --> K[Wait for Admin Approval]
```

### 1.3 Manage Bookings

```mermaid
flowchart TD
    A[Customer Dashboard] --> B[Click 'My Bookings' in Navbar]
    B --> C[View Bookings Table]
    C --> D{Booking Status?}
    D -->|PENDING| E[Option to Cancel]
    D -->|APPROVED| F[Option to Cancel]
    D -->|REJECTED| G[No Actions Available]
    D -->|CANCELLED| G
    E --> H[Click Cancel]
    F --> H
    H --> I[Confirm Cancellation]
    I --> J[Booking Status → CANCELLED]
```

### 1.4 Browse Venues

```mermaid
flowchart TD
    A[Customer Dashboard] --> B[Click 'Venues' in Navbar]
    B --> C[View Venue List]
    C --> D[Optional: Filter by Location/Capacity]
    D --> E[Click Search]
    E --> F[View Filtered Results]
    F --> G[Click on Venue Card]
    G --> H[View Venue Detail Page]
    H --> I[See Capacity, Price, Availability]
```

---

## 2. Admin Journey

### 2.1 Admin Login

```mermaid
flowchart TD
    A[Login Page] --> B[Enter Admin Credentials]
    B --> C[Receive JWT Token with ADMIN Role]
    C --> D[Redirect to Admin Dashboard]
    D --> E[See Stats: Events, Venues, All Bookings]
    E --> F[Quick Actions: Manage Bookings/Venues/Events/Vendors]
```

### 2.2 Manage Bookings (Approve/Reject)

```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Click 'Admin Panel' in Navbar]
    B --> C[View Bookings Tab - Default]
    C --> D[See All Bookings Table]
    D --> E{Booking Status = PENDING?}
    E -->|Yes| F[Approve or Reject Buttons Shown]
    E -->|No| G[No Actions Available]
    F --> H{Admin Decision}
    H -->|Approve| I[Click Approve → Status: APPROVED]
    H -->|Reject| J[Click Reject → Status: REJECTED]
    I --> K[Table Refreshes]
    J --> K
```

### 2.3 Manage Venues (CRUD)

```mermaid
flowchart TD
    A[Admin Panel] --> B[Click 'Venues' Tab]
    B --> C[View All Venues Table]
    C --> D{Action?}
    D -->|Create| E[Click '+ Add Venue']
    E --> F[Fill Form: Name, Location, Capacity, Price, Description, Image]
    F --> G[Submit → Venue Created]
    D -->|Edit| H[Click Edit Button on Row]
    H --> I[Form Pre-filled with Venue Data]
    I --> J[Modify & Submit → Venue Updated]
    D -->|Delete| K[Click Delete Button on Row]
    K --> L[Confirm Dialog]
    L --> M[Venue Deleted]
    G --> N[Table Refreshes]
    J --> N
    M --> N
```

### 2.4 Manage Events (CRUD)

```mermaid
flowchart TD
    A[Admin Panel] --> B[Click 'Events' Tab]
    B --> C[View All Events Table]
    C --> D{Action?}
    D -->|Create| E[Click '+ Add Event']
    E --> F[Fill: Name, Date, Venue ID, Max Attendees, Status, Description]
    F --> G[Submit → Event Created]
    D -->|Edit| H[Click Edit → Pre-filled Form]
    H --> I[Modify & Submit → Event Updated]
    D -->|Delete| J[Click Delete → Confirm → Deleted]
    G --> K[Table Refreshes]
    I --> K
    J --> K
```

### 2.5 Manage Vendors (CRUD)

```mermaid
flowchart TD
    A[Admin Panel] --> B[Click 'Vendors' Tab]
    B --> C[View All Vendors Table]
    C --> D{Action?}
    D -->|Create| E[Click '+ Add Vendor']
    E --> F[Fill: Name, Service Type, Email, Phone]
    F --> G[Submit → Vendor Created]
    D -->|Edit| H[Edit → Pre-filled Form → Update]
    D -->|Delete| I[Delete → Confirm → Deleted]
```

---

## 3. Complete System Flow

```mermaid
flowchart LR
    subgraph Customer
        A[Register] --> B[Login]
        B --> C[Browse Venues]
        B --> D[Browse Events]
        D --> E[Book Event]
        E --> F[View My Bookings]
        F --> G[Cancel Booking]
    end

    subgraph Admin
        H[Login as Admin] --> I[Manage Venues]
        H --> J[Manage Events]
        H --> K[Manage Vendors]
        H --> L[Approve/Reject Bookings]
    end

    E -.->|Creates PENDING booking| L
    L -.->|APPROVED/REJECTED| F
    I -.->|Venues available for| J
    J -.->|Events bookable by| D
```

---

## 4. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (React)
    participant US as User Service (8081)

    U->>F: Enter email & password
    F->>US: POST /auth/login
    US->>US: Validate credentials
    US->>US: Generate JWT token
    US-->>F: Return {token, userId, name, email, role}
    F->>F: Store token in localStorage
    F->>F: Store user data in AuthContext
    F-->>U: Redirect to Dashboard

    Note over U,US: Subsequent API Calls
    U->>F: Navigate to Events
    F->>F: Read token from localStorage
    F->>US: GET /events (Authorization: Bearer <token>)
    US->>US: Validate JWT
    US-->>F: Return events data
    F-->>U: Display events
```
