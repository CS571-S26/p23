import { Link } from 'react-router-dom'

const mentors = [
  { name: "Marcus Chen", role: "Investment Banking Analyst", firm: "Goldman Sachs", tag: "IB", sessions: 47, rating: 4.9, specialty: "IB Recruiting & Superday Prep", price: 200 },
  { name: "Priya Nair", role: "Associate", firm: "McKinsey & Company", tag: "Consulting", sessions: 63, rating: 5.0, specialty: "Case Interview Mastery", price: 250 },
  { name: "Jordan Wells", role: "Senior Software Engineer", firm: "Meta", tag: "Tech", sessions: 38, rating: 4.8, specialty: "FAANG System Design & LC", price: 175 },
  { name: "Sofia Reyes", role: "PE Associate", firm: "KKR", tag: "PE", sessions: 29, rating: 4.9, specialty: "PE Recruiting & LBO Modeling", price: 300 },
]

const tracks = [
  { label: "Investment Banking", icon: "📈", desc: "Bulge bracket & boutique IB recruiting, superdays, technicals" },
  { label: "Private Equity", icon: "🏛️", desc: "On-cycle & off-cycle PE prep, LBO modeling, case studies" },
  { label: "Management Consulting", icon: "♟️", desc: "MBB & T2 case interview coaching, fit rounds, offer navigation" },
  { label: "Tech & FAANG", icon: "⚡", desc: "System design, LeetCode strategy, behavioral loops, new-grad pipelines" },
]

const services = [
  { title: "Strategy Call", price: "From $100", desc: "A focused 1:1 session on your recruiting timeline, approach, and positioning. Tailored to your exact target role.", tag: "Most popular" },
  { title: "Mock Interview", price: "From $150", desc: "Full simulation of a real technical or behavioral round — followed by detailed, actionable feedback from someone who's sat on both sides.", tag: "Highest impact" },
  { title: "Application Review", price: "From $100", desc: "Insider critique of your resume, cover letter, or networking outreach — calibrated to exactly what top firms want to see.", tag: null },
]

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  return (
    <div className="ace-root">
      <nav className="ace-nav">
        <Link to="/" className="nav-logo nav-logo-link">
          ACE
        </Link>
        <div className="nav-links">
          <button type="button" className="nav-scroll-link" onClick={() => scrollToId('how')}>
            How it works
          </button>
          <button type="button" className="nav-scroll-link" onClick={() => scrollToId('tracks')}>
            Tracks
          </button>
          <button type="button" className="nav-scroll-link" onClick={() => scrollToId('mentors')}>
            Mentors
          </button>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-nav-secondary">
            Log in
          </Link>
          <button type="button" className="btn btn-nav" onClick={() => scrollToId('cta')}>
            Book a Session →
          </button>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-bg-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-badge">Elite Recruiting Insider Network</div>
          <h1 className="hero-headline">
            Get the edge.<br />
            <span className="hero-accent">Straight from the source.</span>
          </h1>
          <p className="hero-sub">
            1:1 sessions with real analysts, associates, and engineers at Goldman, McKinsey, KKR, and Meta — built for candidates targeting the world&apos;s most competitive roles.
          </p>
          <div className="hero-ctas">
            <button type="button" className="btn btn-primary" onClick={() => scrollToId('mentors')}>
              Browse Mentors →
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => scrollToId('how')}>
              See how it works
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Sessions booked</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Average rating</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">78%</span><span className="stat-label">Offer rate</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="card-float card-float-1">
            <div className="cf-tag">Mock Interview</div>
            <div className="cf-name">Marcus C.</div>
            <div className="cf-firm">Goldman Sachs · IB</div>
            <div className="cf-price">$200 / session</div>
          </div>
          <div className="card-float card-float-2">
            <div className="cf-tag">Strategy Call</div>
            <div className="cf-name">Priya N.</div>
            <div className="cf-firm">McKinsey · Consulting</div>
            <div className="cf-price">$250 / session</div>
          </div>
          <div className="hero-orb" />
        </div>
      </section>

      <section className="section how" id="how">
        <div className="section-label">The Process</div>
        <h2 className="section-title">Three steps to your offer</h2>
        <div className="steps">
          {[
            { n: "01", title: "Choose your track", body: "Select the industry and role you're targeting — IB, PE, consulting, or tech." },
            { n: "02", title: "Pick your insider", body: "Browse vetted professionals currently working at the firms you want. Filter by role, seniority, and specialty." },
            { n: "03", title: "Book and prepare", body: "Lock in a session, get prep notes in advance, and walk out with an actionable roadmap." },
          ].map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-body"><h3>{s.title}</h3><p>{s.body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section tracks" id="tracks">
        <div className="section-label">Coverage</div>
        <h2 className="section-title">Built for elite recruiting</h2>
        <div className="track-grid">
          {tracks.map((t) => (
            <div className="track-card" key={t.label}>
              <span className="track-icon">{t.icon}</span>
              <h3 className="track-name">{t.label}</h3>
              <p className="track-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section services" id="services">
        <div className="section-label">What you book</div>
        <h2 className="section-title">Outcome-oriented sessions</h2>
        <div className="service-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              {s.tag && <div className="service-tag">{s.tag}</div>}
              <h3 className="service-title">{s.title}</h3>
              <p className="service-price">{s.price}</p>
              <p className="service-desc">{s.desc}</p>
              <button type="button" className="btn btn-outline" onClick={() => scrollToId('mentors')}>
                Browse mentors →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section mentors" id="mentors">
        <div className="section-label">The Roster</div>
        <h2 className="section-title">Meet your insiders</h2>
        <div className="mentor-grid">
          {mentors.map((m) => (
            <div className="mentor-card" key={m.name}>
              <div className="mentor-header">
                <div className="mentor-avatar">{m.name.split(" ").map((n) => n[0]).join("")}</div>
                <div>
                  <div className="mentor-name">{m.name}</div>
                  <div className="mentor-role">{m.role} · {m.firm}</div>
                </div>
                <div className={`mentor-track-tag track-${m.tag.toLowerCase()}`}>{m.tag}</div>
              </div>
              <div className="mentor-specialty">{m.specialty}</div>
              <div className="mentor-meta">
                <span>⭐ {m.rating}</span>
                <span>{m.sessions} sessions</span>
                <span className="mentor-price">${m.price}</span>
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={() => scrollToId('cta')}>
                Book session →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner" id="cta">
        <div className="cta-inner">
          <h2 className="cta-headline">Ready to get the insider edge?</h2>
          <p className="cta-sub">Join hundreds of candidates who used Ace to land roles at Goldman, McKinsey, Meta, and beyond.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => scrollToId('mentors')}>
            Browse mentors now →
          </button>
        </div>
        <div className="cta-orb" aria-hidden="true" />
      </section>

      <footer className="footer">
        <span className="footer-logo">ACE</span>
        <span className="footer-tag">The insider path to elite careers.</span>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
