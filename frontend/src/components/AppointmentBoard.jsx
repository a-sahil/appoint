import { useState, useEffect, useCallback } from "react";
import AppointmentCard from "./AppointmentCard";
import AppointmentForm from "./AppointmentForm";
import FilterBar from "./FilterBar";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from "../api/appointments";

export default function AppointmentBoard({ addToast }) {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ date: "", status: "" });
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.date) params.filter_date = filters.date;
      if (filters.status) params.filter_status = filters.status;
      const res = await getAppointments(params);
      setAppointments(res.data);
    } catch {
      addToast("Failed to load appointments.", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await updateAppointment(editTarget.id, formData);
        addToast("Appointment updated successfully!", "success");
      } else {
        await createAppointment(formData);
        addToast("Appointment added successfully!", "success");
      }
      setShowForm(false);
      setEditTarget(null);
      fetchAppointments();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      addToast(detail || "Something went wrong.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (appt) => {
    setEditTarget(appt);
    setShowForm(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      addToast(`Appointment marked as ${status}!`, "success");
      fetchAppointments();
    } catch {
      addToast("Failed to update status.", "error");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      addToast("Appointment cancelled.", "success");
      fetchAppointments();
    } catch {
      addToast("Failed to cancel appointment.", "error");
    }
  };

  const openNewForm = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const scheduled = appointments.filter((a) => a.status === "scheduled");
  const completed = appointments.filter((a) => a.status === "completed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  const isFiltered = filters.date || filters.status;

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div className="board-title-wrap">
          <div className="board-eyebrow">
            <span className="board-eyebrow-dot" />
            Appointment Manager
          </div>
          <h1 className="board-title">
            Manage Your <span>Schedule.</span>
          </h1>
          <div className="stats-strip">
            <div className="stat-pill">
              <span className="stat-pill-dot green" />
              {appointments.filter(a => a.status === 'scheduled').length} Scheduled
            </div>
            <div className="stat-pill">
              <span className="stat-pill-dot amber" />
              {appointments.filter(a => a.status === 'completed').length} Completed
            </div>
            <div className="stat-pill">
              <span className="stat-pill-dot red" />
              {appointments.filter(a => a.status === 'cancelled').length} Cancelled
            </div>
          </div>
        </div>
        <button id="add-appointment-btn" className="btn btn--primary btn--lg" onClick={openNewForm}>
          + Add Appointment →
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading appointments…</p>
        </div>
      ) : isFiltered ? (
        <div className="flat-list">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No appointments match your filters.</p>
            </div>
          ) : (
            appointments.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      ) : (
        <div className="board-columns">
          <Column title="🗓 Scheduled" count={scheduled.length} color="col--scheduled">
            {scheduled.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            ))}
            {scheduled.length === 0 && <EmptyCol label="No scheduled appointments" />}
          </Column>

          <Column title="✅ Completed" count={completed.length} color="col--completed">
            {completed.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            ))}
            {completed.length === 0 && <EmptyCol label="No completed appointments" />}
          </Column>

          <Column title="🚫 Cancelled" count={cancelled.length} color="col--cancelled">
            {cancelled.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            ))}
            {cancelled.length === 0 && <EmptyCol label="No cancelled appointments" />}
          </Column>
        </div>
      )}

      {showForm && (
        <AppointmentForm
          initial={editTarget}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}

function Column({ title, count, color, children }) {
  return (
    <div className={`board-column ${color}`}>
      <div className="column-header">
        <span className="column-title">{title}</span>
        <span className="column-count">{count}</span>
      </div>
      <div className="column-cards">{children}</div>
    </div>
  );
}

function EmptyCol({ label }) {
  return (
    <div className="empty-col">
      <p>{label}</p>
    </div>
  );
}
