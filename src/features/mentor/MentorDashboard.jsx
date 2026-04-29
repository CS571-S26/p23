// features/mentor/MentorDashboard.jsx
import { useState, useEffect, useCallback } from 'react'
import AppShellNav from '../../components/layout/AppShellNav.jsx'
import OverviewTab from './OverviewTab.jsx'
import SessionsTab from './SessionsTab.jsx'
import AvailabilityTab from './AvailabilityTab.jsx'
import ProfileTab from './ProfileTab.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { mockMentors } from '../../lib/mockData.js'
import {
  readMentorProfile,
  readAvailability,
  getMentorWithOverrides,
  DEFAULT_PRICING,
} from '../../lib/mentorStorage.js'
import {
  getSessionsForMentor,
  seedDemoSessionsIfEmpty,
} from '../../lib/sessionsStorage.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'

// For demo: any mentor login sees mentor_001 (Marcus Chen)
const DEMO_MENTOR_BASE = mockMentors[0]

const TABS = [
  { key: 'overview',      label: 'Overview',      icon: '📊' },
  { key: 'sessions',      label: 'Sessions',       icon: '📅' },
  { key: 'availability',  label: 'Availability',   icon: '🕐' },
  { key: 'profile',       label: 'Profile',        icon: '👤' },
]

export default function MentorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [sessions, setSessions] = useState([])
  const [mentor, setMentor] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [sessionTypes, setSessionTypes] = useState([])
  const [pricing, setPricing] = useState(DEFAULT_PRICING)

  // Load mentor data on mount
  useEffect(() => {
    const base = DEMO_MENTOR_BASE

    // Seed demo data if first visit
    seedDemoSessionsIfEmpty(base.id, base.name, base.firm, base.role)

    // Load sessions
    setSessions(getSessionsForMentor(base.id))

    // Load profile (with any saved overrides)
    const merged = getMentorWithOverrides(base)
    setMentor(merged)

    // Load saved pricing (from profile storage)
    const savedProfile = readMentorProfile(base.id)
    setSessionTypes(savedProfile?.sessionTypes ?? merged.sessionTypes ?? ['coaching', 'mock_interview'])
    setPricing(savedProfile?.pricing ?? DEFAULT_PRICING)

    // Load availability
    setAvailability(readAvailability(base.id))
  }, [])

  const refreshSessions = useCallback(() => {
    setSessions(getSessionsForMentor(DEMO_MENTOR_BASE.id))
  }, [])

  // Called when AvailabilityTab saves
  const handleAvailabilitySaved = useCallback(({ sessionTypes: st, pricing: p }) => {
    setSessionTypes(st)
    setPricing(p)
    // Persist session types + pricing inside profile storage too
    const base = DEMO_MENTOR_BASE
    const existing = readMentorProfile(base.id) ?? {}
    import('../../lib/mentorStorage.js').then(({ saveMentorProfile }) => {
      saveMentorProfile(base.id, { ...existing, sessionTypes: st, pricing: p })
    })
  }, [])

  // Called when ProfileTab saves
  const handleProfileSaved = useCallback((updatedProfile) => {
    setMentor((prev) => ({ ...prev, ...updatedProfile }))
  }, [])

  const now = new Date()
  const upcomingCount = sessions.filter((s) => new Date(s.scheduledAt) >= now).length

  if (!mentor || !availability) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-muted small">Loading dashboard…</div>
      </div>
    )
  }

  function getInitials(name = '') {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-vh-100" style={{ background: '#f8f9fc' }}>
      <AppShellNav />

      <Container fluid="xl" className="py-4 py-md-5">

        {/* Page header */}
        <Row className="mb-4 align-items-start g-3">
          <Col xs={12} md>
            <Stack direction="horizontal" gap={3} className="flex-wrap">
              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                style={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #003E92 0%, #1557C0 100%)',
                  fontSize: 18,
                  boxShadow: '0 4px 14px rgba(0,62,146,0.3)',
                }}
              >
                {getInitials(mentor.name)}
              </div>
              <div>
                <h1
                  className="fw-bold mb-0"
                  style={{ fontSize: '1.6rem', letterSpacing: '-0.5px', color: '#0a0f1e' }}
                >
                  {mentor.name}
                </h1>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                  {mentor.role} · {mentor.firm}
                </div>
              </div>
            </Stack>
          </Col>
          <Col xs={12} md="auto">
            <div
              className="rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              style={{ background: '#e8f5e9', border: '1px solid #a5d6a7' }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1b5e20', display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', color: '#1b5e20', fontWeight: 600 }}>
                Available for bookings
              </span>
            </div>
          </Col>
        </Row>

        {/* Tab navigation */}
        <div
          className="rounded-3 mb-4 p-1 d-flex flex-wrap gap-1"
          style={{ background: '#eef0f7', display: 'inline-flex' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="border-0 rounded-3 d-flex align-items-center gap-2 fw-medium"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: activeTab === tab.key ? '#fff' : 'transparent',
                color: activeTab === tab.key ? '#003E92' : '#6b7280',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === 'sessions' && upcomingCount > 0 && (
                <Badge
                  className="rounded-pill"
                  style={{
                    background: '#003E92',
                    color: '#fff',
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                  }}
                >
                  {upcomingCount}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'overview' && (
            <OverviewTab
              sessions={sessions}
              mentor={mentor}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === 'sessions' && (
            <SessionsTab sessions={sessions} />
          )}
          {activeTab === 'availability' && (
            <AvailabilityTab
              mentorId={DEMO_MENTOR_BASE.id}
              availability={availability}
              sessionTypes={sessionTypes}
              pricing={pricing}
              onSaved={handleAvailabilitySaved}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              mentorId={DEMO_MENTOR_BASE.id}
              mentor={mentor}
              sessionTypes={sessionTypes}
              onSaved={handleProfileSaved}
            />
          )}
        </div>

      </Container>
    </div>
  )
}