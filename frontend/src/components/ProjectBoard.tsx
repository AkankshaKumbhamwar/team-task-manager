import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignee?: User;
  dueDate?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  project: string;
}

const columnsOrder: Task['status'][] = ['To Do', 'In Progress', 'Done'];

const ProjectBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [columns, setColumns] = useState<{ [key: string]: Task[] }>({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    const newColumns: { [key: string]: Task[] } = { 'To Do': [], 'In Progress': [], 'Done': [] };
    tasks.forEach((task) => {
      newColumns[task.status].push(task);
    });
    setColumns(newColumns);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks for project:', id);
      const res = await axios.get<Task[]>(`${apiUrl}/api/tasks/${id}`);
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${apiUrl}/api/projects/users`);
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching users');
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating task:', { title: newTaskTitle, description: newTaskDescription, assignee: newTaskAssignee, dueDate: newTaskDueDate, project: id }); // Debug log
      const res = await axios.post<Task>(`${apiUrl}/api/tasks/`, {
        title: newTaskTitle,
        description: newTaskDescription,
        assignee: newTaskAssignee || undefined,
        dueDate: newTaskDueDate || undefined,
        status: 'To Do',
        project: id,
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssignee('');
      setNewTaskDueDate('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error creating task');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Done') => {
    try {
      console.log('Updating task status:', { taskId, newStatus }); // Debug log
      const res = await axios.put<Task>(`${apiUrl}/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error updating task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (window.confirm('Delete task?')) {
      try {
        await axios.delete(`${apiUrl}/api/tasks/${taskId}`);
        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Error deleting task');
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    updateTaskStatus(draggableId, destination.droppableId as 'To Do' | 'In Progress' | 'Done');
  };

  return (
    <div className="project-board-container">
      <div className="project-board-header ">
        <h2>Project Board</h2>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
      {error && <p className="project-board-error">{error}</p>}
      <form onSubmit={createTask} className="task-form">
        <label htmlFor="task-title" className="task-form-label">Task Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />
        <label htmlFor="task-description" className="task-form-label">Description</label>
        <textarea
          id="task-description"
          placeholder="Task Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        ></textarea>
        <label htmlFor="task-assignee" className="task-form-label">Assignee</label>
        <select
          id="task-assignee"
          value={newTaskAssignee}
          onChange={(e) => setNewTaskAssignee(e.target.value)}
        >
          <option value="">No Assignee</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
        <label htmlFor="task-due-date" className="task-form-label">Due Date</label>
        <input
          id="task-due-date"
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columnsOrder.map((columnId) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div className="kanban-column" {...provided.droppableProps} ref={provided.innerRef}>
                  <h3>{columnId}</h3>
                  {columns[columnId].length === 0 ? (
                    <p className="empty-column">No tasks in this column</p>
                  ) : (
                    columns[columnId].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            {task.description && <p>{task.description}</p>}
                            {task.assignee && (
                              <p>
                                <span className="task-label">Assignee:</span>{' '}
                                {task.assignee.name || task.assignee.email}
                              </p>
                            )}
                            {task.dueDate && (
                              <p>
                                <span className="task-label">Due:</span>{' '}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="delete-task-button"
                            >
                              ✕ Delete
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBoard;