import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

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
    <div className="login-page">
      <nav className="ace-nav">
        <Link to="/" className="nav-logo nav-logo-link">
          ACE
        </Link>
        <Link to="/" className="btn btn-ghost btn-nav-secondary">
          ← Back to home
        </Link>
      </nav>

      <main className="login-main">
        <div className="login-card">
          {phase === 'pick' ? (
            <>
              <h1 className="login-title">Login as…</h1>
              <p className="login-lead">Choose how you use Ace.</p>
              <div className="login-role-row">
                <button
                  type="button"
                  className="btn btn-primary login-role-btn"
                  onClick={() => selectRole('student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className="btn btn-ghost login-role-btn"
                  onClick={() => selectRole('mentor')}
                >
                  Mentor
                </button>
              </div>
            </>
          ) : (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <h1 className="login-title">{roleLabel} login</h1>
              <p className="login-lead">No real authentication yet — this only saves your session in the browser.</p>

              <label className="login-field" htmlFor="login-username">
                <span className="login-label">Username</span>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  className="login-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>

              <label className="login-field" htmlFor="login-password">
                <span className="login-label">Password</span>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  className="login-input login-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-describedby="login-password-hint"
                />
                <span id="login-password-hint" className="login-hint">
                  Shown as dots in the field; not stored or validated.
                </span>
              </label>

              <div className="login-actions">
                <button type="button" className="btn btn-ghost" onClick={goBackToPick}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
