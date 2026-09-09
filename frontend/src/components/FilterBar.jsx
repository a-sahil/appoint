export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filter-date">Date</label>
        <input
          id="filter-date"
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
        />
        {filters.date && (
          <button
            className="btn-clear"
            onClick={() => onChange({ ...filters, date: "" })}
            title="Clear date filter"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {(filters.date || filters.status) && (
        <button
          className="btn-reset"
          onClick={() => onChange({ date: "", status: "" })}
        >
          Reset
        </button>
      )}
    </div>
  );
}
