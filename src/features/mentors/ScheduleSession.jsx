import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ScheduleSession.css';

export default function ScheduleSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const mentor = location.state?.mentor;

  const [sessionType, setSessionType] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  useEffect(() => {
    if (mentor) {
      setSessionType(mentor.sessionTypes[0] || '');
      setSessionTime('');
    } else {
      // If no mentor info, go back
      navigate('/browse');
    }
  }, [mentor, navigate]);

  const handleConfirm = () => {
    if (!sessionType || !sessionTime) {
      alert('Please select both session type and time.');
      return;
    }
    // Show alert and go back to mentor dashboard
    alert(`✅ Scheduled ${sessionType} with ${mentor.name} at ${sessionTime}`);
    navigate('/browse'); // go back to browse page
  };

  return (
    <div className="schedule-page-backdrop">
      <div className="schedule-box">
        <button className="schedule-close" onClick={() => navigate(-1)}>×</button>
        <h2 className="schedule-title">Schedule Session with {mentor.name}</h2>

        <label className="schedule-label">
          Session Type
          <select
            className="schedule-select"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <option value="">Select type</option>
            {mentor.sessionTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="schedule-label">
          Time
          <input
            type="datetime-local"
            className="schedule-input"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
          />
        </label>

        <div className="schedule-actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!sessionType || !sessionTime}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}