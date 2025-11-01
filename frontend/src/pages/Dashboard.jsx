import { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 🧠 Local transactions (replace later with data from backend)
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Deposit", amount: 200, status: "Completed", date: "2025-10-25" },
    { id: 2, type: "Credit", amount: 500, status: "Pending", date: "2025-10-27" },
  ]);

  // Form data
  const [depositForm, setDepositForm] = useState({ amount: "", description: "" });
  const [creditForm, setCreditForm] = useState({ amount: "", reason: "", duration: "" });

  // 🧩 Reusable function for adding a transaction (easy to replace with backend)
  const addTransaction = (type, data) => {
    const newTransaction = {
      id: transactions.length + 1,
      type,
      amount: data.amount,
      status: type === "Deposit" ? "Completed" : "Pending",
      date: new Date().toISOString().slice(0, 10),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Later replace this block with a POST request
    // await fetch(`/api/${type.toLowerCase()}`, { method: "POST", body: JSON.stringify(data) })

    setSuccessMsg(
      type === "Deposit"
        ? "Deposit submitted successfully!"
        : "Credit request submitted successfully!"
    );
  };

  // Submit handlers
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositForm.amount || !depositForm.description) return alert("Fill all fields");
    addTransaction("Deposit", depositForm);
    setDepositForm({ amount: "", description: "" });
    setShowDeposit(false);
  };

  const handleCreditSubmit = (e) => {
    e.preventDefault();
    if (!creditForm.amount || !creditForm.reason || !creditForm.duration)
      return alert("Fill all fields");
    addTransaction("Credit", creditForm);
    setCreditForm({ amount: "", reason: "", duration: "" });
    setShowCredit(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowDeposit(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Deposit Money
          </button>
          <button
            onClick={() => setShowCredit(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Request Credit
          </button>
        </div>

        {/* Success Message */}
        {successMsg && (
          <p className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</p>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Savings"
            value={`$${transactions
              .filter((t) => t.type === "Deposit")
              .reduce((acc, t) => acc + Number(t.amount), 0)
              .toLocaleString()}`}
          />
          <StatCard
            title="Active Loans"
            value={transactions.filter((t) => t.type === "Credit" && t.status === "Approved").length}
          />
          <StatCard
            title="Pending Requests"
            value={transactions.filter((t) => t.status === "Pending").length}
          />
        </div>

        {/* Transaction History */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{t.id}</td>
                  <td className="py-2 px-4">{t.type}</td>
                  <td className="py-2 px-4">${t.amount}</td>
                  <td className="py-2 px-4">{t.status}</td>
                  <td className="py-2 px-4">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== Deposit Modal ===================== */}
        {showDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Deposit Money</h2>
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) =>
                      setDepositForm({ ...depositForm, amount: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    value={depositForm.description}
                    onChange={(e) =>
                      setDepositForm({ ...depositForm, description: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1 h-24"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeposit(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================== Credit Modal ===================== */}
        {showCredit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Request Credit / Loan</h2>
              <form onSubmit={handleCreditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={creditForm.amount}
                    onChange={(e) =>
                      setCreditForm({ ...creditForm, amount: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Reason</label>
                  <textarea
                    value={creditForm.reason}
                    onChange={(e) =>
                      setCreditForm({ ...creditForm, reason: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1 h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Repayment Duration (months)
                  </label>
                  <input
                    type="number"
                    value={creditForm.duration}
                    onChange={(e) =>
                      setCreditForm({ ...creditForm, duration: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCredit(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
