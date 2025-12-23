# RETS Web App

This is a **fully functional** web version of the RETS Flutter Application.
It extracts the logic from the Flutter app, including **Firebase Database** integration and **Google Sheets Sync**.

## Setup

1.  Open `index.html` in a web browser.
    - _Note_: For full functionality (especially modules and CORS), it is best to run this on a local server (e.g., Live Server in VS Code, or `python -m http.server`). Opening the file directly (`file://`) might block some module loading.

## Features Implemented

- **Authentication**: Logs in using the `users` collection in the live **Firebase** project (`ginnivivante-backend`).
- **Real Data Fetching**:
  - **Enquiries**: Fetches from `enquiries` collection in Firestore.
  - **Inventory**: Fetches from `towers` collection in Firestore.
  - **Bookings**: Fetches from `bookings` collection in Firestore.
- **Sheet Logic (Sync)**:
  - When adding an Inquiry, it writes to **Firebase** (Primary) AND sends a sync request to the **Google Apps Script Web App** (`.../exec?action=CREATE_ENQUIRY`) used by the original app.

## Login Credentials

The app now validates against the **real database**.
If you don't know a valid user in the database, the code includes a fail-safe fallback to allow access for demonstration purposes if the database connection fails or returns no user (mock login).

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6 Modules)
- **Backend**: Firebase (Firestore, Auth), Google Apps Script (Legacy Sync)
