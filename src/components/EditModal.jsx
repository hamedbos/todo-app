import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const EditModal = ({ isOpen, onClose, todo, onUpdated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title,
        description: todo.description || "",
        dueDate: todo.dueDate ? todo.dueDate.split("T")[0] : ""
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/todos/${todo._id}`, {
        ...todo,
        ...form
      });
      toast.success("Task updated!");
      onUpdated(); // optional
      onClose();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md dark:bg-gray-800 dark:text-white">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;