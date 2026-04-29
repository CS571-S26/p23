import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'

function afterLoginPath(role) {
  if (role === 'student') return '/browse'
  if (role === 'mentor') return '/mentor-dash'
  return '/'
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('pick')
  const [role, setRole] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (user) {
    return <Navigate to={afterLoginPath(user.role)} replace />
  }

  const selectRole = (nextRole) => {
    setRole(nextRole)
    setPhase('form')
    setUsername('')
    setPassword('')
  }

  const goBackToPick = () => {
    setPhase('pick')
    setRole(null)
    setUsername('')
    setPassword('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = username.trim()
    if (!name || !role) return
    login({ username: name, role })
    navigate(afterLoginPath(role))
  }

  const roleLabel = role === 'mentor' ? 'Mentor' : 'Student'

  return (
    <div className="min-vh-100 bg-light">
      {/* Nav */}
      <Navbar bg="white" className="border-bottom shadow-sm px-2">
        <Container fluid="xl">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-dark">
            ACE
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-muted small">
              ← Back to home
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Main */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5}>

            {phase === 'pick' ? (
              <Card className="shadow-sm border-0 rounded-4 p-4">
                <Card.Body className="text-center">
                  <h1 className="fs-3 fw-semibold mb-1">Login as…</h1>
                  <p className="text-muted mb-4">Choose how you use Ace.</p>
                  <Row className="g-3">
                    <Col xs={6}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100 rounded-3 py-3"
                        onClick={() => selectRole('student')}
                      >
                        🎓 Student
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant="outline-secondary"
                        size="lg"
                        className="w-100 rounded-3 py-3"
                        onClick={() => selectRole('mentor')}
                      >
                        💼 Mentor
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <Card className="shadow-sm border-0 rounded-4 p-4">
                <Card.Body>
                  <h1 className="fs-3 fw-semibold mb-1">{roleLabel} login</h1>

                  <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="login-username">
                      <Form.Label className="fw-medium">Username</Form.Label>
                      <Form.Control
                        type="text"
                        size="lg"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="login-password">
                      <Form.Label className="fw-medium">Password</Form.Label>
                      <Form.Control
                        type="password"
                        size="lg"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="rounded-3"
                      />
                      
                    </Form.Group>

                    <Row className="g-2">
                      <Col xs={5}>
                        <Button
                          variant="outline-secondary"
                          className="w-100 rounded-3"
                          onClick={goBackToPick}
                          type="button"
                        >
                          ← Back
                        </Button>
                      </Col>
                      <Col xs={7}>
                        <Button
                          variant="primary"
                          className="w-100 rounded-3"
                          type="submit"
                        >
                          Sign in →
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}

          </Col>
        </Row>
      </Container>
    </div>
  )
}
