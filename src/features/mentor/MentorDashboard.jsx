import AppShellNav from '../../components/layout/AppShellNav.jsx'

export default function MentorDashboard() {
  return (
    <div className="ace-root mentor-dash-page">
      <AppShellNav />
      <main className="browse-main mentor-dash-main">
        <h1 className="section-title browse-title">Mentor dashboard</h1>
        <p className="browse-sub">
          This page is a placeholder for Check-In #2. Session queue, earnings, and profile tools will
          land here.
        </p>
        <div className="mentor-placeholder-card">
          <p className="mentor-placeholder-lead">Coming soon</p>
          <ul className="mentor-placeholder-list">
            <li>Upcoming and completed sessions</li>
            <li>Earnings summary</li>
            <li>Profile preview and availability</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
