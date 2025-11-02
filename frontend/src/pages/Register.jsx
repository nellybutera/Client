// src/components/Register.jsx

import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 💡 Import Link
import { AuthContext } from "../context/AuthContext"; 

export default function Register() {
  const navigate = useNavigate();
  const {user } = useContext(AuthContext);

  const { register } = useContext(AuthContext); 
  const [form, setForm] = useState({ 
    firstName: "", 
    middleName: "", 
    lastName: "", 
    dateOfBirth: "", 
    phoneNumber: "", 
    email: "", 
    password: "", 
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard"), { replace: true}
    }
  }, [user, navigate]);
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(form); 
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <input
          type="text"
          placeholder="First Name"
          className="w-full mb-4 p-2 border rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Middle Name (Optional)"
          className="w-full mb-4 p-2 border rounded"
          value={form.middleName}
          onChange={(e) => setForm({ ...form, middleName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full mb-4 p-2 border rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          className="w-full mb-4 p-2 border rounded"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (+2507...)"
          className="w-full mb-4 p-2 border rounded"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        
        <button 
          type="submit" 
          className={`bg-blue-600 text-white w-full py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 underline hover:text-blue-800 transition">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}