import React, { useState, useEffect } from 'react';
import './ScheduleModal.css'; // separate CSS

export default function ScheduleModal({ mentor, open, onClose, onConfirm }) {
  const [sessionType, setSessionType] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  useEffect(() => {
    if (open) {
      setSessionType(mentor?.sessionTypes[0] || '');
      setSessionTime('');
    }
  }, [open, mentor]);

  const handleConfirm = () => {
    if (!sessionType || !sessionTime) {
      alert('Please select both session type and time.');
      return;
    }
    onConfirm({ sessionType, sessionTime });
  };

  if (!open || !mentor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-square" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×XXXXXXXXXXXXXX
        </button>
        <h3>Schedule Session with {mentor.name}</h3>

        <label>
          Session Type:
          <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
            <option value="">Select type</option>
            {mentor.sessionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          Time:
          <input
            type="datetime-local"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!sessionType || !sessionTime}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}