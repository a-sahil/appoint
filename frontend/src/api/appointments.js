import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getAppointments = (params = {}) =>
  API.get("/appointments/", { params });

export const getAppointment = (id) => API.get(`/appointments/${id}`);

export const createAppointment = (data) => API.post("/appointments/", data);

export const updateAppointment = (id, data) =>
  API.put(`/appointments/${id}`, data);

export const updateAppointmentStatus = (id, status) =>
  API.patch(`/appointments/${id}/status`, { status });

export const cancelAppointment = (id) => API.delete(`/appointments/${id}`);
