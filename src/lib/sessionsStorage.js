// lib/sessionsStorage.js
// Thin wrapper around localStorage for booked sessions.
// Shape mirrors a Firestore doc so swapping the source later is trivial.
//
// Session shape:
// {
//   id: string,           // crypto.randomUUID()
//   studentUsername: string,
//   mentorId: string,
//   mentorName: string,
//   mentorFirm: string,
//   mentorRole: string,
//   sessionType: string,  // e.g. 'coaching' | 'mock_interview' | 'resume_review'
//   scheduledAt: string,  // ISO datetime string
//   bookedAt: string,     // ISO datetime string (when the booking was made)
//   status: 'upcoming' | 'cancelled',
// }

const STORAGE_KEY = 'ace_sessions'

/** @returns {Array} */
export function readSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @param {Object} session - full session object to append */
export function saveSession(session) {
  const sessions = readSessions()

  // Duplicate guard: same mentor + same scheduledAt
  const isDuplicate = sessions.some(
    (s) =>
      s.mentorId === session.mentorId &&
      s.scheduledAt === session.scheduledAt &&
      s.status !== 'cancelled',
  )
  if (isDuplicate) {
    throw new Error('You already have a session with this mentor at that time.')
  }

  sessions.push(session)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

/** @param {string} id - session id to cancel */
export function cancelSession(id) {
  const sessions = readSessions()
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx === -1) return
  sessions[idx] = { ...sessions[idx], status: 'cancelled' }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

/** Returns only non-cancelled sessions for a given student */
export function getSessionsForStudent(username) {
  return readSessions().filter(
    (s) => s.studentUsername === username && s.status !== 'cancelled',
  )
}
