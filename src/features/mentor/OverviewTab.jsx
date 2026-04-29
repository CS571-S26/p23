// features/mentor/OverviewTab.jsx
import { useMemo } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Stack from 'react-bootstrap/Stack'
import ProgressBar from 'react-bootstrap/ProgressBar'

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

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function OverviewTab({ sessions, mentor, onTabChange }) {
  const now = new Date()

  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.scheduledAt) >= now)
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [sessions],
  )

  const past = useMemo(
    () => sessions.filter((s) => new Date(s.scheduledAt) < now),
    [sessions],
  )

  const totalEarned = useMemo(
    () => past.reduce((sum, s) => sum + (s.price ?? 0), 0),
    [past],
  )

  // Month goal = rough estimate based on avg session rate
  const monthlyGoal = 1500
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEarned = useMemo(
    () =>
      past
        .filter((s) => new Date(s.scheduledAt) >= startOfMonth)
        .reduce((sum, s) => sum + (s.price ?? 0), 0),
    [past],
  )
  const progressPct = Math.min(100, Math.round((monthEarned / monthlyGoal) * 100))

  // Next session
  const nextSession = upcoming[0] ?? null

  return (
    <div>
      {/* Next session banner */}
      {nextSession && (
        <div
          className="rounded-4 p-4 mb-4 d-flex align-items-center gap-3 flex-wrap"
          style={{
            background: 'linear-gradient(135deg, #003E92 0%, #1557C0 100%)',
            color: '#fff',
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
            style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', fontSize: 14 }}
          >
            {getInitials(nextSession.mentorName)}
          </div>
          <div className="flex-grow-1">
            <div style={{ fontSize: '0.72rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Next Session
            </div>
            <div className="fw-semibold" style={{ fontSize: '1rem' }}>
              <span aria-hidden="true">{SESSION_TYPE_ICONS[nextSession.sessionType]}</span> {SESSION_TYPE_LABELS[nextSession.sessionType] ?? nextSession.sessionType} with{' '}
              <strong>{nextSession.studentUsername}</strong>
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{formatDate(nextSession.scheduledAt)}</div>
          </div>
          <Button
            size="sm"
            className="rounded-3 fw-semibold"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', whiteSpace: 'nowrap' }}
            onClick={() => onTabChange('sessions')}
          >
            View all →
          </Button>
        </div>
      )}

      {/* Stat cards */}
      <Row className="g-3 mb-4">
        {[
          {
            label: 'Total Earned',
            value: `$${totalEarned.toLocaleString()}`,
            sub: `${past.length} completed sessions`,
            subColor: '#1b5e20',
            icon: '💰',
          },
          {
            label: 'This Month',
            value: `$${monthEarned.toLocaleString()}`,
            sub: `of $${monthlyGoal.toLocaleString()} goal`,
            subColor: '#003E92',
            icon: '📈',
          },
          {
            label: 'Upcoming',
            value: upcoming.length,
            sub: 'sessions scheduled',
            subColor: '#b07800',
            icon: '📅',
          },
          {
            label: 'Avg Rating',
            value: `${mentor?.rating ?? '–'} ⭐`,
            sub: `${mentor?.totalSessions ?? 0} total sessions`,
            subColor: '#6b6375',
            icon: '🏆',
          },
        ].map((stat) => (
          <Col key={stat.label} xs={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ overflow: 'hidden' }}>
              <Card.Body className="p-3 p-md-4">
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{stat.icon}</div>
                <div className="text-muted small mb-1" style={{ fontSize: '0.78rem' }}>{stat.label}</div>
                <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#0a0f1e', lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div className="mt-1" style={{ fontSize: '0.75rem', color: stat.subColor }}>{stat.sub}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Monthly progress */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <Stack direction="horizontal" className="mb-3">
            <div>
              <div className="fw-semibold" style={{ color: '#0a0f1e' }}>Monthly Earnings Goal</div>
              <div className="text-muted small">Track your progress toward ${monthlyGoal.toLocaleString()}</div>
            </div>
            <div className="ms-auto text-end">
              <div className="fw-bold" style={{ color: '#003E92', fontSize: '1.1rem' }}>${monthEarned.toLocaleString()}</div>
              <div className="text-muted small">of ${monthlyGoal.toLocaleString()}</div>
            </div>
          </Stack>
          <ProgressBar
            now={progressPct}
            style={{ height: 10, borderRadius: 99 }}
          >
            <ProgressBar
              now={progressPct}
              style={{
                background: 'linear-gradient(90deg, #003E92, #1557C0)',
                borderRadius: 99,
                transition: 'width 0.8s ease',
              }}
            />
          </ProgressBar>
          <div className="text-muted small mt-2">{progressPct}% complete</div>
        </Card.Body>
      </Card>

      {/* Upcoming sessions list */}
      <Row className="g-3">
        <Col xs={12} lg={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
              <h6 className="fw-semibold mb-0" style={{ color: '#0a0f1e' }}>Upcoming Sessions</h6>
              {upcoming.length > 3 && (
                <Button variant="link" className="p-0 small text-decoration-none" style={{ color: '#003E92' }} onClick={() => onTabChange('sessions')}>
                  View all →
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-3 pt-0">
              {upcoming.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
                  <p className="text-muted small mb-0">No upcoming sessions.</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {upcoming.slice(0, 4).map((s) => (
                    <ListGroup.Item key={s.id} className="px-2 py-3 border-0 border-bottom">
                      <Stack direction="horizontal" gap={2}>
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white flex-shrink-0"
                          style={{ width: 34, height: 34, background: '#003E92', fontSize: 12 }}
                        >
                          {getInitials(s.studentUsername)}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-medium text-truncate" style={{ fontSize: '0.88rem', color: '#0a0f1e' }}>
                            {s.studentUsername}
                          </div>
                          <div className="text-muted text-truncate" style={{ fontSize: '0.76rem' }}>
                            {SESSION_TYPE_ICONS[s.sessionType]} {SESSION_TYPE_LABELS[s.sessionType] ?? s.sessionType} · {formatDate(s.scheduledAt)}
                          </div>
                        </div>
                        <div className="fw-semibold flex-shrink-0" style={{ color: '#003E92', fontSize: '0.88rem' }}>
                          ${s.price ?? 0}
                        </div>
                      </Stack>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Session breakdown */}
        <Col xs={12} lg={5}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
              <h6 className="fw-semibold mb-0" style={{ color: '#0a0f1e' }}>Session Breakdown</h6>
            </Card.Header>
            <Card.Body className="p-4 pt-2">
              {['mock_interview', 'coaching', 'resume_review'].map((type) => {
                const count = sessions.filter((s) => s.sessionType === type).length
                const pct = sessions.length ? Math.round((count / sessions.length) * 100) : 0
                return (
                  <div key={type} className="mb-3">
                    <Stack direction="horizontal" className="mb-1">
                      <span style={{ fontSize: '0.82rem', color: '#0a0f1e' }}>
                        {SESSION_TYPE_ICONS[type]} {SESSION_TYPE_LABELS[type]}
                      </span>
                      <span className="ms-auto text-muted small">{count} · {pct}%</span>
                    </Stack>
                    <div style={{ height: 6, background: '#f0f5ff', borderRadius: 99, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #003E92, #1557C0)',
                          borderRadius: 99,
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}

              {sessions.length === 0 && (
                <p className="text-muted small text-center py-3 mb-0">No session data yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}