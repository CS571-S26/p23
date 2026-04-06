import { useEffect, useState, useRef } from 'react'
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
  const [modal, setModal] = useState({ open: false, mentor: null })
  const [sessionType, setSessionType] = useState('coaching')
  const [sessionTime, setSessionTime] = useState('')
  const [openFilter, setOpenFilter] = useState(null) // 'track' | 'firm' | null

  const dropdownRef = useRef(null)

  useEffect(() => setMentors(mockMentors), [])

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const openModal = (mentor) => {
    setModal({ open: true, mentor })
    setSessionType('coaching')
    setSessionTime('')
  }

  const closeModal = () => setModal({ open: false, mentor: null })

  const confirmSession = () => {
    alert(`Scheduled ${sessionType} with ${modal.mentor.name} at ${sessionTime}`)
    closeModal()
  }

  return (
    <div className="ace-root browse-page">
      <AppShellNav />
      <main className="browse-main">
        <div className="browse-header">
          <h1 className="section-title browse-title">Browse mentors</h1>
          <p className="browse-sub">Book sessions with insiders at your target firms.</p>
        </div>

        <div className="mentor-filters" ref={dropdownRef}>
          <div className="filter-container">
            <button className="btn btn-outline" onClick={() => setOpenFilter(openFilter === 'track' ? null : 'track')}>
              Select Tracks
            </button>
            {openFilter === 'track' && (
              <div className="filter-dropdown">
                {tracks.map((t) => (
                  <label key={t} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.track.includes(t)}
                      onChange={() => handleFilterChange('track', t)}
                    />{' '}
                    {t}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-container">
            <button className="btn btn-outline" onClick={() => setOpenFilter(openFilter === 'firm' ? null : 'firm')}>
              Select Companies
            </button>
            {openFilter === 'firm' && (
              <div className="filter-dropdown">
                {firms.map((f) => (
                  <label key={f} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.firm.includes(f)}
                      onChange={() => handleFilterChange('firm', f)}
                    />{' '}
                    {f}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <button className="btn btn-primary schedule-btn" onClick={() => openModal(m)}>
                Schedule Session
              </button>
            </article>
          ))}
        </div>

        {modal.open && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Schedule Session with {modal.mentor.name}</h3>
              <label>
                Session Type:
                <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
                  {modal.mentor.sessionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Time:
                <input type="datetime-local" value={sessionTime} onChange={(e) => setSessionTime(e.target.value)} />
              </label>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmSession}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}