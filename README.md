# SmartInApp SDK

A complete In-App Messaging platform for Android applications.

SmartInApp enables developers to create, manage, deliver, display, and analyze targeted in-app messages through a complete full-stack solution consisting of:

- Android SDK
- FastAPI Backend
- React Developer Portal
- PostgreSQL Database
- VitePress Documentation Website

Full developer documentation is available in [`docs/docs/index.md`](docs/docs/index.md). It explains how to integrate the Android SDK, initialize SmartInApp, load banner and dialog messages, configure audiences and placements, handle navigation actions, and understand the platform architecture.

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

## Documentation Website

- VitePress documentation page
- Android SDK integration guide
- Kotlin examples for banners, dialogs, audiences, and navigation
- API, database, analytics, and architecture explanations
- Project demo video

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

<img src="images%20and%20videos/analytics.png" alt="Analytics Dashboard" width="720" />

## Messages Management

<img src="images%20and%20videos/messages.png" alt="Messages Management" width="720" />

## Create Message

<img src="images%20and%20videos/new-message.png" alt="Create Message" width="720" />

## Message Details

<img src="images%20and%20videos/message-details.png" alt="Message Details" width="720" />

## SDK Dialog

<img src="images%20and%20videos/dialog.jpg" alt="SDK Dialog" width="320" />

## SDK Banner

<img src="images%20and%20videos/banner.jpg" alt="SDK Banner" width="320" />

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

uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The `--host 0.0.0.0` option allows the Android demo app to reach the backend from an emulator or a physical device on the same network.

## Developer Portal

```bash
cd portal

npm install

npm run dev
```

## Android SDK

Initialize the SDK:

```kotlin
SmartInApp.setBaseUrl("http://10.0.0.15:8000/")

SmartInApp.initialize(
    context = applicationContext,
    apiKey = "YOUR_API_KEY"
)
```

Set the current user audience:

```kotlin
SmartInApp.setUserAudience("BUYER")
```

Display a banner message:

```kotlin
bannerView.load("home_screen")
```

Display a dialog message:

```kotlin
SmartInAppDialogs.load(
    context = this,
    placement = "home_screen"
)
```

Register navigation for message action buttons:

```kotlin
SmartInApp.setNavigationHandler { target ->
    when (target) {
        "books_screen" -> {
            startActivity(Intent(this, BooksActivity::class.java))
        }
    }
}
```

The SDK automatically filters messages by placement and audience. A user with audience `BUYER` can receive both `BUYER` and `ALL` messages for the same placement.

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
