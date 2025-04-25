import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { socket } from "../socket";
import EditModal from "./EditModal";
import { FaTrash, FaEdit, FaCheck, FaUndo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task.");
      console.error(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const updated = { ...todo, completed: !todo.completed };
      await axiosInstance.put(`/todos/${todo._id}`, updated);
      toast.success(todo.completed ? "Marked as incomplete." : "Marked as done!");
    } catch (err) {
      toast.error("Failed to update task.");
      console.error(err);
    }
  };

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setIsEditOpen(true);
  };

  useEffect(() => {
    fetchTodos();

    socket.on("connect", () => {
      console.log("✅ connected to socket");
    });

    socket.on("todoAdded", (newTodo) => {
      console.log("📥 new todo from socket:", newTodo);
      setTodos((prev) => [newTodo, ...prev]);
    });

    socket.on("todoDeleted", (deletedId) => {
      setTodos((prev) => prev.filter((t) => t._id !== deletedId));
    });

    socket.on("todoUpdated", (updatedTodo) => {
      setTodos((prev) =>
        prev.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
      );
    });

    return () => {
      socket.off("todoAdded");
      socket.off("todoDeleted");
      socket.off("todoUpdated");
    };
  }, []);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "completed") return todo.completed && matchesSearch;
    if (filter === "incomplete") return !todo.completed && matchesSearch;
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2 bg-white dark:bg-gray-700 dark:text-white"
        />

        <div className="flex gap-2">
          {["all", "completed", "incomplete"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded border text-sm transition-colors duration-200 ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.li
              key={todo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center ${
                todo.completed
                  ? "bg-green-100 dark:bg-green-900 line-through text-gray-500 dark:text-gray-300"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                {todo.description && <p className="text-sm">{todo.description}</p>}
                {todo.dueDate && (
                  <p className="text-xs text-gray-400 dark:text-gray-300">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`p-2 rounded-full text-white hover:scale-110 transition-transform ${
                    todo.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                  title={todo.completed ? "Undo" : "Mark as done"}
                >
                  {todo.completed ? <FaUndo /> : <FaCheck />}
                </button>

                <button
                  onClick={() => openEditModal(todo)}
                  className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-transform"
                  title="Edit"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(todo._id)}
                  className="p-2 rounded-full text-white bg-red-500 hover:bg-red-600 hover:scale-110 transition-transform"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        todo={selectedTodo}
        onUpdated={fetchTodos}
      />
    </div>
  );
};

export default TodoList;
