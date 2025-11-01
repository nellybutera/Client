import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-indigo-700 text-white p-4">
        <h2 className="text-lg font-semibold">Hi, {user?.name || "User"}</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 w-64 h-full bg-indigo-700 text-white flex flex-col p-5 transition-transform duration-300 z-20`}
      >
        <h2 className="text-2xl font-bold mb-10 hidden md:block">
          Hi, {user?.name || "User"}
        </h2>
        <Link
          className="mb-4 hover:underline"
          to="/dashboard"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          className="mb-4 hover:underline"
          to="/account"
          onClick={() => setIsOpen(false)}
        >
          Account Details
        </Link>
        <button
          onClick={logout}
          className="mt-auto bg-red-500 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </>
  );
}
