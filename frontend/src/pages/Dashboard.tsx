import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../api";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

type Props = {
  token: string;
  onLogout: () => void;
};

export default function Dashboard({ token, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("LOW");

  const loadTasks = async () => {
    const data = await getTasks(token);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async () => {
    await createTask(token, title, priority);
    setTitle("");
    loadTasks();
  };

  const handleUpdate = async (id: string, status: string) => {
    await updateTask(token, id, { status });
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(token, id);
    loadTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <button onClick={onLogout}>Logout</button>

      <h3>Create Task</h3>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      <button onClick={handleCreate}>Create</button>

      <h3>Tasks</h3>

      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: 10 }}>
          <b>{task.title}</b> ({task.status})

          <br />

          {task.status === "TODO" && (
            <button
              onClick={() =>
                handleUpdate(task.id, "IN_PROGRESS")
              }
            >
              Start
            </button>
          )}

          {task.status === "IN_PROGRESS" && (
            <button
              onClick={() =>
                handleUpdate(task.id, "DONE")
              }
            >
              Complete
            </button>
          )}

          {task.status === "DONE" && (
            <button onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}