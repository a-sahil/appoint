from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models
from routers import appointments as appointments_router
from datetime import date, time


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Appointment Board API",
    description="Full-stack appointment management system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appointments_router.router)


SEED_DATA = [
    {
        "title": "Team Standup",
        "description": "Daily sync with the engineering team to review blockers and progress.",
        "date": date(2026, 9, 10),
        "start_time": time(9, 0),
        "end_time": time(9, 30),
        "status": models.AppointmentStatus.scheduled,
    },
    {
        "title": "Product Demo",
        "description": "Demo the new appointment board feature to stakeholders.",
        "date": date(2026, 9, 10),
        "start_time": time(11, 0),
        "end_time": time(12, 0),
        "status": models.AppointmentStatus.scheduled,
    },
    {
        "title": "1-on-1 with Manager",
        "description": "Weekly check-in to discuss career growth and ongoing projects.",
        "date": date(2026, 9, 11),
        "start_time": time(14, 0),
        "end_time": time(14, 30),
        "status": models.AppointmentStatus.completed,
    },
    {
        "title": "Client Onboarding Call",
        "description": "Walk new client through the platform features.",
        "date": date(2026, 9, 12),
        "start_time": time(10, 0),
        "end_time": time(11, 0),
        "status": models.AppointmentStatus.scheduled,
    },
    {
        "title": "Sprint Planning",
        "description": "Plan tasks and estimates for the upcoming sprint.",
        "date": date(2026, 9, 9),
        "start_time": time(15, 0),
        "end_time": time(16, 30),
        "status": models.AppointmentStatus.cancelled,
    },
]


@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        count = db.query(models.Appointment).count()
        if count == 0:
            for item in SEED_DATA:
                appt = models.Appointment(**item)
                db.add(appt)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Appointment Board API is running 🚀"}
