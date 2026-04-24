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

  const handlePayment = async () => {
    const res = await fetch("http://localhost:3000/payments/create-order", {
      method: "POST",
    });

    const data = await res.json();

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      handler: function () {
        alert("Payment Successful");
      },
      modal: {
        ondismiss: function () {
          alert("Payment Failed");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        overflowY: "auto"
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <h2>Dashboard</h2>

        <button onClick={onLogout} style={{ marginBottom: 20 }}>
          Logout
        </button>

        {/* Premium Card */}
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
            textAlign: "center"
          }}
        >
          <h3>Upgrade to Premium</h3>
          <p>Unlock premium features for ₹499</p>

          <button
            onClick={handlePayment}
            style={{
              background: "#6366f1",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Buy Premium
          </button>
        </div>

        <h3>Create Task</h3>

        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: 10, padding: 6 }}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ marginRight: 10, padding: 6 }}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <button onClick={handleCreate}>Create</button>
        </div>

        <h3>Tasks</h3>

        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              marginBottom: 10,
              padding: 12,
              background: "#1e293b",
              borderRadius: "8px"
            }}
          >
            <b>{task.title}</b> ({task.status})
            <br />

            {task.status === "TODO" && (
              <button onClick={() => handleUpdate(task.id, "IN_PROGRESS")}>
                Start
              </button>
            )}

            {task.status === "IN_PROGRESS" && (
              <button onClick={() => handleUpdate(task.id, "DONE")}>
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
    </div>
  );
}