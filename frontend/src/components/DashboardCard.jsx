export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-4 shadow rounded text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
