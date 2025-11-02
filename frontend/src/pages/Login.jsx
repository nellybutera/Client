// src/components/Login.jsx

import { useState, useContext } from "react";
import { Link } from "react-router-dom"; // 💡 Import Link
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (form.email && form.password) {
      try {
        await login(form);
      } catch (err) {
        setError(err.message || "Login failed. Check email or password.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter all fields!");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          User Login
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded text-sm sm:text-base"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded text-sm sm:text-base"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className={`bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 underline hover:text-indigo-800 transition">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}