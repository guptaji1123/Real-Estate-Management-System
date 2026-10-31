
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function Dashboard({ user }) {

  // Store projects from MongoDB
  const [projects, setProjects] = useState([]);

  // Store values entered in the form
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PLANNING");

  // Control form and editing
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Display errors and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === "ADMIN";

  // Get projects from backend
  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const data = await api("/project/getProjects");
      setProjects(data.projects || []);
    } catch (error) {
      if (error.status === 404) {
        setProjects([]);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Run once when dashboard opens
  useEffect(() => {
    loadProjects();
  }, []);

  // Open form for new project
  function addProject() {
    setName("");
    setLocation("");
    setDescription("");
    setStatus("PLANNING");

    setEditingId(null);
    setShowForm(true);
  }

  // Open form with existing project details
  function editProject(project) {
    setName(project.name);
    setLocation(project.location);
    setDescription(project.description || "");
    setStatus(project.status);

    setEditingId(project._id);
    setShowForm(true);
  }

  // Save new project or update existing project
  async function saveProject(event) {
    event.preventDefault();

    const projectData = {
      name: name,
      location: location,
      description: description,
      status: status
    };

    let url = "/project/createProject";
    let method = "POST";

    if (editingId) {
      url = "/project/updateProject/" + editingId;
      method = "PATCH";
    }

    try {
      await api(url, {
        method: method,
        body: JSON.stringify(projectData)
      });

      setShowForm(false);
      await loadProjects();

    } catch (error) {
      setError(error.message);
    }
  }

  // Delete a project
  async function deleteProject(project) {
    const confirmDelete = window.confirm(
      "Do you want to delete " + project.name + "?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api("/project/deleteProject/" + project._id, {
        method: "DELETE"
      });

      await loadProjects();

    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="container">

      <div className="page-top">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your real-estate projects</p>
        </div>

        {isAdmin && (
          <button className="primary" onClick={addProject}>
            Add Project
          </button>
        )}
      </div>

      {/* Project statistics */}
      <section className="stats">

        <div className="stat">
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="stat">
          <span>Ongoing</span>
          <strong>
            {projects.filter(project =>
              project.status === "ONGOING"
            ).length}
          </strong>
        </div>

        <div className="stat">
          <span>Completed</span>
          <strong>
            {projects.filter(project =>
              project.status === "COMPLETED"
            ).length}
          </strong>
        </div>

      </section>

      {error && <p className="error">{error}</p>}

      {/* Add or edit project form */}
      {showForm && isAdmin && (
        <form className="panel form" onSubmit={saveProject}>

          <h2>
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          <div className="form-grid">

            <label>
              Project Name
              <input
                required
                minLength="3"
                maxLength="100"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              Location
              <input
                required
                maxLength="200"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>

            <label>
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="PLANNING">Planning</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </label>

            <label>
              Description
              <textarea
                maxLength="1000"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

          </div>

          <div className="actions">
            <button className="primary" type="submit">
              {editingId ? "Update Project" : "Save Project"}
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

      {/* Project list */}
      <h2>Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="panel table-wrap">
          <table>

            <thead>
              <tr>
                <th>Project</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>

                  <td>
                    <strong>{project.name}</strong>
                    <p className="muted small">
                      {project.description}
                    </p>
                  </td>

                  <td>{project.location}</td>

                  <td>{project.status.replace("_", " ")}</td>

                  <td>
                    <div className="actions">

                      <Link
                        className="button-link"
                        to={"/projects/" + project._id}
                      >
                        View Plots
                      </Link>

                      {isAdmin && (
                        <>
                          <button
                            className="outline"
                            onClick={() => editProject(project)}
                          >
                            Edit
                          </button>

                          <button
                            className="danger"
                            onClick={() => deleteProject(project)}
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </main>
  );
}

export default Dashboard;
