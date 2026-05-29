import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:8000/api/tasks";

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      // EDIT TASK
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
          title,
        });

        setEditingId(null);
      }

      // CREATE TASK
      else {
        await axios.post(API, {
          title,
        });
      }

      setTitle("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT TASK
  const editTask = (task) => {
    setTitle(task.title);

    setEditingId(task._id);
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API}/${task._id}`, {
        completed: !task.completed,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Task Manager</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* TASK LIST */}
      <div>
        {tasks.map((task) => (
          <div key={task._id} style={styles.taskCard}>
            <div>
              <h3
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {task.title}
              </h3>
            </div>

            <div style={styles.actions}>
              <button
                onClick={() => toggleComplete(task)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button
                onClick={() => editTask(task)}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "500px",
    margin: "40px auto",
    fontFamily: "Arial",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "10px",
  },

  button: {
    padding: "10px 20px",
  },

  taskCard: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },
};

export default App;