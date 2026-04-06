import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShellNav from '../../components/layout/AppShellNav.jsx'
import { mockMentors } from '../../lib/mockData.js'

function trackClass(track) {
  const t = track.toLowerCase()
  if (t.includes('banking')) return 'ib'
  if (t.includes('consulting')) return 'consulting'
  if (t.includes('tech')) return 'tech'
  if (t.includes('equity') || t.includes('pe')) return 'pe'
  return 'ib'
}

function trackTagLabel(track) {
  const t = track.toLowerCase()
  if (t.includes('banking')) return 'IB'
  if (t.includes('consulting')) return 'Consulting'
  if (t.includes('tech')) return 'Tech'
  if (t.includes('equity') || t.includes('pe')) return 'PE'
  return track.slice(0, 3)
}

export default function BrowsePage() {
  const [mentors, setMentors] = useState([])
  const [filters, setFilters] = useState({ track: [], firm: [] })
  const [openFilter, setOpenFilter] = useState(null)
  const navigate = useNavigate()

  useEffect(() => setMentors(mockMentors), [])

  const tracks = Array.from(new Set(mockMentors.map((m) => m.track)))
  const firms = Array.from(new Set(mockMentors.map((m) => m.firm)))

  const filteredMentors = mentors.filter((m) => {
    const trackMatch = filters.track.length === 0 || filters.track.includes(m.track)
    const firmMatch = filters.firm.length === 0 || filters.firm.includes(m.firm)
    return trackMatch && firmMatch
  })

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const values = prev[type]
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
      return { ...prev, [type]: newValues }
    })
  }

  const goToSchedule = (mentor) => {
    navigate('/schedule-session', { state: { mentor } })
  }

  return (
    <div className="ace-root browse-page">
      <AppShellNav />
      <main className="browse-main">
        <div className="browse-header">
          <h1 className="section-title browse-title">Browse mentors</h1>
          <p className="browse-sub">Book sessions with insiders at your target firms.</p>
        </div>

        {/* Filters */}
        <div className="mentor-filters">
          <div className="filter-container">
            <button
              className="btn btn-outline"
              onClick={() => setOpenFilter(openFilter === 'track' ? null : 'track')}
            >
              Select Tracks
            </button>
            {openFilter === 'track' && (
              <div className="filter-dropdown">
                {tracks.map((t) => (
                  <label className="filter-option" key={t}>
                    <input
                      type="checkbox"
                      checked={filters.track.includes(t)}
                      onChange={() => handleFilterChange('track', t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-container">
            <button
              className="btn btn-outline"
              onClick={() => setOpenFilter(openFilter === 'firm' ? null : 'firm')}
            >
              Select Companies
            </button>
            {openFilter === 'firm' && (
              <div className="filter-dropdown">
                {firms.map((f) => (
                  <label className="filter-option" key={f}>
                    <input
                      type="checkbox"
                      checked={filters.firm.includes(f)}
                      onChange={() => handleFilterChange('firm', f)}
                    />
                    {f}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mentor cards */}
        <div className="mentor-grid">
          {filteredMentors.map((m) => (
            <article className="mentor-card" key={m.id}>
              <div className="mentor-card-top">
                <div className="mentor-header">
                  <div className="mentor-avatar">{m.name.split(' ').map((n) => n[0]).join('')}</div>
                  <div className="mentor-info">
                    <div className="mentor-name">{m.name}</div>
                    <div className="mentor-role">{m.role} · {m.firm}</div>
                  </div>
                  <div className={`mentor-track-tag track-${trackClass(m.track)}`}>{trackTagLabel(m.track)}</div>
                </div>
                <p className="mentor-specialty" title={m.bio}>{m.bio}</p>
                <div className="mentor-meta">
                  <span>⭐ {m.rating.toFixed(1)}</span>
                  <span>{m.totalSessions} sessions</span>
                  <span className="mentor-price">${m.pricePerSession}</span>
                </div>
              </div>
              <button className="btn btn-primary schedule-btn" onClick={() => goToSchedule(m)}>
                Schedule Session
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}