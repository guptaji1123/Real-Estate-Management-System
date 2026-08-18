function Dashboard() {
  const role = "ADMIN";
  const userRole = role === "ADMIN" ? "Owner" : "Worker";

  const projects = [
    {
      name: "Green Valley Residency",
      location: "North Sector",
      totalPlots: 48,
      soldPlots: 12,
      availablePlots: 36,
      occupancy: 75,
      status: "On Track",
    },
    {
      name: "Sunrise Residency",
      location: "East Hills",
      totalPlots: 60,
      soldPlots: 20,
      availablePlots: 40,
      occupancy: 67,
      status: "Healthy",
    },
    {
      name: "Lake View Estate",
      location: "West End",
      totalPlots: 34,
      soldPlots: 27,
      availablePlots: 7,
      occupancy: 79,
      status: "Selling Fast",
    },
  ];

  const totalPlots = projects.reduce((total, project) => total + project.totalPlots, 0);
  const totalSoldPlots = projects.reduce((total, project) => total + project.soldPlots, 0);
  const totalAvailablePlots = projects.reduce((total, project) => total + project.availablePlots, 0);

  const stats = [
    { label: "Projects", value: projects.length, detail: "Active developments" },
    { label: "Total Plots", value: totalPlots, detail: "Across all sites" },
    { label: "Available Plots", value: totalAvailablePlots, detail: "Ready to sell" },
    { label: "Sold Plots", value: totalSoldPlots, detail: "Confirmed sales" },
  ];

  const activity = [
    { title: "New booking received", time: "2 hours ago" },
    { title: "Plot allocation updated", time: "5 hours ago" },
    { title: "Payment confirmation approved", time: "Yesterday" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark">E</div>
            <div>
              <p className="brand-title">EstateHub</p>
              <span className="brand-subtitle">Real Estate Management</span>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="user-pill">{userRole}</span>
            <button type="button" className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="welcome-panel">
            <div>
              <p className="eyebrow">Dashboard overview</p>
              <h1>Welcome back, {userRole}</h1>
              <p className="subtext">Manage and monitor your real estate projects.</p>
            </div>

            {role === "ADMIN" && (
              <button type="button" className="primary-btn">
                + New Project
              </button>
            )}
          </section>

          <section className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span className="stat-label">{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            ))}
          </section>

          <section className="dashboard-grid">
            <div className="project-panel">
              <div className="panel-header">
                <h2>Your Projects</h2>
                {role === "ADMIN" && (
                  <button type="button" className="ghost-btn">
                    + Add
                  </button>
                )}
              </div>

              <div className="project-list">
                {projects.map((project) => (
                  <article className="project-card" key={project.name}>
                    <div className="project-header">
                      <div>
                        <h3>{project.name}</h3>
                        <span>{project.location}</span>
                      </div>

                      <span className={`status-badge ${project.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="project-meta">
                      <span>{project.totalPlots} plots</span>
                      <span>{project.soldPlots} sold</span>
                      <span>{project.availablePlots} available</span>
                    </div>

                    <div className="progress-wrap">
                      <div className="progress-bar">
                        <span style={{ width: `${project.occupancy}%` }} />
                      </div>
                      <label>{project.occupancy}% sold</label>
                    </div>

                    <button type="button" className="secondary-btn">
                      {role === "ADMIN" ? "Open Project" : "View Project"}
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <aside className="side-panel">
              <div className="mini-panel">
                <div className="panel-header">
                  <h3>Quick Overview</h3>
                </div>

                <ul className="activity-list">
                  {activity.map((item) => (
                    <li key={item.title}>
                      <span className="activity-dot" />
                      <div>
                        <p>{item.title}</p>
                        <small>{item.time}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mini-panel summary-panel">
                <div className="panel-header">
                  <h3>Portfolio</h3>
                </div>

                <div className="summary-box">
                  <div>
                    <span>Sales Rate</span>
                    <strong>{Math.round((totalSoldPlots / totalPlots) * 100)}%</strong>
                  </div>
                  <div>
                    <span>Revenue</span>
                    <strong>$1.4M</strong>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;