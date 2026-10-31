
import { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";

import { api } from "./api";

import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";


// Main website component
function Site() {

  // Store currently logged-in user
  const [user, setUser] = useState(null);

  // Check whether user is already logged in
  const [checking, setChecking] = useState(true);


  // Check login when website opens
  useEffect(() => {

    async function checkLogin() {

      try {
        const data = await api("/user/getUser");

        setUser(data.user);

      } catch (error) {
        setUser(null);

      } finally {
        setChecking(false);
      }
    }

    checkLogin();

  }, []);


  // Logout function
  async function logout() {

    try {
      await api("/auth/logout", {
        method: "POST"
      });

      setUser(null);

    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  }


  // Display loading message while checking login
  if (checking) {
    return (
      <div className="centered">
        Checking login...
      </div>
    );
  }


  return (
    <>

      {/* Header appears only after login */}
      {user && (
        <header>

          <Link to="/dashboard" className="brand">
            Real Estate Manager
          </Link>

          <div>

            <span className="username">
              {user.username} ({user.role})
            </span>

            <button
              className="outline"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>
      )}


      {/* Define website pages */}
      <Routes>

        {/* Login page */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={setUser} />
            )
          }
        />


        {/* Dashboard page */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        {/* Project details page */}
        <Route
          path="/projects/:id"
          element={
            user ? (
              <ProjectDetails user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        {/* Redirect unknown URLs */}
        <Route
          path="*"
          element={
            <Navigate
              to={user ? "/dashboard" : "/"}
              replace
            />
          }
        />

      </Routes>

    </>
  );
}


// Wrap the website in React Router
function App() {

  return (
    <BrowserRouter>
      <Site />
    </BrowserRouter>
  );
}

export default App;
