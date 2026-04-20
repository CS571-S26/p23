import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { saveSession } from '../../lib/sessionsStorage.js';
import './ScheduleSession.css';

const SESSION_TYPE_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'Resume Review',
};

export default function ScheduleSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mentor = location.state?.mentor;

  const [sessionType, setSessionType] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [phase, setPhase] = useState('form'); // 'form' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!mentor) {
      navigate('/browse');
      return;
    }
    setSessionType(mentor.sessionTypes[0] || '');
  }, [mentor, navigate]);

  const handleConfirm = () => {
    if (!sessionType || !sessionTime) {
      setErrorMsg('Please select both a session type and a time.');
      return;
    }

    const session = {
      id: crypto.randomUUID(),
      studentUsername: user.username,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorFirm: mentor.firm,
      mentorRole: mentor.role,
      sessionType,
      scheduledAt: sessionTime,
      bookedAt: new Date().toISOString(),
      status: 'upcoming',
    };

    try {
      saveSession(session);
      setPhase('success');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!mentor) return null;

  const typeLabel = SESSION_TYPE_LABELS[sessionType] ?? sessionType.replace('_', ' ');

  return (
    <div className="schedule-page-backdrop">
      <div className="schedule-box">

        {/* ── SUCCESS SCREEN ───────────────── */}
        {phase === 'success' ? (
          <div className="schedule-success">
            <div className="schedule-success-icon" aria-hidden="true">✓</div>
            <h2 className="schedule-title">You're booked!</h2>
            <p className="schedule-success-detail">
              <strong>{typeLabel}</strong> with <strong>{mentor.name}</strong>
            </p>
            <p className="schedule-success-time">
              {new Date(sessionTime).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            <div className="schedule-actions schedule-actions-success">
              <button className="btn btn-outline" onClick={() => navigate('/browse')}>
                Browse more
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/my-sessions')}>
                View my sessions →
              </button>
            </div>
          </div>
        ) : (

        /* ── FORM ───────────────── */
        <>
          <button className="schedule-close" onClick={() => navigate(-1)}>×</button>
          <h2 className="schedule-title">Schedule with {mentor.name}</h2>
          <p className="schedule-mentor-sub">{mentor.role} · {mentor.firm}</p>

          <label className="schedule-label">
            Session Type
            <select
              className="schedule-select"
              value={sessionType}
              onChange={(e) => { setSessionType(e.target.value); setErrorMsg(''); }}
            >
              <option value="">Select type</option>
              {mentor.sessionTypes.map((t) => (
                <option key={t} value={t}>
                  {SESSION_TYPE_LABELS[t] ?? t.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>

          <label className="schedule-label">
            Date & Time
            <input
              type="datetime-local"
              className="schedule-input"
              value={sessionTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => { setSessionTime(e.target.value); setErrorMsg(''); }}
            />
          </label>

          {errorMsg && <p className="schedule-error">{errorMsg}</p>}

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
        </>
        )}
      </div>
    </div>
  );
}
