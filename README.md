# SmartInApp SDK

A complete In-App Messaging platform for Android applications.

SmartInApp enables developers to create, manage, deliver, display, and analyze targeted in-app messages through a complete full-stack solution consisting of:

- Android SDK
- FastAPI Backend
- React Developer Portal
- PostgreSQL Database

---

# Features

## In-App Messaging

- Dialog Messages
- Top Banner Messages
- Placement-Based Delivery
- Audience Targeting
- Message Scheduling
- Enable / Disable Messages
- Offline Message Caching

## Android SDK

- Simple initialization using API Key
- Fetch active messages from backend
- Display Dialog and Banner messages
- Track analytics events
- Cache messages locally

## Developer Portal

- Project Login
- Create Messages
- Edit Messages
- Delete Messages
- Enable / Disable Messages
- Message Details View
- Analytics Dashboard

## Analytics

- View Tracking
- Click Tracking
- Dismiss Tracking
- CTR Calculation
- Interaction Rate
- Developer Insights
- Top Performing Messages
- CTR Over Time

---

# Screenshots

## Analytics Dashboard

![Analytics](images/analytics.png)

## Messages Management

![Messages](images/messages.png)

## Create Message

![Create Message](images/new-message.png)

## Message Details

![Message Details](images/message-details.png)

## SDK Dialog

![Dialog](images/dialog.jpg)

## SDK Banner

![Banner](images/banner.jpg)

---

# System Architecture

```mermaid
flowchart LR

    APP[Android Application]

    SDK[SmartInApp SDK]

    BACKEND[FastAPI Backend]

    DB[(PostgreSQL)]

    PORTAL[React Developer Portal]

    APP --> SDK

    SDK -->|Fetch Messages| BACKEND
    SDK -->|Send Analytics| BACKEND

    PORTAL -->|Manage Messages| BACKEND
    PORTAL -->|View Analytics| BACKEND

    BACKEND --> DB
```

---

# Database ERD

```mermaid
erDiagram

    PROJECTS {
        int id PK
        string name
        string api_key
    }

    MESSAGES {
        int id PK
        int project_id FK
        string title
        string body
        string type
        string placement
        string audience
        boolean enabled
        datetime start_date
        datetime end_date
    }

    ANALYTICS_EVENTS {
        int id PK
        int message_id FK
        string event_type
        datetime created_at
    }

    MESSAGE_ANALYTICS_SUMMARY {
        int message_id PK
        int views
        int clicks
        int dismisses
    }

    PROJECT_ANALYTICS_SUMMARY {
        int project_id PK
        int views
        int clicks
        int dismisses
    }

    PROJECTS ||--o{ MESSAGES : owns

    MESSAGES ||--o{ ANALYTICS_EVENTS : generates

    MESSAGES ||--|| MESSAGE_ANALYTICS_SUMMARY : aggregates

    PROJECTS ||--|| PROJECT_ANALYTICS_SUMMARY : aggregates
```

---

# SDK Flow

```mermaid
sequenceDiagram

    Android App->>SDK: initialize(apiKey)

    SDK->>Backend: GET /messages

    Backend->>Database: Load active messages

    Database-->>Backend: Messages

    Backend-->>SDK: Messages

    SDK->>User: Display Dialog / Banner

    SDK->>Backend: VIEW / CLICK / DISMISS
```

---

# Analytics Optimization

To improve performance, analytics are stored in two layers.

### Raw Events

Every user interaction is stored in:

```text
analytics_events
```

### Summary Tables

The backend updates optimized summary tables in real time:

```text
message_analytics_summary
project_analytics_summary
```

This architecture prevents expensive aggregation queries on large datasets and allows analytics dashboards to load instantly.

```mermaid
flowchart TD

    EVENT[VIEW / CLICK / DISMISS]

    RAW[analytics_events]

    MSG[message_analytics_summary]

    PROJ[project_analytics_summary]

    DASH[Analytics Dashboard]

    EVENT --> RAW

    EVENT --> MSG

    EVENT --> PROJ

    DASH --> MSG

    DASH --> PROJ
```

---

# Backend Architecture

The backend is divided into three logical layers.

## Endpoint Functions

Receive HTTP requests from the SDK and Portal.

Examples:

```text
POST /portal/login
GET /messages
POST /analytics/event
GET /analytics/project/{id}
```

## Service Functions

Contain the business logic of the application.

Examples:

```text
create_message()
update_message()
delete_message()
save_analytics_event()
get_project_analytics()
```

## Private Functions

Internal helper functions used by the backend.

Examples:

```text
get_db_connection()
update_summary_tables()
get_message_status()
```

### Request Flow

```mermaid
flowchart TD

    REQUEST[HTTP Request]

    ENDPOINT[Endpoint Function]

    SERVICE[Service Function]

    PRIVATE[Private Function]

    DATABASE[(PostgreSQL)]

    REQUEST --> ENDPOINT
    ENDPOINT --> SERVICE
    SERVICE --> PRIVATE
    PRIVATE --> DATABASE
```

---

# How To Use

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

## Developer Portal

```bash
cd portal

npm install

npm run dev
```

## Android SDK

Initialize the SDK:

```kotlin
SmartInApp.initialize(
    context = applicationContext,
    apiKey = "YOUR_API_KEY"
)
```

Display messages:

```kotlin
SmartInApp.showMessage(
    placement = "home_screen",
    userType = "BUYER"
)
```

---

# Technologies

| Layer | Technologies |
|---------|---------|
| Android SDK | Kotlin, Retrofit, Gson |
| Backend | Python, FastAPI, Psycopg2 |
| Database | PostgreSQL |
| Portal | React, Vite, Recharts |
| Tools | Git, GitHub, Android Studio, PyCharm, pgAdmin |

---

# Author

**Inbar Sar Israel**

B.Sc. Computer Science

Afeka Academic College of Engineering
