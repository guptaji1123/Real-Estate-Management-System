function Dashboard() {
  const role = "ADMIN";

  const projects = [
    {
      name: "Green Valley Residency",
      totalPlots: 48,
      soldPlots: 12,
      availablePlots: 36,
    },
    {
      name: "Sunrise Residency",
      totalPlots: 60,
      soldPlots: 20,
      availablePlots: 40,
    },
  ];

  const totalPlots = projects.reduce(
    (total, project) => total + project.totalPlots,
    0
  );

  const totalSoldPlots = projects.reduce(
    (total, project) => total + project.soldPlots,
    0
  );

  const totalAvailablePlots = projects.reduce(
    (total, project) => total + project.availablePlots,
    0
  );
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Real Estate Management System</h1>

        <div className="user-area">
          <span>
            {role === "ADMIN" ? "Owner" : "Worker"}
          </span>

          <button>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>
          Welcome back, {role === "ADMIN" ? "Owner" : "Worker"}
        </h2>

        <p>
          Manage and monitor your real estate projects.
        </p>

        <section className="stats">
          <div>
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>

          <div className="stat-card">
  <h3>Total Plots</h3>
  <p>{totalPlots}</p>
</div>

<div className="stat-card">
  <h3>Available Plots</h3>
  <p>{totalAvailablePlots}</p>
</div>

<div className="stat-card">
  <h3>Sold Plots</h3>
  <p>{totalSoldPlots}</p>
</div>
        </section>

        <section className="projects-section">
          <div className="section-header">
  <h2>Your Projects</h2>
           
            {role === "ADMIN" && (
              <button>+ New Project</button>
            )}
          </div>

          {projects.map((project) => (
           <div className="project-card" key={project.name}>
              <h3>{project.name}</h3>

              <p>
                {project.totalPlots} Plots ·{" "}
                {project.soldPlots} Sold ·{" "}
                {project.availablePlots} Available
              </p>

              <button>
                {role === "ADMIN"
                  ? "Open Project"
                  : "View Project"}
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;