# StudyDesk – Personal MBA Learning Tracker

A responsive, frontend-only personal MBA study dashboard. It uses plain HTML, CSS and JavaScript; no backend, authentication, build tools or external JavaScript libraries are required.

## Run it

1. Extract the ZIP folder.
2. Open `index.html` in a modern browser (Chrome, Edge or Firefox).
3. Add subjects, create weekly timetable slots, then visit Attendance to mark each scheduled session.

For best compatibility, you can also serve the folder with a simple local static server (for example, VS Code Live Server).

## Features

- Admin-panel style dashboard with attendance, present, absent and active-subject KPIs.
- Subject management: add, edit, search and delete subjects.
- Set a required session total per subject and track marked sessions, sessions remaining and completion on the dashboard.
- Completed subjects become view-only for attendance.
- Persistent light and dark appearance toggle.
- Weekly recurring timetable: create, edit and delete subject time slots for each day.
- Overlap validation for time slots on the same day.
- Daily attendance generated directly from that day's timetable.
- Mark Present or Absent; click the selected mark again to clear it.
- Attendance progress counts both Present and Absent marks against the subject's required total. Once the target is reached, that subject cannot be marked or changed further.
- No scheduled subject means no attendance entry and no attendance penalty for that day.
- Attendance totals and rates by subject, plus recent attendance history.
- Seven-day consistency chart and subject performance on the dashboard.
- Responsive layout for desktop, tablet and mobile.
- All data is stored in browser `localStorage` under `studydesk_mba_v1`.

## Attendance calculation

- Expected sessions are derived from recurring timetable slots, from the app's first-use date (or the individual slot's creation date) through the selected date.
- A subject is expected only on weekdays where it has a timetable slot.
- A day with no slot for a subject is not counted for that subject.
- Present and Absent totals include only sessions explicitly marked by the user. Unmarked sessions remain unmarked; they are not silently converted to absences.
- Attendance rate = Present / (Present + Absent) × 100. This avoids treating a session that has not yet been marked as an absence.

## Files

- `index.html` – Dashboard page
- `pages/subjects.html` – Subject management
- `pages/timetable.html` – Weekly timetable management
- `pages/attendance.html` – Daily attendance and reports
- `assets/css/style.css` – Shared styles
- `assets/js/app.js` – Shared storage, date, attendance and UI utilities
- `assets/js/dashboard.js` – Dashboard rendering
- `assets/js/subjects.js` – Subject CRUD
- `assets/js/timetable.js` – Weekly timetable CRUD
- `assets/js/attendance.js` – Attendance marking and reporting

## Data and privacy

There is no authentication or server. Anyone using the same browser profile can access the app and its saved data. Clearing browser site data may erase the records. Export/import and cloud sync are not included in this first version.
