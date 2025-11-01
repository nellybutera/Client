import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ name: "Nelly Butera", email });
    } else {
      alert("Please enter all fields!");
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
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded text-sm sm:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
