import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShellNav from '../../components/layout/AppShellNav.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getSessionsForStudent, cancelSession } from '../../lib/sessionsStorage.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Modal from 'react-bootstrap/Modal'

const SESSION_TYPE_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'Resume Review',
}

const SESSION_TYPE_ICONS = {
  coaching: '🎯',
  mock_interview: '🎤',
  resume_review: '📄',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDateShort(isoString) {
  const d = new Date(isoString)
  return {
    day: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
  }
}

function SessionCard({ session, onCancel }) {
  const isPast = new Date(session.scheduledAt) < new Date()
  const typeLabel = SESSION_TYPE_LABELS[session.sessionType] ?? session.sessionType.replace('_', ' ')
  const typeIcon = SESSION_TYPE_ICONS[session.sessionType] ?? '📋'
  const { day, time } = formatDateShort(session.scheduledAt)

  return (
    <Card
      className="border-0 shadow-sm rounded-4 mb-3"
      style={{ opacity: isPast ? 0.75 : 1 }}
    >
      <Card.Body className="p-0">
        <Row className="g-0 align-items-stretch">

          {/* Left accent bar */}
          <Col
            xs="auto"
            className="rounded-start-4 d-flex align-items-center justify-content-center px-3"
            style={{
              background: isPast ? '#f0f5ff' : 'linear-gradient(180deg, #003E92 0%, #1557C0 100%)',
              minWidth: 56,
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '1.4rem', lineHeight: 1 }} aria-hidden="true">{typeIcon}</div>
            </div>
          </Col>

          {/* Main content */}
          <Col className="p-3 ps-4">
            <Stack direction="horizontal" gap={2} className="flex-wrap mb-1">
              {/* Mentor avatar + name */}
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                style={{ width: 32, height: 32, background: '#003E92', fontSize: 12 }}
              >
                {getInitials(session.mentorName)}
              </div>
              <div>
                <span className="fw-semibold" style={{ fontSize: '0.9rem', color: '#0a0f1e' }}>
                  {session.mentorName}
                </span>
                <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>
                  · {session.mentorFirm}
                </span>
              </div>
              <div className="ms-auto">
                {isPast ? (
                  <Badge
                    className="rounded-pill fw-normal"
                    style={{ background: '#e8f0fe', color: '#1557C0', fontSize: '0.72rem' }}
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    className="rounded-pill fw-normal"
                    style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: '0.72rem' }}
                  >
                    <span aria-hidden="true">●</span> Upcoming
                  </Badge>
                )}
              </div>
            </Stack>

            <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
              {session.mentorRole}
            </div>

            <Stack direction="horizontal" gap={3} className="flex-wrap">
              <div
                className="px-2 py-1 rounded-2 fw-medium"
                style={{
                  background: '#f0f5ff',
                  color: '#003E92',
                  fontSize: '0.78rem',
                  border: '1px solid #dce8ff',
                }}
              >
                {typeLabel}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                <span aria-hidden="true">📅</span> {day} at {time}
              </div>
            </Stack>
          </Col>

          {/* Action column */}
          {!isPast && (
            <Col
              xs="auto"
              className="d-flex align-items-center pe-3"
            >
              <Button
                variant="outline-danger"
                size="sm"
                className="rounded-3"
                style={{ fontSize: '0.78rem', borderColor: 'rgba(220,38,38,0.3)' }}
                onClick={() => onCancel(session.id)}
              >
                Cancel
              </Button>
            </Col>
          )}

        </Row>
      </Card.Body>
    </Card>
  )
}

export default function StudentSessions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState(() => getSessionsForStudent(user.username))
  const [cancelTarget, setCancelTarget] = useState(null) // session id to confirm cancel

  const refresh = useCallback(() => {
    setSessions(getSessionsForStudent(user.username))
  }, [user.username])

  const handleCancelRequest = (id) => setCancelTarget(id)

  const handleCancelConfirm = () => {
    if (!cancelTarget) return
    cancelSession(cancelTarget)
    setCancelTarget(null)
    refresh()
  }

  const now = new Date()
  const upcoming = sessions.filter((s) => new Date(s.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  const past = sessions.filter((s) => new Date(s.scheduledAt) < now)
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))

  return (
    <div className="min-vh-100 bg-light">
      <AppShellNav />

      <Container fluid="xl" className="py-5">

        {/* Page header */}
        <Row className="mb-4 align-items-end">
          <Col>
            <h1
              className="fw-bold mb-1"
              style={{ letterSpacing: '-0.5px', fontFamily: "'Cormorant Garamond', serif" }}
            >
              My Sessions
            </h1>
            <p className="text-muted mb-0">
              All your booked and completed mentoring sessions.
            </p>
          </Col>
          <Col xs="auto">
            <Button
              className="rounded-3"
              style={{ background: '#003E92', borderColor: '#003E92' }}
              onClick={() => navigate('/browse')}
            >
              + Book a Session
            </Button>
          </Col>
        </Row>

        {sessions.length === 0 ? (
          /* ── Empty state ── */
          <Card className="border-0 shadow-sm rounded-4 text-center py-5">
            <Card.Body>
              <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: 16 }} aria-hidden="true">📅</div>
              <h2 className="h4 fw-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No sessions yet
              </h2>
              <p className="text-muted mb-4" style={{ maxWidth: 340, margin: '0 auto 24px' }}>
                Browse our roster of mentors and book your first 1:1 session.
              </p>
              <Button
                className="rounded-3 px-4"
                style={{ background: '#003E92', borderColor: '#003E92' }}
                onClick={() => navigate('/browse')}
              >
                Browse Mentors →
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            {/* ── Upcoming ── */}
            <section className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <h2
                  className="h5 fw-semibold mb-0 text-uppercase"
                  style={{ letterSpacing: '0.08em', fontSize: '0.78rem', color: '#7a80a0' }}
                >
                  Upcoming
                </h2>
                {upcoming.length > 0 && (
                  <Badge
                    className="rounded-pill"
                    style={{ background: '#f0f5ff', color: '#003E92', border: '1px solid #dce8ff', fontWeight: 600 }}
                  >
                    {upcoming.length}
                  </Badge>
                )}
              </div>

              {upcoming.length === 0 ? (
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="text-center py-4">
                    <p className="text-muted mb-2 small">No upcoming sessions scheduled.</p>
                    <Button
                      variant="link"
                      className="p-0 small fw-semibold text-decoration-none"
                      style={{ color: '#003E92' }}
                      onClick={() => navigate('/browse')}
                    >
                      Book one now →
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                upcoming.map((s) => (
                  <SessionCard key={s.id} session={s} onCancel={handleCancelRequest} />
                ))
              )}
            </section>

            {/* ── Past ── */}
            {past.length > 0 && (
              <section>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <h2
                    className="h5 fw-semibold mb-0 text-uppercase"
                    style={{ letterSpacing: '0.08em', fontSize: '0.78rem', color: '#7a80a0' }}
                  >
                    Past Sessions
                  </h2>
                  <Badge
                    className="rounded-pill"
                    style={{ background: '#f5f5f5', color: '#7a80a0', border: '1px solid #dde3f0', fontWeight: 600 }}
                  >
                    {past.length}
                  </Badge>
                </div>

                {past.map((s) => (
                  <SessionCard key={s.id} session={s} onCancel={handleCancelRequest} />
                ))}
              </section>
            )}
          </>
        )}
      </Container>

      {/* ── Cancel confirmation modal ── */}
      <Modal show={!!cancelTarget} onHide={() => setCancelTarget(null)} centered>
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fs-6 fw-semibold">Cancel Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted small mb-0">
            Are you sure you want to cancel this session? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 gap-2">
          <Button variant="outline-secondary" className="rounded-3" onClick={() => setCancelTarget(null)}>
            Keep Session
          </Button>
          <Button variant="danger" className="rounded-3" onClick={handleCancelConfirm}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}