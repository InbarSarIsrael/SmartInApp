\# SmartInApp SDK



SmartInApp is a complete In-App Messaging platform consisting of:



\* Android SDK

\* FastAPI Backend

\* React Developer Portal

\* PostgreSQL Database



The system enables developers to create, manage, deliver, and analyze in-app messages inside Android applications.



\---



\## Architecture



\### Android SDK



Responsible for:



\* Fetching messages from the backend

\* Displaying Dialog and Banner messages

\* Tracking analytics events

\* Audience targeting

\* Offline message caching



\### Backend (FastAPI)



Responsible for:



\* Project management

\* Message management

\* Analytics collection

\* SDK API endpoints

\* Portal API endpoints



\### Developer Portal (React)



Features:



\* Project login using API key

\* Message creation and editing

\* Enable / Disable messages

\* Analytics dashboard

\* CTR analysis

\* Message performance monitoring



\### Database (PostgreSQL)



Main tables:



\* projects

\* messages

\* analytics\_events



\---



\## Features



\### Messaging



\* Dialog messages

\* Banner messages

\* Placement-based targeting

\* Start and end date scheduling

\* Enable / Disable support



\### Analytics



\* Views

\* Clicks

\* Dismisses

\* CTR calculation

\* Top performing messages

\* CTR over time



\### Targeting



\* Audience groups

\* Placement filtering

\* Active date validation



\### Offline Support



\* Local message caching

\* Fallback when backend is unavailable



\---



\## Project Structure



```text

SmartInApp

│

├── android/

│   ├── app/

│   └── smartinapp-sdk/

│

├── backend/

│

├── database/

│

└── portal/

```



\---



\## Technologies



\### Android



\* Kotlin

\* Retrofit

\* Gson

\* OkHttp



\### Backend



\* Python

\* FastAPI

\* PostgreSQL

\* Psycopg2



\### Portal



\* React

\* Vite

\* Recharts



\---



\## Analytics Flow



1\. SDK displays a message

2\. View event is sent

3\. User clicks or dismisses

4\. Event is stored in PostgreSQL

5\. Portal displays analytics dashboards



\---



\## Future Improvements



\* A/B Testing

\* Push Notification Integration

\* Advanced Audience Segmentation

\* Analytics Export

\* Error Monitoring



\---



\## Author



Inbar Sar Israel

Computer Science Student

Afeka Academic College of Engineering



