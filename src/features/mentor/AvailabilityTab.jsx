// features/mentor/AvailabilityTab.jsx
import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import { saveAvailability } from '../../lib/mentorStorage.js'

const DAYS = [
  { key: 'mon', label: 'Monday',    short: 'Mon' },
  { key: 'tue', label: 'Tuesday',   short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday',  short: 'Thu' },
  { key: 'fri', label: 'Friday',    short: 'Fri' },
  { key: 'sat', label: 'Saturday',  short: 'Sat' },
  { key: 'sun', label: 'Sunday',    short: 'Sun' },
]

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

const SESSION_TYPE_DESCS = {
  coaching: 'Tailored 1:1 strategy sessions covering goals and action plans.',
  mock_interview: 'Realistic interview simulations with detailed feedback.',
  resume_review: 'Line-by-line resume feedback to maximize callback rates.',
}

const ALL_SESSION_TYPES = ['coaching', 'mock_interview', 'resume_review']

// Human-readable time range label
function timeRangeLabel(start, end) {
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'pm' : 'am'
    const h12 = h % 12 || 12
    return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, '0')}${ampm}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

export default function AvailabilityTab({ mentorId, availability, sessionTypes, pricing, onSaved }) {
  const [avail, setAvail] = useState(availability)
  const [activeTypes, setActiveTypes] = useState(sessionTypes)
  const [prices, setPrices] = useState(pricing)
  const [saved, setSaved] = useState(false)
  const [priceErrors, setPriceErrors] = useState({})

  const toggleDay = (day) => {
    setAvail((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }))
    setSaved(false)
  }

  const updateTime = (day, field, value) => {
    setAvail((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
    setSaved(false)
  }

  const toggleSessionType = (type) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
    setSaved(false)
  }

  const updatePrice = (type, val) => {
    const n = parseInt(val, 10)
    setPriceErrors((prev) => ({ ...prev, [type]: n < 1 || isNaN(n) ? 'Min $1' : null }))
    setPrices((prev) => ({ ...prev, [type]: isNaN(n) ? '' : n }))
    setSaved(false)
  }

  const hasErrors = Object.values(priceErrors).some(Boolean)
  const enabledDays = DAYS.filter((d) => avail[d.key]?.enabled)

  const handleSave = () => {
    if (hasErrors) return
    saveAvailability(mentorId, avail)
    onSaved({ sessionTypes: activeTypes, pricing: prices })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <Row className="g-4">

        {/* Weekly availability */}
        <Col xs={12} lg={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h2 className="fw-semibold mb-0 fs-6" style={{ color: '#0a0f1e' }}>Weekly Availability</h2>
                  <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>
                    Set your recurring available hours. Students will see these as bookable slots.
                  </p>
                </div>
                {enabledDays.length > 0 && (
                  <Badge
                    className="rounded-pill ms-2 flex-shrink-0"
                    style={{ background: '#e8f5e9', color: '#1b5e20', border: '1px solid #a5d6a7', fontWeight: 600 }}
                  >
                    {enabledDays.length} day{enabledDays.length !== 1 ? 's' : ''} active
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-4 pt-2">
              <Stack gap={2}>
                {DAYS.map(({ key, label, short }) => {
                  const day = avail[key] ?? { enabled: false, start: '09:00', end: '17:00' }
                  const invalid = day.enabled && day.start >= day.end

                  return (
                    <div
                      key={key}
                      className="rounded-3 px-3 py-3 d-flex align-items-center gap-3 flex-wrap"
                      style={{
                        background: day.enabled ? '#f0f5ff' : '#fafafa',
                        border: `1px solid ${day.enabled ? '#dce8ff' : '#eee'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Toggle */}
                      <Form.Check
                        type="switch"
                        id={`day-${key}`}
                        checked={day.enabled}
                        onChange={() => toggleDay(key)}
                        className="flex-shrink-0"
                      />

                      {/* Day label */}
                      <div
                        className="fw-medium flex-shrink-0"
                        style={{
                          width: 90,
                          fontSize: '0.88rem',
                          color: day.enabled ? '#003E92' : '#aaa',
                        }}
                      >
                        <span className="d-none d-sm-inline">{label}</span>
                        <span className="d-sm-none">{short}</span>
                      </div>

                      {/* Time inputs */}
                      {day.enabled ? (
                        <Stack direction="horizontal" gap={2} className="flex-wrap align-items-center">
                          <Form.Control
                            type="time"
                            value={day.start}
                            onChange={(e) => updateTime(key, 'start', e.target.value)}
                            className="rounded-3"
                            aria-label={`${label} start time`}
                            style={{
                              width: 110,
                              fontSize: '0.85rem',
                              borderColor: invalid ? '#dc3545' : '#dde3f0',
                            }}
                          />
                          <span className="text-muted small" aria-hidden="true">to</span>
                          <Form.Control
                            type="time"
                            value={day.end}
                            onChange={(e) => updateTime(key, 'end', e.target.value)}
                            className="rounded-3"
                            aria-label={`${label} end time`}
                            style={{
                              width: 110,
                              fontSize: '0.85rem',
                              borderColor: invalid ? '#dc3545' : '#dde3f0',
                            }}
                          />
                          {!invalid && (
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {timeRangeLabel(day.start, day.end)}
                            </span>
                          )}
                          {invalid && (
                            <span style={{ fontSize: '0.75rem', color: '#dc3545' }}>
                              End must be after start
                            </span>
                          )}
                        </Stack>
                      ) : (
                        <span className="text-muted small">Unavailable</span>
                      )}
                    </div>
                  )
                })}
              </Stack>
            </Card.Body>
          </Card>
        </Col>

        {/* Session types + pricing */}
        <Col xs={12} lg={5}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
              <h2 className="fw-semibold mb-0 fs-6" style={{ color: '#0a0f1e' }}>Session Types & Pricing</h2>
              <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>
                Enable session types and set your rate for each.
              </p>
            </Card.Header>
            <Card.Body className="p-4 pt-2">
              <Stack gap={3}>
                {ALL_SESSION_TYPES.map((type) => {
                  const isActive = activeTypes.includes(type)
                  return (
                    <div
                      key={type}
                      className="rounded-3 p-3"
                      style={{
                        background: isActive ? '#f0f5ff' : '#fafafa',
                        border: `1px solid ${isActive ? '#dce8ff' : '#eee'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Header row */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span style={{ fontSize: '1.2rem' }}>{SESSION_TYPE_ICONS[type]}</span>
                        <div className="flex-grow-1">
                          <div className="fw-semibold" style={{ fontSize: '0.88rem', color: isActive ? '#003E92' : '#aaa' }}>
                            {SESSION_TYPE_LABELS[type]}
                          </div>
                        </div>
                        <Form.Check
                          type="switch"
                          id={`type-${type}`}
                          checked={isActive}
                          onChange={() => toggleSessionType(type)}
                        />
                      </div>

                      {/* Description */}
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                        {SESSION_TYPE_DESCS[type]}
                      </p>

                      {/* Price input (only when active) */}
                      {isActive && (
                        <div className="mt-3 d-flex align-items-center gap-2">
                          <span className="fw-medium" style={{ fontSize: '0.82rem', color: '#003E92' }}>$</span>
                          <Form.Control
                            type="number"
                            min="1"
                            value={prices[type] ?? ''}
                            onChange={(e) => updatePrice(type, e.target.value)}
                            placeholder="Price"
                            className="rounded-3"
                            style={{
                              width: 90,
                              fontSize: '0.88rem',
                              borderColor: priceErrors[type] ? '#dc3545' : '#dde3f0',
                            }}
                          />
                          <span className="text-muted small">per session</span>
                          {priceErrors[type] && (
                            <span style={{ fontSize: '0.75rem', color: '#dc3545' }}>{priceErrors[type]}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </Stack>

              {activeTypes.length === 0 && (
                <Alert variant="warning" className="mt-3 rounded-3 py-2 small">
                  ⚠️ Enable at least one session type so students can book you.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Availability preview */}
          <Card className="border-0 shadow-sm rounded-4 mt-3">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
              <h2 className="fw-semibold mb-0 fs-6" style={{ color: '#0a0f1e' }}>Your Schedule at a Glance</h2>
            </Card.Header>
            <Card.Body className="px-4 pb-4 pt-2">
              {enabledDays.length === 0 ? (
                <p className="text-muted small mb-0">No days enabled yet.</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {enabledDays.map(({ key, short }) => (
                    <div
                      key={key}
                      className="rounded-3 px-3 py-2 text-center"
                      style={{ background: '#003E92', color: '#fff', minWidth: 80 }}
                    >
                      <div className="fw-bold" style={{ fontSize: '0.78rem' }}>{short}</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                        {timeRangeLabel(avail[key].start, avail[key].end)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Save bar */}
      <div
        className="d-flex align-items-center justify-content-between rounded-4 px-4 py-3 mt-4"
        style={{ background: '#f0f5ff', border: '1px solid #dce8ff' }}
      >
        <div>
          {saved ? (
            <span className="fw-medium" style={{ color: '#1b5e20', fontSize: '0.88rem' }}>
              ✅ Availability saved successfully!
            </span>
          ) : (
            <span className="text-muted small">
              Changes are not saved until you click Save.
            </span>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={hasErrors || activeTypes.length === 0}
          className="rounded-3 px-4 fw-semibold"
          style={{
            background: hasErrors || activeTypes.length === 0 ? undefined : '#003E92',
            borderColor: hasErrors || activeTypes.length === 0 ? undefined : '#003E92',
          }}
        >
          Save Availability
        </Button>
      </div>
    </div>
  )
}