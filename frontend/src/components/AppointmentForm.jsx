import { useState, useEffect } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  start_time: "",
  end_time: "",
};

export default function AppointmentForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        date: initial.date || "",
        start_time: initial.start_time?.slice(0, 5) || "",
        end_time: initial.end_time?.slice(0, 5) || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.start_time) e.start_time = "Start time is required.";
    if (!form.end_time) e.end_time = "End time is required.";
    if (form.start_time && form.end_time && form.end_time <= form.start_time)
      e.end_time = "End time must be after start time.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? "Edit Appointment" : "New Appointment"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Team Standup"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "input--error" : ""}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Optional notes..."
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? "input--error" : ""}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                className={errors.start_time ? "input--error" : ""}
              />
              {errors.start_time && (
                <span className="form-error">{errors.start_time}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                id="end_time"
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                className={errors.end_time ? "input--error" : ""}
              />
              {errors.end_time && (
                <span className="form-error">{errors.end_time}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Saving…" : initial ? "Update" : "Add Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
