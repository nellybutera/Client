import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const transactions = [
  { id: 1, type: "Deposit", amount: 200, status: "Completed", date: "2025-10-25" },
  { id: 2, type: "Credit", amount: 500, status: "Pending", date: "2025-10-27" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Savings" value="$3,200" />
          <StatCard title="Active Loans" value="2" />
          <StatCard title="Pending Requests" value="1" />
        </div>

        {/* Transaction History */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded text-sm md:text-base">
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
      </div>
    </div>
  );
}
