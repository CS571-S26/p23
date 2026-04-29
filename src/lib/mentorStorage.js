// lib/mentorStorage.js
// Persists mentor profile edits and availability to localStorage.
// Shape mirrors Firestore so swapping the source later is trivial.
//
// Mentor profile override shape:
// {
//   name: string,
//   firm: string,
//   role: string,
//   bio: string,
//   sessionTypes: Array<'coaching' | 'mock_interview' | 'resume_review'>,
//   pricing: { coaching: number, mock_interview: number, resume_review: number },
// }
//
// Availability shape:
// {
//   mon: { enabled: boolean, start: string, end: string },  // start/end like "09:00"
//   tue: { enabled: boolean, start: string, end: string },
//   wed: { enabled: boolean, start: string, end: string },
//   thu: { enabled: boolean, start: string, end: string },
//   fri: { enabled: boolean, start: string, end: string },
//   sat: { enabled: boolean, start: string, end: string },
//   sun: { enabled: boolean, start: string, end: string },
// }

const PROFILE_KEY = (mentorId) => `ace_mentor_profile_${mentorId}`
const AVAILABILITY_KEY = (mentorId) => `ace_mentor_avail_${mentorId}`

export const DEFAULT_AVAILABILITY = {
  mon: { enabled: true,  start: '09:00', end: '17:00' },
  tue: { enabled: true,  start: '09:00', end: '17:00' },
  wed: { enabled: false, start: '09:00', end: '17:00' },
  thu: { enabled: true,  start: '09:00', end: '17:00' },
  fri: { enabled: true,  start: '09:00', end: '17:00' },
  sat: { enabled: false, start: '10:00', end: '14:00' },
  sun: { enabled: false, start: '10:00', end: '14:00' },
}

export const DEFAULT_PRICING = {
  coaching: 200,
  mock_interview: 200,
  resume_review: 200,
}

// ── Profile ──────────────────────────────────────────────────────────────────

/** Returns saved profile overrides merged with base mentor data */
export function readMentorProfile(mentorId) {
  try {
    const raw = localStorage.getItem(PROFILE_KEY(mentorId))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** Saves full profile override object */
export function saveMentorProfile(mentorId, profile) {
  localStorage.setItem(PROFILE_KEY(mentorId), JSON.stringify(profile))
}

// ── Availability ─────────────────────────────────────────────────────────────

/** Returns saved weekly availability, falling back to defaults */
export function readAvailability(mentorId) {
  try {
    const raw = localStorage.getItem(AVAILABILITY_KEY(mentorId))
    if (!raw) return DEFAULT_AVAILABILITY
    return { ...DEFAULT_AVAILABILITY, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_AVAILABILITY
  }
}

/** Saves full availability object */
export function saveAvailability(mentorId, availability) {
  localStorage.setItem(AVAILABILITY_KEY(mentorId), JSON.stringify(availability))
}

// ── Helper: merge base mentor with saved overrides ───────────────────────────

/**
 * Given a base mentor object (from mockData), merges any saved profile overrides.
 * Always returns a full mentor object.
 */
export function getMentorWithOverrides(baseMentor) {
  if (!baseMentor) return null
  const saved = readMentorProfile(baseMentor.id)
  if (!saved) return baseMentor
  return { ...baseMentor, ...saved }
}