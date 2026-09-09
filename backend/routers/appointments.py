from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

import crud
import schemas
from database import get_db
from models import AppointmentStatus

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.get("/", response_model=list[schemas.AppointmentOut])
def list_appointments(
    filter_date: Optional[date] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    filter_status: Optional[AppointmentStatus] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
):
    return crud.get_appointments(db, filter_date=filter_date, filter_status=filter_status)


@router.get("/{appointment_id}", response_model=schemas.AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = crud.get_appointment(db, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appt


@router.post("/", response_model=schemas.AppointmentOut, status_code=201)
def create_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    appt, error = crud.create_appointment(db, data)
    if error:
        raise HTTPException(status_code=409, detail=error)
    return appt


@router.put("/{appointment_id}", response_model=schemas.AppointmentOut)
def update_appointment(appointment_id: int, data: schemas.AppointmentUpdate, db: Session = Depends(get_db)):
    appt, error = crud.update_appointment(db, appointment_id, data)
    if error:
        status_code = 404 if "not found" in error.lower() else 409
        raise HTTPException(status_code=status_code, detail=error)
    return appt


@router.patch("/{appointment_id}/status", response_model=schemas.AppointmentOut)
def update_status(appointment_id: int, data: schemas.AppointmentStatusUpdate, db: Session = Depends(get_db)):
    appt, error = crud.update_appointment_status(db, appointment_id, data.status)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return appt


@router.delete("/{appointment_id}", status_code=200)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    success = crud.delete_appointment(db, appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment cancelled successfully"}
