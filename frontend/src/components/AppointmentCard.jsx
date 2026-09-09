const STATUS_META = {
  scheduled: { label: "Scheduled", color: "status--scheduled" },
  completed: { label: "Completed", color: "status--completed" },
  cancelled: { label: "Cancelled", color: "status--cancelled" },
};

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AppointmentCard({ appt, onEdit, onStatusChange, onCancel }) {
  const meta = STATUS_META[appt.status] || STATUS_META.scheduled;
  const isCancelled = appt.status === "cancelled";
  const isCompleted = appt.status === "completed";

  return (
    <div className={`card ${isCancelled ? "card--cancelled" : ""}`}>
      <div className="card-header">
        <span className={`status-badge ${meta.color}`}>{meta.label}</span>
        <span className="card-date">{formatDate(appt.date)}</span>
      </div>

      <h3 className="card-title">{appt.title}</h3>

      {appt.description && (
        <p className="card-description">{appt.description}</p>
      )}

      <div className="card-time">
        ⏱ {formatTime(appt.start_time)} — {formatTime(appt.end_time)}
      </div>

      {!isCancelled && (
        <div className="card-actions">
          <button
            className="btn btn--edit"
            onClick={() => onEdit(appt)}
            title="Edit appointment"
          >
            Edit
          </button>

          {!isCompleted && (
            <button
              className="btn btn--complete"
              onClick={() => onStatusChange(appt.id, "completed")}
              title="Mark as completed"
            >
              Complete
            </button>
          )}

          <button
            className="btn btn--cancel"
            onClick={() => onCancel(appt.id)}
            title="Cancel appointment"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
