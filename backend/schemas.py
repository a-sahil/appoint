from pydantic import BaseModel, field_validator
from datetime import date, time
from typing import Optional
from models import AppointmentStatus


class AppointmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: date
    start_time: time
    end_time: time

    @field_validator("end_time")
    @classmethod
    def end_must_be_after_start(cls, end, info):
        start = info.data.get("start_time")
        if start and end <= start:
            raise ValueError("end_time must be after start_time")
        return end


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(AppointmentBase):
    pass


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentOut(AppointmentBase):
    id: int
    status: AppointmentStatus

    model_config = {"from_attributes": True}
