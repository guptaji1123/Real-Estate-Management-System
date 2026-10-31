
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import PlotFilter from "../components/PlotFilter";

function ProjectDetails({ user }) {

  // Get project ID from URL
  const { id } = useParams();

  // Store project and plots
  const [project, setProject] = useState(null);
  const [plots, setPlots] = useState([]);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [maxPrice, setMaxPrice] = useState("");

  // Store form input values
  const [plotNumber, setPlotNumber] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("SQFT");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [description, setDescription] = useState("");

  // Form controls
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user.role === "ADMIN";
    // Filter plots based on search, status, and maximum price
  const filteredPlots = plots.filter((plot) => {
    const matchesSearch = String(plot.plotNumber)
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || plot.status === statusFilter;

    const matchesPrice =
      maxPrice === "" || Number(plot.price) <= Number(maxPrice);

    return matchesSearch && matchesStatus && matchesPrice;
  });

  // Load project details and its plots
  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const projectData = await api(
        "/project/getProject/" + id
      );

      setProject(projectData.project);

      try {
        const plotData = await api(
          "/plot/getPlots/" + id
        );

        setPlots(plotData.plots || []);

      } catch (error) {
        if (error.status === 404) {
          setPlots([]);
        } else {
          throw error;
        }
      }

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  // Load data when project ID changes
  useEffect(() => {
    loadData();
  }, [id]);

  // Open empty form for adding a plot
  function addPlot() {
    setPlotNumber("");
    setArea("");
    setUnit("SQFT");
    setPrice("");
    setStatus("AVAILABLE");
    setDescription("");

    setEditingId(null);
    setShowForm(true);
  }

  // Open form with existing plot details
  function editPlot(plot) {
    setPlotNumber(plot.plotNumber);
    setArea(String(plot.area));
    setUnit(plot.unit);
    setPrice(String(plot.price));
    setStatus(plot.status);
    setDescription(plot.description || "");

    setEditingId(plot._id);
    setShowForm(true);
  }

  // Create or update a plot
  async function savePlot(event) {
    event.preventDefault();
    setError("");

    const plotData = {
      plotNumber: plotNumber,
      area: Number(area),
      unit: unit,
      price: Number(price),
      status: status,
      description: description
    };

    let url = "/plot/createPlot/" + id;
    let method = "POST";

    if (editingId) {
      url = "/plot/updatePlot/" + id + "/" + editingId;
      method = "PATCH";
    }

    try {
      await api(url, {
        method: method,
        body: JSON.stringify(plotData)
      });

      setShowForm(false);
      await loadData();

    } catch (error) {
      setError(error.message);
    }
  }

  // Delete plot from database
  async function deletePlot(plot) {
    const confirmDelete = window.confirm(
      "Do you want to delete plot " + plot.plotNumber + "?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api(
        "/plot/deletePlot/" + id + "/" + plot._id,
        { method: "DELETE" }
      );

      await loadData();

    } catch (error) {
      setError(error.message);
    }
  }

  // Calculate plot statistics
  const availablePlots = plots.filter(
    plot => plot.status === "AVAILABLE"
  ).length;

  const bookedPlots = plots.filter(
    plot => plot.status === "BOOKED"
  ).length;

  const soldPlots = plots.filter(
    plot => plot.status === "SOLD"
  ).length;

  return (
    <main className="container">

      <Link to="/dashboard" className="back">
        ← Back to Dashboard
      </Link>

      {error && (
        <p className="error">{error}</p>
      )}

      {loading ? (
        <p>Loading project...</p>

      ) : project ? (
        <>

          {/* Project heading */}
          <div className="page-top">

            <div>
              <h1>{project.name}</h1>

              <p className="muted">
                📍 {project.location} · {project.status.replace("_", " ")}
              </p>

              <p>{project.description}</p>
            </div>

            {isAdmin && (
              <button
                className="primary"
                onClick={addPlot}
              >
                Add Plot
              </button>
            )}

          </div>

          {/* Plot statistics */}
          <section className="stats">

            <div className="stat">
              <span>Total Plots</span>
              <strong>{plots.length}</strong>
            </div>

            <div className="stat">
              <span>Available</span>
              <strong>{availablePlots}</strong>
            </div>

            <div className="stat">
              <span>Booked</span>
              <strong>{bookedPlots}</strong>
            </div>

            <div className="stat">
              <span>Sold</span>
              <strong>{soldPlots}</strong>
            </div>

          </section>

          {/* Add or edit plot form */}
          {showForm && isAdmin && (
            <form className="panel form" onSubmit={savePlot}>

              <h2>
                {editingId ? "Edit Plot" : "Add Plot"}
              </h2>

              <div className="form-grid">

                <label>
                  Plot Number
                  <input
                    required
                    maxLength="20"
                    value={plotNumber}
                    onChange={(event) =>
                      setPlotNumber(event.target.value)
                    }
                  />
                </label>

                <label>
                  Area
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={area}
                    onChange={(event) =>
                      setArea(event.target.value)
                    }
                  />
                </label>

                <label>
                  Area Unit
                  <select
                    value={unit}
                    onChange={(event) =>
                      setUnit(event.target.value)
                    }
                  >
                    <option value="SQFT">SQFT</option>
                    <option value="SQM">SQM</option>
                    <option value="BIGHA">BIGHA</option>
                    <option value="ACRE">ACRE</option>
                  </select>
                </label>

                <label>
                  Price (₹)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                  />
                </label>

                <label>
                  Status
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </label>

                <label>
                  Description
                  <textarea
                    maxLength="1000"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                </label>

              </div>

              <div className="actions">

                <button
                  className="primary"
                  type="submit"
                >
                  {editingId ? "Update Plot" : "Save Plot"}
                </button>

                <button
                  className="outline"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

          {/* Plot list */}
          <h2>Plots in this Project</h2>
          <PlotFilter
  search={search}
  setSearch={setSearch}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
/>

          <div className="panel table-wrap">

            <table>
              <thead>
                <tr>
                  <th>Plot No.</th>
                  <th>Area</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                 {filteredPlots.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="muted">
                      No plots added yet.
                    </td>
                  </tr>

                ) : (
                  filteredPlots.map((plot) => (
                    <tr key={plot._id}>

                      <td>
                        <strong>{plot.plotNumber}</strong>
                      </td>

                      <td>
                        {plot.area} {plot.unit}
                      </td>

                      <td>
                        ₹{Number(plot.price).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className="pill">
                          {plot.status}
                        </span>
                      </td>

                      <td>
                        {plot.description || "—"}
                      </td>

                      <td>
                        {isAdmin ? (
                          <div className="actions">

                            <button
                              className="outline"
                              onClick={() => editPlot(plot)}
                            >
                              Edit
                            </button>

                            <button
                              className="danger"
                              onClick={() => deletePlot(plot)}
                            >
                              Delete
                            </button>

                          </div>

                        ) : (
                          <span className="muted">
                            View only
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>

        </>

      ) : (
        <p>Project not found.</p>
      )}

    </main>
  );
}

export default ProjectDetails;
