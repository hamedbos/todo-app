import { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 transition-colors duration-300">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">My To-Do List</h1>

            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              {user && (
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1 rounded border bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <Routes>
            {!user ? (
              <>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <>
                      <AddTodo />
                      <TodoList />
                    </>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;