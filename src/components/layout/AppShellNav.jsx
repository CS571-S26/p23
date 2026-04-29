import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

export default function AppShellNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const home = user?.role === 'mentor' ? '/mentor-dash' : '/browse'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm px-2">
      <Container fluid="xl">
        <Navbar.Brand as={Link} to={home} className="fw-bold fs-4 text-dark letter-spacing-1">
          ACE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="app-nav" />

        <Navbar.Collapse id="app-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {user && (
              <>
                {user.role === 'student' && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate('/my-sessions')}
                  >
                    My Sessions
                  </Button>
                )}

                <Nav.Item className="d-flex align-items-center me-2">
                  <span className="text-muted small me-1">{user.username}</span>
                  <Badge
                    bg={user.role === 'mentor' ? 'primary' : 'secondary'}
                    className="text-capitalize"
                  >
                    {user.role}
                  </Badge>
                </Nav.Item>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}