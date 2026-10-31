# Beginner React Frontend — Real Estate Management System

**Frontend only.** Your original `BACKEND` stays completely unchanged.

## How to attach it to your existing project

1. Make a backup of your original project.
2. Extract this ZIP. Copy the contents of `learner_react_frontend` into the `FRONTEND` directory of your original project (replace the old frontend files).
3. Start your **original** backend, using its existing `.env` and MongoDB connection. The backend needs `DATABASE` and `JWT_SECRET` configured (see your original backend files). Keep it running on port `3000` (or change the proxy target in `vite.config.js` to match).
4. Open another terminal in `FRONTEND` and run:

   ```bash
   npm install
   npm run dev
   ```

5. Visit the local URL Vite prints, normally `http://localhost:5173`.
6. Log in with an existing user from your MongoDB database. **This frontend does not create a default user or reset passwords.**

## Folder structure

```
FRONTEND/
  index.html                HTML entry point
  package.json              React and router dependencies
  vite.config.js            Sends /api requests to backend :3000
  src/
    main.jsx                Starts React
    App.jsx                 Routes + login checking + logout
    api.js                  One reusable fetch helper
    style.css               Basic CSS (no UI framework)
    pages/
      Login.jsx             Username/password form
      Dashboard.jsx         Project list and project CRUD
      ProjectDetails.jsx    Plots for one project and plot CRUD
```

## Understand the simple React concepts

- **Component:** A function returning JSX (for example `Login`, `Dashboard`).
- **useState:** Stores values which can change, such as form text, projects, and errors.
- **useEffect:** Runs when a page opens, so it can fetch data.
- **props:** The `user` and `onLogin` values passed from `App.jsx` to pages.
- **map:** Converts an array of projects/plots into HTML table rows.
- **React Router:** Changes pages without refreshing. `/dashboard` lists projects; `/projects/:id` opens plots for one project.
- **fetch:** Sends HTTP requests from `api.js` to Express.
- **CRUD:** Create uses POST, Read uses GET, Update uses PATCH, Delete uses DELETE.

## Exact original backend routes used

| Action | Method | Backend URL |
|---|---|---|
| Login | POST | `/api/auth/login` |
| Current user / role | GET | `/api/user/getUser` |
| Logout | POST | `/api/auth/logout` |
| All projects | GET | `/api/project/getProjects` |
| Create project (admin) | POST | `/api/project/createProject` |
| Update project (admin) | PATCH | `/api/project/updateProject/:id` |
| Delete project (admin) | DELETE | `/api/project/deleteProject/:id` |
| Single project | GET | `/api/project/getProject/:id` |
| Project plots | GET | `/api/plot/getPlots/:projectId` |
| Create plot (admin) | POST | `/api/plot/createPlot/:projectId` |
| Update plot (admin) | PATCH | `/api/plot/updatePlot/:projectId/:plotId` |
| Delete plot (admin) | DELETE | `/api/plot/deletePlot/:projectId/:plotId` |

**Important:** The existing backend requires an ADMIN account for changes. Workers can view projects and plots. The browser keeps the backend's login cookie; `credentials: 'include'` in `api.js` sends it with each request.

**No MongoDB connection in React:** React talks to Express, and Express talks to MongoDB. Never put the MongoDB URI or JWT secret in frontend code.

**Existing backend behavior:** list endpoints may return 404 if there are no entries; this frontend correctly treats those as empty lists. Project deletion in the existing backend may not delete related plots; be careful when deleting projects.

## Viva questions

**Q: Why do you use React?** To make reusable components and update the screen when data changes.

**Q: What does useEffect do?** It calls the server when the page is opened to load the latest records.

**Q: What does useState do?** It remembers things like username, selected project, form inputs and fetched records.

**Q: How does authentication work?** Express checks username/password and sets a JWT cookie; React gets current user details from `/api/user/getUser` and uses role to show allowed buttons. Express also enforces access permissions.

**Q: How is data saved?** The frontend sends requests to Express; Express validates and saves through Mongoose to MongoDB.

**Q: What is the role of the Vite proxy?** It forwards `/api` requests from the React development server to Express on port 3000 to avoid browser cross-origin setup issues while developing.

## Troubleshooting

- **Login fails / invalid credentials:** the original MongoDB database must contain a valid user. The frontend does not invent passwords.
- **Proxy error / ECONNREFUSED:** start the original Express backend on port 3000 or update `vite.config.js`.
- **Database connection fails:** configure MongoDB and backend `.env`; this cannot be fixed in React.
- **No Add/Edit/Delete buttons:** your account is `WORKER`, not `ADMIN`.
