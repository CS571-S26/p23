import { useEffect, useState } from 'react'
import AppShellNav from '../../components/layout/AppShellNav.jsx'
import { mockMentors } from '../../lib/mockData.js'
import ScheduleSessionModal from '../../features/mentors/ScheduleSessionModal.jsx'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Stack from 'react-bootstrap/Stack'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

const TRACK_VARIANTS = {
  'Investment Banking': 'warning',
  'Management Consulting': 'success',
  'Tech & FAANG': 'info',
  'Private Equity': 'danger',
}

const TRACK_ACCENT = {
  'Investment Banking': '#ffc107',
  'Management Consulting': '#198754',
  'Tech & FAANG': '#0dcaf0',
  'Private Equity': '#dc3545',
}

const SESSION_LABELS = {
  coaching: 'Strategy Call',
  mock_interview: 'Mock Interview',
  resume_review: 'App Review',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export default function BrowsePage() {
  const [mentors, setMentors] = useState([])
  const [search, setSearch] = useState('')
  const [filterTrack, setFilterTrack] = useState('All')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState({ show: false, mentorName: '', type: '' })

  useEffect(() => {
    setMentors(mockMentors)
  }, [])

  const tracks = ['All', ...new Set(mockMentors.map((m) => m.track))]

  const filtered = mentors.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.firm.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
    const matchTrack = filterTrack === 'All' || m.track === filterTrack
    return matchSearch && matchTrack
  })

  const handleBookClick = (mentor) => {
    setSelectedMentor(mentor)
    setShowModal(true)
  }

  const handleBooked = (session) => {
    setToast({
      show: true,
      mentorName: session.mentorName,
      type: session.sessionType,
    })
  }

  const handleHide = () => {
    setShowModal(false)
    setSelectedMentor(null)
  }

  return (
    <div className="min-vh-100 bg-light">
      <AppShellNav />

      {/* Toast notification */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
          autohide
          bg="dark"
        >
          <Toast.Body className="text-white d-flex align-items-center gap-2">
            <span>✅</span>
            <span>
              <strong>{SESSION_LABELS[toast.type] || toast.type}</strong> booked with {toast.mentorName}!
            </span>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container fluid="xl" className="py-5">

        {/* Header */}
        <Row className="mb-4 align-items-end">
          <Col xs={12} md={7}>
            <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px', fontFamily: "'Cormorant Garamond', serif" }}>
              Browse Mentors
            </h1>
            <p className="text-muted mb-0">
              Book 1:1 sessions with insiders at your target firms.
            </p>
          </Col>
          <Col xs={12} md={5} className="mt-3 mt-md-0">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">🔍</InputGroup.Text>
              <Form.Control
                className="border-start-0 bg-white"
                placeholder="Search by name, firm, or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Track filter pills */}
        <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
          {tracks.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={filterTrack === t ? 'dark' : 'outline-secondary'}
              className="rounded-pill px-3"
              style={filterTrack === t ? { background: '#003E92', borderColor: '#003E92' } : {}}
              onClick={() => setFilterTrack(t)}
            >
              {t}
            </Button>
          ))}
        </Stack>

        {/* Results count */}
        <p className="text-muted small mb-3">
          Showing <strong>{filtered.length}</strong> mentor{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Mentor grid */}
        <Row className="g-4">
          {filtered.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4} xl={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                {/* Card top accent */}
                <div style={{ height: 6, background: TRACK_ACCENT[m.track] || '#6c757d' }} />

                <Card.Body className="p-4 d-flex flex-column">

                  {/* Avatar + name */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: 48, height: 48, fontSize: 16, background: '#003E92' }}
                    >
                      {getInitials(m.name)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-semibold text-truncate">{m.name}</div>
                      <div className="text-muted small text-truncate">
                        {m.role} · {m.firm}
                      </div>
                    </div>
                  </div>

                  {/* Track badge */}
                  <div className="mb-2">
                    <Badge bg={TRACK_VARIANTS[m.track] || 'secondary'} className="rounded-pill">
                      {m.track}
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-muted small flex-grow-1 mb-3">{m.bio}</p>

                  {/* Session type badges */}
                  <Stack direction="horizontal" gap={1} className="flex-wrap mb-3">
                    {m.sessionTypes.map((s) => (
                      <Badge key={s} bg="light" text="dark" className="border fw-normal small">
                        {SESSION_LABELS[s] || s}
                      </Badge>
                    ))}
                  </Stack>

                  {/* Stats row */}
                  <Row className="g-0 text-center mb-3 border rounded-3 overflow-hidden">
                    <Col className="py-2 border-end">
                      <div className="fw-bold small">⭐ {m.rating}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>Rating</div>
                    </Col>
                    <Col className="py-2 border-end">
                      <div className="fw-bold small">{m.totalSessions}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>Sessions</div>
                    </Col>
                    <Col className="py-2">
                      <div className="fw-bold small">${m.pricePerSession}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>/ session</div>
                    </Col>
                  </Row>

                  {/* CTA */}
                  <Button
                    className="w-100 rounded-3 fw-semibold"
                    style={{ background: '#003E92', borderColor: '#003E92' }}
                    onClick={() => handleBookClick(m)}
                  >
                    Book a Session
                  </Button>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            <div className="fs-1 mb-2">🔍</div>
            <p>No mentors match your search.</p>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => { setSearch(''); setFilterTrack('All') }}
            >
              Clear filters
            </Button>
          </div>
        )}

      </Container>

      {/* Booking Modal */}
      <ScheduleSessionModal
        mentor={selectedMentor}
        show={showModal}
        onHide={handleHide}
        onBooked={handleBooked}
      />
    </div>
  )
}