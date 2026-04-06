import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setMentors(mockMentors)
  }, [])

  return (
    <div className="ace-root browse-page">
      <AppShellNav />
      <main className="browse-main">
        <div className="browse-header">
          <h1 className="section-title browse-title">Browse mentors</h1>
          <p className="browse-sub">
            Book sessions with insiders at your target firms. Scheduling and checkout are coming next.
          </p>
        </div>
        <div className="mentor-grid">
          {mentors.map((m) => (
            <article className="mentor-card" key={m.id}>
              <div className="mentor-header">
                <div className="mentor-avatar">
                  {m.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="mentor-name">{m.name}</div>
                  <div className="mentor-role">
                    {m.role} · {m.firm}
                  </div>
                </div>
                <div className={`mentor-track-tag track-${trackClass(m.track)}`}>
                  {trackTagLabel(m.track)}
                </div>
              </div>
              <p className="mentor-specialty">{m.bio}</p>
              <div className="mentor-meta">
                <span>⭐ {m.rating}</span>
                <span>{m.totalSessions} sessions</span>
                <span className="mentor-price">${m.pricePerSession}</span>
              </div>
              <p className="browse-card-note">Session booking — coming soon</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
