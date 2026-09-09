from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import date
from typing import Optional

import models
import schemas


def _has_conflict(
    db: Session,
    appt_date: date,
    start_time,
    end_time,
    exclude_id: Optional[int] = None,
) -> bool:
    query = db.query(models.Appointment).filter(
        models.Appointment.date == appt_date,
        models.Appointment.status == models.AppointmentStatus.scheduled,
        models.Appointment.start_time < end_time,
        models.Appointment.end_time > start_time,
    )
    if exclude_id:
        query = query.filter(models.Appointment.id != exclude_id)
    return query.first() is not None


def get_appointments(
    db: Session,
    filter_date: Optional[date] = None,
    filter_status: Optional[str] = None,
):
    query = db.query(models.Appointment)
    if filter_date:
        query = query.filter(models.Appointment.date == filter_date)
    if filter_status:
        query = query.filter(models.Appointment.status == filter_status)
    return query.order_by(models.Appointment.date, models.Appointment.start_time).all()


def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()


def create_appointment(db: Session, data: schemas.AppointmentCreate):
    if _has_conflict(db, data.date, data.start_time, data.end_time):
        return None, "This time slot is already taken by another appointment."

    appt = models.Appointment(**data.model_dump(), status=models.AppointmentStatus.scheduled)
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt, None


def update_appointment(db: Session, appointment_id: int, data: schemas.AppointmentUpdate):
    appt = get_appointment(db, appointment_id)
    if not appt:
        return None, "Appointment not found."

    if _has_conflict(db, data.date, data.start_time, data.end_time, exclude_id=appointment_id):
        return None, "This time slot is already taken by another appointment."

    for field, value in data.model_dump().items():
        setattr(appt, field, value)
    db.commit()
    db.refresh(appt)
    return appt, None


def update_appointment_status(db: Session, appointment_id: int, status: models.AppointmentStatus):
    appt = get_appointment(db, appointment_id)
    if not appt:
        return None, "Appointment not found."
    appt.status = status
    db.commit()
    db.refresh(appt)
    return appt, None


def delete_appointment(db: Session, appointment_id: int):
    appt = get_appointment(db, appointment_id)
    if not appt:
        return False
    appt.status = models.AppointmentStatus.cancelled
    db.commit()
    return True
