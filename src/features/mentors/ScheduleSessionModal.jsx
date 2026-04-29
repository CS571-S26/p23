import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert'
import { saveSession } from '../../lib/sessionsStorage.js'
import { useAuth } from '../../context/AuthContext.jsx'

const SESSION_TYPE_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'Resume Review',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

const TRACK_COLORS = {
  'Investment Banking': { bg: '#fff8e1', color: '#b07800', border: '#ffe082' },
  'Management Consulting': { bg: '#e8f5e9', color: '#1b5e20', border: '#a5d6a7' },
  'Tech & FAANG': { bg: '#e1f5fe', color: '#01579b', border: '#81d4fa' },
  'Private Equity': { bg: '#f3e5f5', color: '#4a148c', border: '#ce93d8' },
}

export default function ScheduleSessionModal({ mentor, show, onHide, onBooked }) {
  const { user } = useAuth()
  const [sessionType, setSessionType] = useState('')
  const [sessionTime, setSessionTime] = useState('')
  const [phase, setPhase] = useState('form') // 'form' | 'success'
  const [errorMsg, setErrorMsg] = useState('')

  // Reset when mentor changes or modal opens
  useEffect(() => {
    if (show && mentor) {
      setSessionType(mentor.sessionTypes[0] || '')
      setSessionTime('')
      setPhase('form')
      setErrorMsg('')
    }
  }, [show, mentor])

  if (!mentor) return null

  const trackStyle = TRACK_COLORS[mentor.track] || { bg: '#f5f5f5', color: '#333', border: '#ccc' }

  const minDateTime = new Date()
  minDateTime.setMinutes(minDateTime.getMinutes() + 30)
  const minStr = minDateTime.toISOString().slice(0, 16)

  const handleConfirm = () => {
    if (!sessionType || !sessionTime) {
      setErrorMsg('Please select both a session type and a time.')
      return
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
      price: mentor.pricePerSession ?? 0,
    }
    try {
      saveSession(session)
      setPhase('success')
      setErrorMsg('')
      onBooked?.(session)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  const typeLabel = SESSION_TYPE_LABELS[sessionType] ?? sessionType.replace('_', ' ')
  const formattedTime = sessionTime
    ? new Date(sessionTime).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      backdrop="static"
    >
      {phase === 'success' ? (
        <>
          <Modal.Body className="text-center py-5 px-4">
            {/* Success icon */}
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 72,
                height: 72,
                background: 'linear-gradient(135deg, #003E92 0%, #1557C0 100%)',
                boxShadow: '0 8px 24px rgba(0,62,146,0.3)',
                fontSize: '2rem',
              }}
            >
              ✓
            </div>
            <h4 className="fw-bold mb-1" style={{ color: '#0a0f1e', fontFamily: "'Cormorant Garamond', serif" }}>
              You're booked!
            </h4>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              <strong>{typeLabel}</strong> with <strong>{mentor.name}</strong>
            </p>
            <div
              className="d-inline-block px-3 py-2 rounded-pill mb-4 mt-2"
              style={{ background: '#f0f5ff', color: '#003E92', fontSize: '0.85rem', fontWeight: 500 }}
            >
              📅 {formattedTime}
            </div>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Button
                variant="outline-secondary"
                className="rounded-3"
                onClick={onHide}
              >
                Browse more mentors
              </Button>
              <Button
                variant="dark"
                className="rounded-3"
                style={{ background: '#003E92', borderColor: '#003E92' }}
                href="#/my-sessions"
                onClick={onHide}
              >
                View my sessions →
              </Button>
            </div>
          </Modal.Body>
        </>
      ) : (
        <>
          <Modal.Header className="border-0 pb-0 pt-4 px-4">
            {/* Mentor info header */}
            <div className="w-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                  style={{ width: 52, height: 52, background: '#003E92', fontSize: 17 }}
                >
                  {getInitials(mentor.name)}
                </div>
                <div>
                  <div className="fw-semibold fs-6" style={{ color: '#0a0f1e' }}>{mentor.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {mentor.role} · {mentor.firm}
                  </div>
                </div>
                <Button
                  variant="link"
                  className="ms-auto p-0 text-muted text-decoration-none fs-5 lh-1"
                  onClick={onHide}
                  aria-label="Close"
                >
                  ×
                </Button>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span
                  className="badge rounded-pill px-2 py-1"
                  style={{
                    background: trackStyle.bg,
                    color: trackStyle.color,
                    border: `1px solid ${trackStyle.border}`,
                    fontWeight: 600,
                    fontSize: '0.72rem',
                  }}
                >
                  {mentor.track}
                </span>
                <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                  <span aria-hidden="true">⭐</span> {mentor.rating} · {mentor.totalSessions} sessions
                </span>
                <span className="ms-auto fw-bold" style={{ color: '#003E92', fontSize: '0.9rem' }}>
                  ${mentor.pricePerSession}<span className="text-muted fw-normal" style={{ fontSize: '0.78rem' }}> / session</span>
                </span>
              </div>

              <hr className="mt-3 mb-0" />
            </div>
          </Modal.Header>

          <Modal.Body className="px-4 pt-3 pb-2">
            <h2 className="h6 fw-semibold mb-3" style={{ color: '#0a0f1e' }}>
              Book a Session
            </h2>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="modal-session-type" className="fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                Session Type
              </Form.Label>
              <Form.Select
                id="modal-session-type"
                value={sessionType}
                onChange={(e) => { setSessionType(e.target.value); setErrorMsg('') }}
                className="rounded-3"
                style={{ borderColor: '#dde3f0', fontSize: '0.9rem' }}
              >
                <option value="">Select a session type…</option>
                {mentor.sessionTypes.map((t) => (
                  <option key={t} value={t}>
                    {SESSION_TYPE_LABELS[t] ?? t.replace('_', ' ')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Session type info chips */}
            {sessionType && (
              <div
                className="p-3 rounded-3 mb-3 d-flex align-items-start gap-2"
                style={{ background: '#f0f5ff', border: '1px solid #dce8ff' }}
              >
                <span style={{ fontSize: '1.1rem' }} aria-hidden="true">
                  {sessionType === 'coaching' ? '🎯' : sessionType === 'mock_interview' ? '🎤' : '📄'}
                </span>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '0.85rem', color: '#003E92' }}>
                    {SESSION_TYPE_LABELS[sessionType]}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                    {sessionType === 'coaching' && 'A tailored 1:1 strategy session covering your goals, timeline, and action plan.'}
                    {sessionType === 'mock_interview' && 'A realistic interview simulation with detailed feedback on your performance.'}
                    {sessionType === 'resume_review' && 'Line-by-line resume feedback to maximize your chance of getting a callback.'}
                  </div>
                </div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label htmlFor="modal-session-time" className="fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                Date & Time
              </Form.Label>
              <Form.Control
                id="modal-session-time"
                type="datetime-local"
                value={sessionTime}
                min={minStr}
                onChange={(e) => { setSessionTime(e.target.value); setErrorMsg('') }}
                className="rounded-3"
                style={{ borderColor: '#dde3f0', fontSize: '0.9rem' }}
              />
            </Form.Group>

            {errorMsg && (
              <Alert variant="danger" className="py-2 small rounded-3">
                {errorMsg}
              </Alert>
            )}
          </Modal.Body>

          <Modal.Footer className="border-0 px-4 pb-4 pt-2 gap-2">
            <Button
              variant="outline-secondary"
              className="rounded-3"
              onClick={onHide}
            >
              Cancel
            </Button>
            <Button
              className="rounded-3 px-4"
              disabled={!sessionType || !sessionTime}
              onClick={handleConfirm}
              style={{
                background: !sessionType || !sessionTime ? undefined : '#003E92',
                borderColor: !sessionType || !sessionTime ? undefined : '#003E92',
              }}
            >
              Confirm Booking — ${mentor.pricePerSession}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}