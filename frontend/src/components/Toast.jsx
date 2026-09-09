import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.type}`}
          onClick={() => removeToast(t.id)}
        >
          <span className="toast-icon">
            {t.type === "success" ? "✓" : "✕"}
          </span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
