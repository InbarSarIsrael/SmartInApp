# SmartInApp SDK

<p align="center">
  <b>Android In-App Messaging SDK with a React Developer Portal, FastAPI Backend, PostgreSQL Database, and Analytics Dashboard</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Android-Kotlin-green" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-blue" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791" />
</p>

---

## Overview

**SmartInApp** is a complete in-app messaging platform that allows developers to create, manage, display, and analyze messages inside Android applications.

The project includes:

- **Android SDK** for displaying in-app messages.
- **React Developer Portal** for managing messages and viewing analytics.
- **FastAPI Backend** for message delivery, project management, and analytics.
- **PostgreSQL Database** for storing projects, messages, and user interaction events.

---

## Main Features

### In-App Messaging

- Dialog messages
- Banner messages
- Placement-based message delivery
- Start and end date scheduling
- Enable / Disable message control
- Audience-based targeting

### Android SDK

- Simple SDK initialization using an API key
- Fetches active messages from the backend
- Displays messages inside Android apps
- Supports Dialog and Banner message types
- Tracks user interactions
- Supports offline message caching

### Developer Portal

- Login using project API key
- Create new messages
- Edit existing messages
- Enable or disable messages
- View message details
- View analytics dashboard
- Track message performance

### Analytics

- View tracking
- Click tracking
- Dismiss tracking
- CTR calculation
- Interaction rate
- Top performing messages
- CTR over time

---

## System Architecture

```text
Android App
   |
   | uses
   v
SmartInApp Android SDK
   |
   | HTTP requests
   v
FastAPI Backend
   |
   | stores and reads data
   v
PostgreSQL Database
   ^
   |
React Developer Portal
```

---

## Project Structure

```text
SmartInApp/
│
├── android/
│   ├── app/                 # Demo Android application
│   └── smartinapp-sdk/      # Android SDK module
│
├── backend/
│   ├── core/                # Database connection and core settings
│   ├── database/            # Database initialization scripts
│   ├── routes/              # FastAPI route files
│   ├── services/            # Business logic
│   ├── app.py               # FastAPI entry point
│   ├── models.py            # Data models
│   └── requirements.txt     # Python dependencies
│
├── portal/
│   ├── src/
│   │   ├── components/      # Dashboard and UI components
│   │   ├── pages/           # Portal pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/                # General database files
├── .gitignore
└── README.md
```

---

## Technologies Used

| Layer | Technologies |
|---|---|
| Android SDK | Kotlin, Retrofit, Gson, OkHttp |
| Demo App | Android, Kotlin, XML Layouts |
| Backend | Python, FastAPI, Psycopg2 |
| Database | PostgreSQL |
| Portal | React, Vite, Recharts |
| Tools | Git, GitHub, Android Studio, PyCharm |

---

## Database Tables

The system is based on three main tables:

| Table | Purpose |
|---|---|
| `projects` | Stores projects and API keys |
| `messages` | Stores in-app messages and targeting data |
| `analytics_events` | Stores view, click, and dismiss events |

---

## Backend API

Main backend responsibilities:

- Create and manage projects
- Create, update, enable, disable, and delete messages
- Deliver active messages to the SDK
- Receive analytics events from the SDK
- Provide analytics data to the portal

Example endpoint categories:

```text
/projects
/messages
/sdk/messages
/analytics
/portal/login
```

---

## Android SDK Flow

1. The app initializes the SDK with an API key.
2. The SDK requests active messages from the backend.
3. The backend returns messages that match:
   - Project API key
   - Placement
   - Audience
   - Enabled status
   - Active date range
4. The SDK displays the message.
5. The SDK sends analytics events:
   - View
   - Click
   - Dismiss
6. The portal displays the collected analytics.

---

## Analytics Flow

```text
Message displayed
      |
      v
VIEW event sent
      |
User clicks or dismisses
      |
      v
CLICK / DISMISS event sent
      |
      v
Event saved in PostgreSQL
      |
      v
Portal dashboard updates analytics
```

---

## How to Run the Project

### 1. Backend

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartinapp_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Run the backend server:

```bash
uvicorn app:app --reload
```

---

### 2. Portal

Navigate to the portal folder:

```bash
cd portal
```

Install dependencies:

```bash
npm install
```

Run the React portal:

```bash
npm run dev
```

---

### 3. Android

Open the `android` folder in Android Studio.

The Android project includes:

- `app` - demo application
- `smartinapp-sdk` - SDK module

Run the demo app on an emulator or physical Android device.

---

## Security Notes

Sensitive files are ignored using `.gitignore`.

The following files should not be uploaded to GitHub:

```text
backend/.env
backend/.venv/
portal/node_modules/
android/build/
android/.gradle/
*.sql database backup files
```

The database password and local environment variables must stay only on the local machine.

---

## Current Status

Implemented:

- Backend API
- PostgreSQL database structure
- React developer portal
- Android SDK module
- Demo Android app
- Message management
- Analytics tracking
- CTR dashboard
- Offline cache support

Not implemented:

- A/B testing
- Advanced segmentation
- Push notifications
- Export analytics

---

## Future Improvements

- Add A/B testing support
- Add push notification integration
- Add advanced user segmentation
- Add analytics export to CSV
- Add SDK error monitoring
- Improve portal authentication
- Add more detailed setup documentation

---

## Author

**Inbar Sar Israel**  
Computer Science Student  
Afeka Academic College of Engineering

---

## Project Goal

This project was developed as part of a mobile technologies course and demonstrates a complete SDK-based product architecture, including backend services, database design, developer portal, Android SDK integration, and analytics tracking.
