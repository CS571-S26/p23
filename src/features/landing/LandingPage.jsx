import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Stack from 'react-bootstrap/Stack'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'

const mentors = [
  { name: 'Marcus Chen', role: 'Investment Banking Analyst', firm: 'Goldman Sachs', tag: 'IB', tagVariant: 'warning', sessions: 47, rating: 4.9, specialty: 'IB Recruiting & Superday Prep', price: 200 },
  { name: 'Priya Nair', role: 'Associate', firm: 'McKinsey & Company', tag: 'Consulting', tagVariant: 'success', sessions: 63, rating: 5.0, specialty: 'Case Interview Mastery', price: 250 },
  { name: 'Jordan Wells', role: 'Senior Software Engineer', firm: 'Meta', tag: 'Tech', tagVariant: 'info', sessions: 38, rating: 4.8, specialty: 'FAANG System Design & LC', price: 175 },
  { name: 'Sofia Reyes', role: 'PE Associate', firm: 'KKR', tag: 'PE', tagVariant: 'danger', sessions: 29, rating: 4.9, specialty: 'PE Recruiting & LBO Modeling', price: 300 },
]

const tracks = [
  { label: 'Investment Banking', icon: '📈', desc: 'Bulge bracket & boutique IB recruiting, superdays, technicals', variant: 'warning' },
  { label: 'Private Equity', icon: '🏛️', desc: 'On-cycle & off-cycle PE prep, LBO modeling, case studies', variant: 'danger' },
  { label: 'Management Consulting', icon: '♟️', desc: 'MBB & T2 case interview coaching, fit rounds, offer navigation', variant: 'success' },
  { label: 'Tech & FAANG', icon: '⚡', desc: 'System design, LeetCode strategy, behavioral loops, new-grad pipelines', variant: 'info' },
]

const services = [
  { title: 'Strategy Call', price: 'From $100', desc: 'A focused 1:1 session on your recruiting timeline, approach, and positioning.', tag: 'Most popular', tagVariant: 'primary' },
  { title: 'Mock Interview', price: 'From $150', desc: 'Full simulation of a real technical or behavioral round with detailed feedback.', tag: 'Highest impact', tagVariant: 'danger' },
  { title: 'Application Review', price: 'From $100', desc: 'Insider critique of your resume, cover letter, or networking outreach.', tag: null, tagVariant: null },
]

const steps = [
  { n: '01', title: 'Choose your track', body: 'Select the industry and role you\'re targeting — IB, PE, consulting, or tech.' },
  { n: '02', title: 'Pick your insider', body: 'Browse vetted professionals currently working at the firms you want.' },
  { n: '03', title: 'Book and prepare', body: 'Lock in a session, get prep notes in advance, and walk out with an actionable roadmap.' },
]

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function LandingPage() {
  return (
    <div>

      {/* ── Navbar ── */}
      <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm">
        <Container fluid="xl">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-dark">
            ACE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="landing-nav" />
          <Navbar.Collapse id="landing-nav">
            <Nav className="mx-auto gap-1">
              <Nav.Link onClick={() => scrollToId('how')} className="text-muted px-3">How it works</Nav.Link>
              <Nav.Link onClick={() => scrollToId('tracks')} className="text-muted px-3">Tracks</Nav.Link>
              <Nav.Link onClick={() => scrollToId('mentors')} className="text-muted px-3">Mentors</Nav.Link>
            </Nav>
            <Stack direction="horizontal" gap={2}>
              <Button as={Link} to="/login" variant="outline-secondary" size="sm" className="rounded-3">
                Log in
              </Button>
              <Button variant="dark" size="sm" className="rounded-3" onClick={() => scrollToId('cta')}>
                Book a Session →
              </Button>
            </Stack>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Hero ── */}
      <section id="hero" className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container fluid="xl" className="py-5">
          <Row className="align-items-center gy-5">
            <Col xs={12} lg={6}>
              <Badge bg="dark" className="rounded-pill mb-3 px-3 py-2 fw-normal">
                Elite Recruiting Insider Network
              </Badge>
              <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1px', lineHeight: 1.15 }}>
                Get the edge.<br />
                <span className="text-primary">Straight from the source.</span>
              </h1>
              <p className="lead text-muted mb-4">
                1:1 sessions with real analysts, associates, and engineers at Goldman, McKinsey, KKR, and Meta — built for candidates targeting the world's most competitive roles.
              </p>
              <Stack direction="horizontal" gap={3} className="flex-wrap mb-5">
                <Button variant="dark" size="lg" className="rounded-3 px-4" onClick={() => scrollToId('mentors')}>
                  Browse Mentors →
                </Button>
                <Button variant="outline-secondary" size="lg" className="rounded-3 px-4" onClick={() => scrollToId('how')}>
                  See how it works
                </Button>
              </Stack>

              {/* Stats */}
              <Row className="g-0 border rounded-4 overflow-hidden bg-white shadow-sm" style={{ maxWidth: 420 }}>
                {[
                  { num: '500+', label: 'Sessions booked' },
                  { num: '4.9★', label: 'Average rating' },
                  { num: '78%', label: 'Offer rate' },
                ].map((s, i) => (
                  <Col key={s.label} className={`py-3 text-center${i < 2 ? ' border-end' : ''}`}>
                    <div className="fw-bold fs-5">{s.num}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Floating mentor cards preview */}
            <Col xs={12} lg={6}>
              <Stack gap={3} className="px-lg-4">
                {mentors.slice(0, 2).map((m) => (
                  <Card key={m.name} className="border-0 shadow rounded-4">
                    <Card.Body className="p-3">
                      <Stack direction="horizontal" gap={3}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                          style={{ width: 44, height: 44, background: '#1a1a2e', fontSize: 14 }}
                        >
                          {getInitials(m.name)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{m.name}</div>
                          <div className="text-muted small">{m.role} · {m.firm}</div>
                        </div>
                        <div className="text-end">
                          <Badge bg={m.tagVariant} className="rounded-pill mb-1 d-block">{m.tag}</Badge>
                          <div className="fw-bold small">${m.price}</div>
                        </div>
                      </Stack>
                    </Card.Body>
                  </Card>
                ))}
              </Stack>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-5 bg-white">
        <Container fluid="xl" className="py-4">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="rounded-pill mb-2 px-3 py-2 fw-normal">The Process</Badge>
            <h2 className="fw-bold fs-1" style={{ letterSpacing: '-0.5px' }}>Three steps to your offer</h2>
          </div>
          <Row className="g-4 justify-content-center">
            {steps.map((s) => (
              <Col key={s.n} xs={12} md={4}>
                <Card className="border-0 bg-light rounded-4 h-100">
                  <Card.Body className="p-4">
                    <div className="fw-bold text-muted mb-3" style={{ fontSize: 13, letterSpacing: 2 }}>{s.n}</div>
                    <h3 className="fw-semibold fs-5 mb-2">{s.title}</h3>
                    <p className="text-muted mb-0 small">{s.body}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Tracks ── */}
      <section id="tracks" className="py-5 bg-light">
        <Container fluid="xl" className="py-4">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="rounded-pill mb-2 px-3 py-2 fw-normal">Coverage</Badge>
            <h2 className="fw-bold fs-1" style={{ letterSpacing: '-0.5px' }}>Built for elite recruiting</h2>
          </div>
          <Row className="g-4">
            {tracks.map((t) => (
              <Col key={t.label} xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="p-4">
                    <div className="fs-2 mb-3">{t.icon}</div>
                    <Badge bg={t.variant} className="rounded-pill mb-2">{t.label}</Badge>
                    <p className="text-muted small mb-0 mt-2">{t.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-5 bg-white">
        <Container fluid="xl" className="py-4">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="rounded-pill mb-2 px-3 py-2 fw-normal">What you book</Badge>
            <h2 className="fw-bold fs-1" style={{ letterSpacing: '-0.5px' }}>Outcome-oriented sessions</h2>
          </div>
          <Row className="g-4 justify-content-center">
            {services.map((s) => (
              <Col key={s.title} xs={12} md={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="p-4 d-flex flex-column">
                    {s.tag && (
                      <Badge bg={s.tagVariant} className="rounded-pill mb-3 align-self-start">{s.tag}</Badge>
                    )}
                    <h3 className="fw-semibold fs-5 mb-1">{s.title}</h3>
                    <p className="fw-bold text-primary mb-3">{s.price}</p>
                    <p className="text-muted small flex-grow-1 mb-4">{s.desc}</p>
                    <Button variant="outline-dark" className="rounded-3 w-100" onClick={() => scrollToId('mentors')}>
                      Browse mentors →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Mentors ── */}
      <section id="mentors" className="py-5 bg-light">
        <Container fluid="xl" className="py-4">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="rounded-pill mb-2 px-3 py-2 fw-normal">The Roster</Badge>
            <h2 className="fw-bold fs-1" style={{ letterSpacing: '-0.5px' }}>Meet your insiders</h2>
          </div>
          <Row className="g-4">
            {mentors.map((m) => (
              <Col key={m.name} xs={12} sm={6} xl={3}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <div style={{ height: 5, background: m.tagVariant === 'warning' ? '#ffc107' : m.tagVariant === 'success' ? '#198754' : m.tagVariant === 'info' ? '#0dcaf0' : '#dc3545' }} />
                  <Card.Body className="p-4 d-flex flex-column">
                    <Stack direction="horizontal" gap={3} className="mb-3 align-items-start">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                        style={{ width: 48, height: 48, background: '#1a1a2e', fontSize: 15 }}
                      >
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <div className="fw-semibold">{m.name}</div>
                        <div className="text-muted small">{m.role}</div>
                        <div className="text-muted small">{m.firm}</div>
                      </div>
                    </Stack>

                    <Badge bg={m.tagVariant} className="rounded-pill align-self-start mb-2">{m.tag}</Badge>
                    <p className="text-muted small flex-grow-1 mb-3">{m.specialty}</p>

                    <ListGroup variant="flush" className="border rounded-3 mb-3 small">
                      <ListGroup.Item className="d-flex justify-content-between px-3 py-2">
                        <span className="text-muted">Rating</span>
                        <span className="fw-semibold">⭐ {m.rating}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between px-3 py-2">
                        <span className="text-muted">Sessions</span>
                        <span className="fw-semibold">{m.sessions}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between px-3 py-2">
                        <span className="text-muted">Price</span>
                        <span className="fw-semibold">${m.price} / session</span>
                      </ListGroup.Item>
                    </ListGroup>

                    <Button variant="dark" className="rounded-3 w-100" onClick={() => scrollToId('cta')}>
                      Book session →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA Banner ── */}
      <section id="cta" className="py-5" style={{ background: '#1a1a2e' }}>
        <Container fluid="xl" className="py-4 text-center text-white">
          <h2 className="fw-bold display-5 mb-3" style={{ letterSpacing: '-0.5px' }}>
            Ready to get the insider edge?
          </h2>
          <p className="text-secondary mb-4 lead">
            Join hundreds of candidates who used Ace to land roles at Goldman, McKinsey, Meta, and beyond.
          </p>
          <Button
            as={Link}
            to="/login"
            variant="light"
            size="lg"
            className="rounded-3 px-5 fw-semibold"
          >
            Get started now →
          </Button>
        </Container>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-top py-4">
        <Container fluid="xl">
          <Stack direction="horizontal" gap={3} className="flex-wrap justify-content-between align-items-center">
            <span className="fw-bold text-dark">ACE</span>
            <span className="text-muted small">The insider path to elite careers.</span>
            <Stack direction="horizontal" gap={3}>
              <a href="#" className="text-muted small text-decoration-none">Privacy</a>
              <a href="#" className="text-muted small text-decoration-none">Terms</a>
              <a href="#" className="text-muted small text-decoration-none">Contact</a>
            </Stack>
          </Stack>
        </Container>
      </footer>

    </div>
  )
}
