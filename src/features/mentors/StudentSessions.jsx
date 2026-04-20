import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShellNav from '../../components/layout/AppShellNav.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getSessionsForStudent, cancelSession } from '../../lib/sessionsStorage.js'

const SESSION_TYPE_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'Resume Review',
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SessionRow({ session, onCancel }) {
  const isPast = new Date(session.scheduledAt) < new Date()
  const typeLabel = SESSION_TYPE_LABELS[session.sessionType] ?? session.sessionType.replace('_', ' ')

  return (
    <div className={`session-row session-row-student ${isPast ? 'session-row-past' : ''}`}>
      <div className="session-row-left">
        <div className="mentor-avatar mentor-avatar-sm">
          {session.mentorName.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="session-name">{session.mentorName}</p>
          <p className="session-meta">
            {session.mentorRole} · {session.mentorFirm}
          </p>
          <p className="session-meta">
            <span className="session-type-badge">{typeLabel}</span>
            &nbsp;·&nbsp;{formatDate(session.scheduledAt)}
          </p>
        </div>
      </div>
      {!isPast && (
        <button
          className="btn btn-ghost btn-cancel"
          onClick={() => onCancel(session.id)}
        >
          Cancel
        </button>
      )}
      {isPast && <span className="session-status-badge session-status-past">Completed</span>}
    </div>
  )
}

export default function StudentSessions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState(() => getSessionsForStudent(user.username))

  const refresh = useCallback(() => {
    setSessions(getSessionsForStudent(user.username))
  }, [user.username])

  const handleCancel = (id) => {
    if (!window.confirm('Cancel this session?')) return
    cancelSession(id)
    refresh()
  }

  const now = new Date()
  const upcoming = sessions.filter((s) => new Date(s.scheduledAt) >= now)
  const past = sessions.filter((s) => new Date(s.scheduledAt) < now)

  return (
    <div className="ace-root browse-page">
      <AppShellNav />
      <main className="browse-main">
        <div className="browse-header">
          <h1 className="section-title browse-title">My Sessions</h1>
          <p className="browse-sub">All your booked and completed sessions.</p>
        </div>

        {sessions.length === 0 ? (
          <div className="sessions-empty">
            <div className="sessions-empty-icon" aria-hidden="true">📅</div>
            <h2 className="sessions-empty-title">No sessions yet</h2>
            <p className="sessions-empty-sub">
              Browse our roster of mentors and book your first session.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/browse')}>
              Browse mentors →
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            <section className="sessions-section">
              <h2 className="sessions-section-title">
                Upcoming
                {upcoming.length > 0 && (
                  <span className="sessions-count">{upcoming.length}</span>
                )}
              </h2>
              {upcoming.length === 0 ? (
                <p className="browse-sub sessions-none-sub">
                  No upcoming sessions.{' '}
                  <button className="inline-link" onClick={() => navigate('/browse')}>
                    Book one now →
                  </button>
                </p>
              ) : (
                <div className="dash-card-lg sessions-list">
                  {upcoming.map((s) => (
                    <SessionRow key={s.id} session={s} onCancel={handleCancel} />
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            {past.length > 0 && (
              <section className="sessions-section">
                <h2 className="sessions-section-title">Past</h2>
                <div className="dash-card-lg sessions-list">
                  {past.map((s) => (
                    <SessionRow key={s.id} session={s} onCancel={handleCancel} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
