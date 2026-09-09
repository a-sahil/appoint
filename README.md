# 🗓 Appointment Board

A full-stack appointment management system built for the **Appening Infotech Full Stack Intern** practical task.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19 + Vite                     |
| Backend  | Python 3.11+ + FastAPI              |
| Database | PostgreSQL                          |
| ORM      | SQLAlchemy 2.0                      |
| HTTP     | Axios                               |

---

## Features

- ✅ View appointments in a **Kanban board** (Scheduled / Completed / Cancelled)
- ✅ **Add** new appointments with title, description, date, start/end time
- ✅ **Edit** existing appointments
- ✅ **Cancel** appointments (soft-delete — kept visible with Cancelled label)
- ✅ **Mark as Completed**
- ✅ **Filter** by date and/or status
- ✅ **Time-slot conflict detection** — prevents double-booking
- ✅ Client-side + server-side validation
- ✅ Toast notifications for all actions
- ✅ Pre-loaded sample appointments
- ✅ Premium dark-mode UI with animations

---

## Setup & Run

### 1. PostgreSQL — Create the Database

```sql
CREATE DATABASE appointment_board;
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure your DB connection
# Edit .env and update the DATABASE_URL:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/appointment_board

# Run the server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000  
API docs (Swagger): http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint                         | Description                    |
|--------|----------------------------------|--------------------------------|
| GET    | `/appointments/`                 | List all (supports filters)    |
| POST   | `/appointments/`                 | Create appointment             |
| GET    | `/appointments/{id}`             | Get single appointment         |
| PUT    | `/appointments/{id}`             | Update appointment             |
| PATCH  | `/appointments/{id}/status`      | Update status only             |
| DELETE | `/appointments/{id}`             | Cancel appointment             |

### Filter Query Params (GET /appointments/)
- `filter_date=YYYY-MM-DD`
- `filter_status=scheduled|completed|cancelled`

---

## Assumptions

1. **Conflict detection** only checks `scheduled` appointments — completed/cancelled slots can be reused.
2. **Cancellation** is a soft delete — the record stays in the DB with status `cancelled`.
3. **SQLAlchemy** auto-creates the table on first run (`create_all`).
4. **Seed data** is inserted only if the table is empty on startup.
5. The `end_time` must always be strictly after `start_time` on the same date.
