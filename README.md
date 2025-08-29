Team Task Manager (Trello-Lite)
A lightweight task management application inspired by Trello, built as a full-stack code challenge. Teams can create projects, add tasks with titles, descriptions, assignees, due dates, and statuses (To Do, In Progress, Done), and manage tasks on a Kanban-style board with drag-and-drop functionality. The app supports user authentication, role-based permissions, and responsive design.
Features

User Authentication: Sign up, log in, and log out using JWT-based authentication.
Project Management: Create, update, and delete projects.
Task Management: Add, update, and delete tasks with title, description, assignee, due date, and status.
Kanban Board: Drag-and-drop tasks between "To Do", "In Progress", and "Done" columns.
User Management: Projects have members; only members or owners can manage tasks.
Responsive UI: Mobile-friendly design with clean, modern styling.
Error Handling: Clear error messages for API failures and user input validation.

Tech Stack

Frontend: React, TypeScript, Context API for state management, @hello-pangea/dnd for drag-and-drop, Axios for API calls.
Backend: Node.js, Express, TypeScript, JWT for authentication, Mongoose for MongoDB.
Database: MongoDB (MongoDB Atlas for cloud deployment).
Styling: Custom CSS .
Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database).

Installation

Clone the Repository:
git clone git@github.com:AkankshaKumbhamwar/team-task-manager.git


Backend Setup:
cd backend
npm install -f

Create a .env file in the backend/ directory with:
MONGO_URI=mongodb+srv://kumbhamwar2001_db_user:r0MZWKrBtvTs650k@cluster0.uc8y21q.mongodb.net/
JWT_SECRET=jkfjkadswedda

Generate a JWT_SECRET using a tool like openssl rand -hex 32.

Frontend Setup:
cd frontend
npm install



Running Locally

Start MongoDB:

Ensure MongoDB is running locally or use MongoDB Atlas (see Deployment).
For local MongoDB, install and run mongod (default: mongodb://localhost:27017).


Run Backend:
cd backend
npm run dev

The backend runs on http://localhost:5000.

Run Frontend:
cd frontend
npm start

The frontend runs on http://localhost:3001 and proxies API calls to http://localhost:5000 (configured in frontend/package.json).

Test Locally:

Open http://localhost:3001/login.
Register a user, log in, create projects, and manage tasks.
Use the Kanban board at http://localhost:3001/project/:id.



Deployment
The app is deployed using free-tier services for a working hosted demo.
Deployed URLs

Frontend: https://team-task-manager-l6iliumjj-akanksha-kumbhamwars-projects.vercel.app
Backend: https://team-task-manager-8n3n.onrender.com
Database: mongodb+srv://kumbhamwar2001_db_user:r0MZWKrBtvTs650k@cluster0.uc8y21q.mongodb.net/

Deployment Instructions

Database (MongoDB Atlas):

Sign up at mongodb.com/atlas.
Create a free M0 cluster (512MB storage).
Add a database user and whitelist IP 0.0.0.0/0 (for demo).
Copy the MongoDB URI (e.g., mongodb+srv://admin:<password>@cluster.mongodb.net/trello_lite).


Backend (Render):

Sign up at render.com.
Create a new web service, connect your GitHub repo (backend/ directory).
Set environment variables:
MONGO_URI: mongodb+srv://kumbhamwar2001_db_user:r0MZWKrBtvTs650k@cluster0.uc8y21q.mongodb.net/.
JWT_SECRET:--.


Build Command: npm install
Start Command: npm run start
Deploy and get the backend URL (e.g., https://trello-lite-backend.onrender.com).


Frontend (Vercel):

Sign up at vercel.com.
Create a new project, connect your GitHub repo (frontend/ directory).
Set environment variable:
REACT_APP_API_URL: Your Render backend URL (e.g., https://trello-lite-backend.onrender.com).


Deploy and get the frontend URL (e.g., https://trello-lite-frontend.vercel.app).


Update CORS:

In backend/server.ts, set CORS to allow the Vercel frontend URL:import cors from 'cors';
app.use(cors({ origin: 'https://team-task-manager-l6iliumjj-akanksha-kumbhamwars-projects.vercel.app' }));


Push changes to trigger a redeploy on Render.


Test Demo:

Visit the frontend URL, register/login, and test project/task creation.
Use Postman to test backend APIs (e.g., POST /api/auth/login).



Assumptions

Database: MongoDB is used (MongoDB Atlas for cloud, local MongoDB for development).
Authentication: JWT-based, with tokens stored in local storage.
Permissions: Only project members or owners can manage tasks (enforced via backend middleware).
Styling: Custom CSS for all components (Login, Register, Dashboard, ProjectBoard).
Frontend Proxy: frontend/package.json includes "proxy": "http://localhost:5000" for local development.
No External Libraries: Avoided CSS frameworks like TailwindCSS; used @hello-pangea/dnd for Kanban drag-drop.

Notes for Evaluators

Code Quality: Modular structure with TypeScript interfaces, reusable components, and clear separation of concerns.
Frontend: Responsive UI with custom CSS, Context API for state, error handling, and drag-and-drop Kanban board.
Backend: REST API with JWT authentication, role-based permissions, and Mongoose for MongoDB.
Database: MongoDB schema with users, projects, and tasks collections, supporting task assignees and due dates.
Deployment: Fully deployed on free tiers (MongoDB Atlas, Render, Vercel) with minimal setup.
Bonus Features: Not implemented due to time constraints, but the codebase is extensible for task comments, file attachments, or notifications.

