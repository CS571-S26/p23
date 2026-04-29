// features/mentor/SessionsTab.jsx
import { useMemo, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'

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
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Generate list of unique months from sessions for filter dropdown
function getMonthOptions(sessions) {
  const seen = new Set()
  const months = []
  for (const s of sessions) {
    const d = new Date(s.scheduledAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!seen.has(key)) {
      seen.add(key)
      months.push({
        key,
        label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
      })
    }
  }
  return months.sort((a, b) => b.key.localeCompare(a.key))
}

function SessionRow({ session }) {
  const now = new Date()
  const isPast = new Date(session.scheduledAt) < now
  const typeLabel = SESSION_TYPE_LABELS[session.sessionType] ?? session.sessionType
  const typeIcon = SESSION_TYPE_ICONS[session.sessionType] ?? '📋'

  return (
    <tr style={{ opacity: isPast ? 0.85 : 1 }}>
      <td>
        <Stack direction="horizontal" gap={2}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
            style={{ width: 30, height: 30, background: '#003E92', fontSize: 11 }}
          >
            {getInitials(session.studentUsername)}
          </div>
          <div>
            <div className="fw-medium" style={{ fontSize: '0.85rem', color: '#0a0f1e' }}>
              {session.studentUsername}
            </div>
          </div>
        </Stack>
      </td>
      <td>
        <span style={{ fontSize: '0.83rem' }}>
          {typeIcon} {typeLabel}
        </span>
      </td>
      <td className="text-muted" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
        {formatDate(session.scheduledAt)}
      </td>
      <td>
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
            ● Upcoming
          </Badge>
        )}
      </td>
      <td className="text-end fw-semibold" style={{ color: '#003E92', fontSize: '0.88rem' }}>
        ${session.price ?? 0}
      </td>
    </tr>
  )
}

export default function SessionsTab({ sessions }) {
  const [monthFilter, setMonthFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const now = new Date()
  const monthOptions = useMemo(() => getMonthOptions(sessions), [sessions])

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (typeFilter !== 'all' && s.sessionType !== typeFilter) return false
      if (monthFilter !== 'all') {
        const d = new Date(s.scheduledAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (key !== monthFilter) return false
      }
      return true
    }).sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
  }, [sessions, monthFilter, typeFilter])

  const completedFiltered = useMemo(
    () => filtered.filter((s) => new Date(s.scheduledAt) < now),
    [filtered],
  )
  const upcomingFiltered = useMemo(
    () => filtered.filter((s) => new Date(s.scheduledAt) >= now),
    [filtered],
  )

  const totalFiltered = useMemo(
    () => completedFiltered.reduce((sum, s) => sum + (s.price ?? 0), 0),
    [completedFiltered],
  )

  // Earnings by type for summary cards
  const earningsByType = useMemo(() => {
    const out = {}
    for (const s of completedFiltered) {
      out[s.sessionType] = (out[s.sessionType] ?? 0) + (s.price ?? 0)
    }
    return out
  }, [completedFiltered])

  return (
    <div>
      {/* Filters */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col xs={12} sm={6} md={4}>
              <Form.Label className="fw-medium small text-muted text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                Month
              </Form.Label>
              <Form.Select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="rounded-3"
                style={{ fontSize: '0.88rem', borderColor: '#dde3f0' }}
              >
                <option value="all">All time</option>
                {monthOptions.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Form.Label className="fw-medium small text-muted text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                Session Type
              </Form.Label>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-3"
                style={{ fontSize: '0.88rem', borderColor: '#dde3f0' }}
              >
                <option value="all">All types</option>
                <option value="coaching">Strategy Call</option>
                <option value="mock_interview">Mock Interview</option>
                <option value="resume_review">Resume Review</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={4}>
              <div
                className="rounded-3 p-3 text-center"
                style={{ background: '#f0f5ff', border: '1px solid #dce8ff' }}
              >
                <div className="text-muted small" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Filtered Earnings
                </div>
                <div className="fw-bold mt-1" style={{ fontSize: '1.4rem', color: '#003E92' }}>
                  ${totalFiltered.toLocaleString()}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  {completedFiltered.length} completed · {upcomingFiltered.length} upcoming
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Earnings by type summary */}
      {completedFiltered.length > 0 && (
        <Row className="g-3 mb-4">
          {Object.entries(SESSION_TYPE_LABELS).map(([type, label]) => {
            const earned = earningsByType[type] ?? 0
            const count = completedFiltered.filter((s) => s.sessionType === type).length
            return (
              <Col key={type} xs={12} sm={4}>
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-3 d-flex align-items-center gap-3">
                    <div style={{ fontSize: '1.6rem' }}>{SESSION_TYPE_ICONS[type]}</div>
                    <div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{label}</div>
                      <div className="fw-bold" style={{ color: '#0a0f1e' }}>${earned.toLocaleString()}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{count} session{count !== 1 ? 's' : ''}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      {/* Sessions table */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
          <h6 className="fw-semibold mb-0" style={{ color: '#0a0f1e' }}>
            Session History
            {filtered.length > 0 && (
              <Badge
                className="ms-2 rounded-pill fw-normal"
                style={{ background: '#f0f5ff', color: '#003E92', border: '1px solid #dce8ff', fontSize: '0.72rem' }}
              >
                {filtered.length}
              </Badge>
            )}
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
              <p className="text-muted small mb-0">No sessions match your filters.</p>
            </div>
          ) : (
            <Table hover responsive className="mb-0 align-middle" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eef0f7' }}>
                  <th className="fw-medium text-muted ps-4 py-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                  <th className="fw-medium text-muted py-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th className="fw-medium text-muted py-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</th>
                  <th className="fw-medium text-muted py-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th className="fw-medium text-muted py-3 border-0 text-end pe-4" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="ps-4 py-3">
                      <Stack direction="horizontal" gap={2}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                          style={{ width: 30, height: 30, background: '#003E92', fontSize: 11 }}
                        >
                          {getInitials(s.studentUsername)}
                        </div>
                        <span className="fw-medium" style={{ color: '#0a0f1e' }}>{s.studentUsername}</span>
                      </Stack>
                    </td>
                    <td className="py-3">
                      <span>{SESSION_TYPE_ICONS[s.sessionType]} {SESSION_TYPE_LABELS[s.sessionType] ?? s.sessionType}</span>
                    </td>
                    <td className="text-muted py-3" style={{ whiteSpace: 'nowrap' }}>
                      {formatDate(s.scheduledAt)}
                    </td>
                    <td className="py-3">
                      {new Date(s.scheduledAt) < now ? (
                        <Badge className="rounded-pill fw-normal" style={{ background: '#e8f0fe', color: '#1557C0', fontSize: '0.72rem' }}>
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="rounded-pill fw-normal" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: '0.72rem' }}>
                          ● Upcoming
                        </Badge>
                      )}
                    </td>
                    <td className="text-end pe-4 py-3 fw-semibold" style={{ color: '#003E92' }}>
                      ${s.price ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
              {completedFiltered.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop: '2px solid #eef0f7' }}>
                    <td colSpan={4} className="text-end fw-semibold ps-4 py-3" style={{ color: '#0a0f1e' }}>
                      Total earned
                    </td>
                    <td className="text-end pe-4 py-3 fw-bold" style={{ color: '#003E92', fontSize: '1rem' }}>
                      ${totalFiltered.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}