import AppShellNav from '../../components/layout/AppShellNav.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import Stack from 'react-bootstrap/Stack'
import ProgressBar from 'react-bootstrap/ProgressBar'

const mockSessions = [
  { id: 1, student: 'Alex R.', type: 'Mock Interview', date: 'Apr 25, 2026', time: '3:00 PM', status: 'upcoming', amount: 200 },
  { id: 2, student: 'Jamie L.', type: 'Strategy Call', date: 'Apr 23, 2026', time: '11:00 AM', status: 'upcoming', amount: 150 },
  { id: 3, student: 'Taylor M.', type: 'App Review', date: 'Apr 18, 2026', time: '2:00 PM', status: 'completed', amount: 175 },
  { id: 4, student: 'Sam K.', type: 'Mock Interview', date: 'Apr 15, 2026', time: '4:00 PM', status: 'completed', amount: 200 },
  { id: 5, student: 'Casey P.', type: 'Strategy Call', date: 'Apr 10, 2026', time: '1:00 PM', status: 'completed', amount: 150 },
]

const statusVariant = {
  upcoming: 'primary',
  completed: 'success',
}

export default function MentorDashboard() {
  const { user } = useAuth()

  const totalEarned = mockSessions
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.amount, 0)

  const upcoming = mockSessions.filter((s) => s.status === 'upcoming')
  const completed = mockSessions.filter((s) => s.status === 'completed')
  const goalAmount = 1000
  const progressPct = Math.min(100, Math.round((totalEarned / goalAmount) * 100))

  return (
    <div className="min-vh-100 bg-light">
      <AppShellNav />

      <Container fluid="xl" className="py-5">

        {/* Page header */}
        <Row className="mb-5 align-items-center">
          <Col>
            <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
              Mentor Dashboard
            </h1>
            <p className="text-muted mb-0">
              Welcome back, <strong>{user?.username}</strong>. Here's your activity summary.
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="dark" className="rounded-3" disabled>
              + Set Availability
            </Button>
          </Col>
        </Row>

        {/* Stat cards */}
        <Row className="g-4 mb-5">
          <Col xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="text-muted small mb-2">Total Earned</div>
                <div className="fw-bold fs-2">${totalEarned}</div>
                <div className="text-success small mt-1">↑ This month</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="text-muted small mb-2">Sessions Completed</div>
                <div className="fw-bold fs-2">{completed.length}</div>
                <div className="text-muted small mt-1">Lifetime total</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="text-muted small mb-2">Upcoming Sessions</div>
                <div className="fw-bold fs-2">{upcoming.length}</div>
                <div className="text-primary small mt-1">Next 7 days</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="text-muted small mb-2">Avg Rating</div>
                <div className="fw-bold fs-2">4.9 ⭐</div>
                <div className="text-muted small mt-1">From {completed.length} reviews</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Earnings progress */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <Stack direction="horizontal" className="mb-2">
                  <div className="fw-semibold">Monthly Goal</div>
                  <div className="ms-auto text-muted small">${totalEarned} / ${goalAmount}</div>
                </Stack>
                <ProgressBar
                  now={progressPct}
                  label={`${progressPct}%`}
                  variant="dark"
                  className="rounded-3"
                  style={{ height: 12 }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">

          {/* Upcoming sessions */}
          <Col xs={12} lg={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-semibold mb-0">Upcoming Sessions</h5>
              </Card.Header>
              <Card.Body className="p-3">
                {upcoming.length === 0 ? (
                  <p className="text-muted text-center py-4 small">No upcoming sessions.</p>
                ) : (
                  <ListGroup variant="flush">
                    {upcoming.map((s) => (
                      <ListGroup.Item key={s.id} className="px-2 py-3 border-0 border-bottom">
                        <Stack direction="horizontal" gap={2}>
                          <div className="flex-grow-1">
                            <div className="fw-medium">{s.student}</div>
                            <div className="text-muted small">{s.type} · {s.date} at {s.time}</div>
                          </div>
                          <Badge bg={statusVariant[s.status]} className="rounded-pill">
                            {s.status}
                          </Badge>
                          <div className="fw-semibold small">${s.amount}</div>
                        </Stack>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Session history table */}
          <Col xs={12} lg={7}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-semibold mb-0">Session History</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <Table hover responsive className="align-middle mb-0 small">
                  <thead className="text-muted">
                    <tr>
                      <th className="fw-medium border-0">Student</th>
                      <th className="fw-medium border-0">Type</th>
                      <th className="fw-medium border-0">Date</th>
                      <th className="fw-medium border-0">Status</th>
                      <th className="fw-medium border-0 text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSessions.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-medium">{s.student}</td>
                        <td className="text-muted">{s.type}</td>
                        <td className="text-muted">{s.date}</td>
                        <td>
                          <Badge bg={statusVariant[s.status]} className="rounded-pill fw-normal">
                            {s.status}
                          </Badge>
                        </td>
                        <td className="text-end fw-semibold">${s.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-top">
                    <tr>
                      <td colSpan={4} className="fw-semibold text-end pt-3">Total earned</td>
                      <td className="text-end fw-bold pt-3">${totalEarned}</td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  )
}
