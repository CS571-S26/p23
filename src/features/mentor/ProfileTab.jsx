// features/mentor/ProfileTab.jsx
import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import { saveMentorProfile } from '../../lib/mentorStorage.js'

const SESSION_TYPE_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'Resume Review',
}

const TRACK_OPTIONS = [
  'Investment Banking',
  'Management Consulting',
  'Tech & FAANG',
  'Private Equity',
  'Sales & Trading',
  'Asset Management',
  'Venture Capital',
  'Growth Equity',
]

const TRACK_COLORS = {
  'Investment Banking':    { bg: '#fff8e1', color: '#b07800', border: '#ffe082' },
  'Management Consulting': { bg: '#e8f5e9', color: '#1b5e20', border: '#a5d6a7' },
  'Tech & FAANG':          { bg: '#e1f5fe', color: '#01579b', border: '#81d4fa' },
  'Private Equity':        { bg: '#f3e5f5', color: '#4a148c', border: '#ce93d8' },
}

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const MAX_BIO = 300

export default function ProfileTab({ mentorId, mentor, sessionTypes, onSaved }) {
  const [form, setForm] = useState({
    name:  mentor.name  ?? '',
    firm:  mentor.firm  ?? '',
    role:  mentor.role  ?? '',
    track: mentor.track ?? TRACK_OPTIONS[0],
    bio:   mentor.bio   ?? '',
  })
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  const [dirty, setDirty] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
    setSaved(false)
    setDirty(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Name is required.'
    if (!form.firm.trim())  errs.firm  = 'Firm is required.'
    if (!form.role.trim())  errs.role  = 'Role is required.'
    if (!form.bio.trim())   errs.bio   = 'Bio is required.'
    if (form.bio.length > MAX_BIO) errs.bio = `Bio must be ${MAX_BIO} characters or fewer.`
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const profile = {
      name:  form.name.trim(),
      firm:  form.firm.trim(),
      role:  form.role.trim(),
      track: form.track,
      bio:   form.bio.trim(),
    }
    saveMentorProfile(mentorId, profile)
    onSaved(profile)
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const trackStyle = TRACK_COLORS[form.track] ?? { bg: '#f5f5f5', color: '#333', border: '#ccc' }
  const bioLen = form.bio.length

  return (
    <Row className="g-4">
      {/* Form */}
      <Col xs={12} lg={7}>
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
            <h2 className="h6 fw-semibold mb-0" style={{ color: '#0a0f1e' }}>Edit Profile</h2>
            <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>
              Update your public mentor profile. Changes are saved to your account.
            </p>
          </Card.Header>
          <Card.Body className="p-4 pt-3">
            <Stack gap={3}>

              <Row className="g-3">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium small" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a80a0' }}>
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="e.g. Marcus Chen"
                      className="rounded-3"
                      style={{ fontSize: '0.9rem', borderColor: errors.name ? '#dc3545' : '#dde3f0' }}
                    />
                    {errors.name && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.name}</div>}
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-medium small" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a80a0' }}>
                      Firm / Company
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.firm}
                      onChange={(e) => update('firm', e.target.value)}
                      placeholder="e.g. Goldman Sachs"
                      className="rounded-3"
                      style={{ fontSize: '0.9rem', borderColor: errors.firm ? '#dc3545' : '#dde3f0' }}
                    />
                    {errors.firm && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.firm}</div>}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label className="fw-medium small" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a80a0' }}>
                  Role / Title
                </Form.Label>
                <Form.Control
                  type="text"
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  placeholder="e.g. Investment Banking Analyst"
                  className="rounded-3"
                  style={{ fontSize: '0.9rem', borderColor: errors.role ? '#dc3545' : '#dde3f0' }}
                />
                {errors.role && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.role}</div>}
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-medium small" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a80a0' }}>
                  Track / Specialization
                </Form.Label>
                <Form.Select
                  value={form.track}
                  onChange={(e) => update('track', e.target.value)}
                  className="rounded-3"
                  style={{ fontSize: '0.9rem', borderColor: '#dde3f0' }}
                >
                  {TRACK_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="fw-medium small mb-0" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a80a0' }}>
                    Bio
                  </Form.Label>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: bioLen > MAX_BIO ? '#dc3545' : bioLen > MAX_BIO * 0.85 ? '#b07800' : '#aaa',
                    }}
                  >
                    {bioLen}/{MAX_BIO}
                  </span>
                </div>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  placeholder="Describe your background and what students can expect from your sessions…"
                  className="rounded-3"
                  style={{
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    borderColor: errors.bio ? '#dc3545' : '#dde3f0',
                  }}
                />
                {errors.bio && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.bio}</div>}
              </Form.Group>

            </Stack>
          </Card.Body>
        </Card>

        {/* Save bar */}
        <div
          className="d-flex align-items-center justify-content-between rounded-4 px-4 py-3 mt-3"
          style={{ background: '#f0f5ff', border: '1px solid #dce8ff' }}
        >
          <div>
            {saved ? (
              <span className="fw-medium" style={{ color: '#1b5e20', fontSize: '0.88rem' }}>
                ✅ Profile saved successfully!
              </span>
            ) : dirty ? (
              <span className="text-muted small">You have unsaved changes.</span>
            ) : (
              <span className="text-muted small">Your profile is up to date.</span>
            )}
          </div>
          <Button
            onClick={handleSave}
            className="rounded-3 px-4 fw-semibold"
            style={{ background: '#003E92', borderColor: '#003E92' }}
          >
            Save Profile
          </Button>
        </div>
      </Col>

      {/* Live preview card */}
      <Col xs={12} lg={5}>
        <div className="position-sticky" style={{ top: 80 }}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
              <h6 className="fw-semibold mb-0" style={{ color: '#0a0f1e' }}>Preview</h6>
              <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>
                How your card looks to students on Browse.
              </p>
            </Card.Header>
            <Card.Body className="p-4 pt-3">
              {/* Simulated mentor card */}
              <div
                className="rounded-4 overflow-hidden"
                style={{ border: '1px solid #eef0f7', maxWidth: 280, margin: '0 auto' }}
              >
                {/* Accent bar */}
                <div style={{ height: 5, background: 'linear-gradient(90deg, #003E92, #1557C0)' }} />

                <div className="p-3">
                  {/* Avatar + name */}
                  <Stack direction="horizontal" gap={2} className="mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: 44, height: 44, background: '#003E92', fontSize: 15 }}
                    >
                      {getInitials(form.name)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-semibold text-truncate" style={{ fontSize: '0.9rem', color: '#0a0f1e' }}>
                        {form.name || 'Your Name'}
                      </div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.76rem' }}>
                        {form.role || 'Your Role'} · {form.firm || 'Your Firm'}
                      </div>
                    </div>
                  </Stack>

                  {/* Track badge */}
                  <div className="mb-2">
                    <span
                      className="badge rounded-pill px-2 py-1"
                      style={{
                        background: trackStyle.bg,
                        color: trackStyle.color,
                        border: `1px solid ${trackStyle.border}`,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}
                    >
                      {form.track}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-muted mb-3" style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>
                    {form.bio || 'Your bio will appear here.'}
                  </p>

                  {/* Session type badges */}
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {sessionTypes.map((t) => (
                      <Badge key={t} bg="light" text="dark" className="border fw-normal" style={{ fontSize: '0.7rem' }}>
                        {SESSION_TYPE_LABELS[t] ?? t}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="rounded-3 py-2 text-center fw-semibold text-white"
                    style={{ background: '#003E92', fontSize: '0.85rem' }}
                  >
                    Book a Session
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Tips card */}
          <Card className="border-0 shadow-sm rounded-4 mt-3">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#0a0f1e', fontSize: '0.88rem' }}>✨ Profile Tips</h6>
              <Stack gap={2}>
                {[
                  'Keep your bio specific — mention outcomes you\'ve helped students achieve.',
                  'Your role & firm are the first thing students see. Keep them concise.',
                  'Update your track to ensure you appear in the right search results.',
                ].map((tip, i) => (
                  <div key={i} className="d-flex gap-2">
                    <span style={{ color: '#003E92', flexShrink: 0, fontSize: '0.8rem' }}>→</span>
                    <span className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </Stack>
            </Card.Body>
          </Card>
        </div>
      </Col>
    </Row>
  )
}