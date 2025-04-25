import { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";

const AddTodo = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/todos", form);
      socket.emit("todoAdded", res.data);
      toast.success("Task added!");
      setForm({ title: "", description: "", dueDate: "" });
    } catch (err) {
      toast.error("Error adding task");
      console.error("❌ Error adding task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <input
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        type="date"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTodo;