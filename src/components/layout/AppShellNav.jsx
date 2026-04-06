import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AppShellNav() {
  const { user, logout } = useAuth()
  const home = user?.role === 'mentor' ? '/mentor-dash' : '/browse'

  return (
    <nav className="ace-nav">
      <Link to={home} className="nav-logo nav-logo-link">
        ACE
      </Link>
      <div className="nav-actions app-shell-nav-actions">
        {user && (
          <>
            <span className="nav-user" title={user.role}>
              {user.username}
              <span className="nav-user-role"> · {user.role}</span>
            </span>
            <button type="button" className="btn btn-ghost btn-nav-secondary" onClick={logout}>
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
