import { useState } from 'react'
import AppShellNav from '../../components/layout/AppShellNav.jsx'

export default function MentorDashboard() {
  // ── MOCK DATA (Firebase-ready structure) ─────────────────
  const [mentor, setMentor] = useState({
    name: "Alex Carter",
    sessionTypes: [
  { type: 'coaching', price: 120, available: true },
  { type: 'mock_interview', price: 150, available: true }
],
    rating: 4.9,
    availability: true,
    bio: "Ex-Goldman Sachs | Helping students break into IB"
  })

  const [sessions, setSessions] = useState([
    {
      id: 1,
      mentee: "John Kim",
      type: "Mock Interview",
      date: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      status: "upcoming",
      price: 120
    },
    {
      id: 2,
      mentee: "Sarah Lee",
      type: "Resume Review",
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs
      status: "upcoming",
      price: 100
    },
    {
      id: 3,
      mentee: "David Park",
      type: "Coffee Chat",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      price: 80
    },
    {
      id: 4,
      mentee: "Sarah Shin",
      type: "Resume Review",
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs
      status: "upcoming",
      price: 100
    },
    {
      id: 5,
      mentee: "Logan Park",
      type: "Coffee Chat",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      price: 80
    },
    {
      id: 5,
      mentee: "Steve Park",
      type: "Coffee Chat",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      price: 80
    }
  ])

  // ── HELPERS ─────────────────────────────────────────────
  const now = new Date()

  const upcomingSessions = sessions.filter(s => s.status === "upcoming")
  const completedSessions = sessions.filter(s => s.status === "completed")

  const isJoinable = (date) => {
    return (date - now) <= 60 * 60 * 1000 // within 1 hour
  }

  const handleJoin = (session) => {
    if (!isJoinable(session.date)) {
      alert("Session is more than 1 hour away")
      return
    }
    alert(`Joining session with ${session.mentee}`)
  }

  const last30DaysEarnings = sessions
    .filter(s => s.status === "completed")
    .reduce((sum, s) => sum + s.price, 0)

  const scheduledEarnings = sessions
    .filter(s => s.status === "upcoming")
    .reduce((sum, s) => sum + s.price, 0)

const updateSessionType = (index, field, value) => {
  const updated = [...mentor.sessionTypes]
  updated[index][field] = value

  setMentor({
    ...mentor,
    sessionTypes: updated
  })
}
  // ── UI ──────────────────────────────────────────────────
  return (
    <div className="ace-root mentor-dash-page">
      <AppShellNav />

      <main className="browse-main mentor-dash-main">
        <h1 className="section-title browse-title">Mentor dashboard</h1>
        <p className="browse-sub">
          Manage your sessions, track earnings, and update your profile.
        </p>

        {/* ── SUMMARY CARDS ───────────────── */}
        <div className="dash-grid-4">
          <div className="dash-card">
            <p className="dash-label">Today’s sessions</p>
            <p className="dash-value">{upcomingSessions.length}</p>
          </div>

          <div className="dash-card">
            <p className="dash-label">30-day earnings</p>
            <p className="dash-value">${last30DaysEarnings}</p>
          </div>

          <div className="dash-card">
            <p className="dash-label">Scheduled earnings</p>
            <p className="dash-value">${scheduledEarnings}</p>
          </div>

          <div className="dash-card">
            <p className="dash-label">Rating</p>
            <p className="dash-value">{mentor.rating}</p>
          </div>
        </div>

        {/* ── MAIN GRID ───────────────── */}
        <div className="dash-main-grid">

          {/* SESSION QUEUE */}
          <div className="dash-card-lg" id="upcoming-sessions">
            <h3 className="dash-section-title">Upcoming Sessions</h3>
            <div className="session-list-scroll">
              {upcomingSessions.map(session => (
              <div key={session.id} className="session-row">
                <div>
                  <p className="session-name">{session.mentee}</p>
                  <p className="session-meta">
                    {session.type} · {session.date.toLocaleString()}
                  </p>
                </div>

                <button
                  className={`btn ${isJoinable(session.date) ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleJoin(session)}
                >
                  Join
                </button>
              </div>

            ))}

            </div>
            

            {upcomingSessions.length === 0 && (
              <p className="browse-sub">No upcoming sessions</p>
            )}
          </div>

          

          {/* PROFILE */}
          <div className="dash-card-lg" id="profile-card">
            <h3 className="dash-section-title">Your Profile</h3>

            <p className="profile-name">{mentor.name}</p>
            <p className="profile-bio">{mentor.bio}</p>

            <div className="session-type-list">
              {mentor.sessionTypes.map((s, i) => (
                <div key={i} className="session-type-row">

                  <div className="session-type-info">
                    <p className="session-type-name">
                      {s.type.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="session-type-controls">

                    {/* Price Input */}
                    <input
                      type="number"
                      className="price-input"
                      value={s.price}
                      onChange={(e) =>
                        updateSessionType(i, "price", Number(e.target.value))
                      }
                    />

                    {/* Availability Toggle */}
                    <button
                      className={`btn ${s.available ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() =>
                        updateSessionType(i, "available", !s.available)
                      }
                    >
                      {s.available ? "On" : "Off"}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── COMPLETED SESSIONS ───────────────── */}
        <div className="dash-card-lg" id='completed-sessions-mentor'>
          <h3 className="dash-section-title">Completed Sessions</h3>
          <div className="session-list-scroll">

          {completedSessions.map(session => (
            <div key={session.id} className="session-row">
              <div>
                <p className="session-name">{session.mentee}</p>
                <p className="session-meta">
                  {session.type} · {session.date.toLocaleDateString()}
                </p>
              </div>
              <span className="session-price">${session.price}</span>
            </div>
          ))}
          </div>

          {completedSessions.length === 0 && (
            <p className="browse-sub">No completed sessions yet</p>
          )}
        </div>

      </main>
    </div>
  )
}