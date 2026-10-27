import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  LogOut,
  MapPinned,
  Plus,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const role = "ADMIN";
                  
  const projects = [
    {
      name: "Green Valley Residency",
      totalPlots: 48,
      soldPlots: 12,
      availablePlots: 36,
      region: "North Sector",
    },
    {
      name: "Sunrise Residency",
      totalPlots: 60,
      soldPlots: 20,
      availablePlots: 40,
      region: "East Corridor",
    },
    {
      name: "Harbor View Estate",
      totalPlots: 72,
      soldPlots: 31,
      availablePlots: 41,
      region: "City Center",
    },
  ];

  const totalPlots = projects.reduce((total, project) => total + project.totalPlots, 0);
  const totalSoldPlots = projects.reduce((total, project) => total + project.soldPlots, 0);
  const totalAvailablePlots = projects.reduce(
    (total, project) => total + project.availablePlots,
    0
  );

  function handleAddProject(){
    
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <Building2 size={22} />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-wide">EstateHub</p>
              <p className="text-xs text-slate-400">Real Estate Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200">
              {role === "ADMIN" ? "Owner" : "Worker"}
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.header>

        <main className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Overview</p>
                <h2 className="mt-2 text-2xl font-bold">Dashboard</h2>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="text-sm text-slate-400">Portfolio Health</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-bold text-white">82%</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                    <TrendingUp size={14} />
                    +12.4%
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="text-sm text-slate-400">Current Focus</p>
                <p className="mt-3 text-lg font-semibold text-white">Plot allocation</p>
                <p className="mt-1 text-sm text-slate-400">Keep occupancy growth on track.</p>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 shadow-xl shadow-emerald-500/10"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">Welcome</p>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {role === "ADMIN" ? "Owner" : "Worker"}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Manage and monitor your real estate projects, land inventory, and booking activity from one centralized dashboard.
              </p>
            </motion.div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Projects", value: projects.length, accent: "emerald" },
                { label: "Total Plots", value: totalPlots, accent: "cyan" },
                { label: "Available Plots", value: totalAvailablePlots, accent: "emerald" },
                { label: "Sold Plots", value: totalSoldPlots, accent: "violet" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <p className="mt-5 text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Your Projects</h2>
                </div>

                {role === "ADMIN" && (
                  <button
                    onClick={handleAddProject} 
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    <Plus size={18} />
                    New Project
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <MapPinned size={20} />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">{project.region}</p>
                        <p className="mt-2 text-sm text-slate-300">
                          {project.totalPlots} plots · {project.soldPlots} sold · {project.availablePlots} available
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-medium text-emerald-300 transition hover:bg-emerald-500 hover:text-slate-950"
                    >
                      {role === "ADMIN" ? "Open Project" : "View Project"}
                      <ArrowUpRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div >
  );
}

export default Dashboard;