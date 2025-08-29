import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Project {
  _id: string;
  name: string;
  members: { _id: string; name: string; email: string }[];
  owner: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects'); // Debug log
      const res = await axios.get<Project[]>('/api/projects');
      setProjects(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching projects');
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating project:', { name: newProjectName }); // Debug log
      const res = await axios.post<Project>('/api/projects', { name: newProjectName });
      setProjects([...projects, res.data]);
      setNewProjectName('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error creating project');
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Delete project?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Error deleting project');
      }
    }
  };

  const logout = async () => {
    if (authContext) await authContext.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={logout} className="logout-button">Logout</button>
      {error && <p className="dashboard-error">{error}</p>}
      <form onSubmit={createProject} className="project-form">
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          required
        />
        <button type="submit">Create Project</button>
      </form>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project._id} className="project-item">
            <span
              onClick={() => navigate(`/project/${project._id}`)}
              className="project-link"
            >
              {project.name}
            </span>
            <button onClick={() => deleteProject(project._id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;