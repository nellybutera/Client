export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center flex flex-col justify-center">
      <h3 className="text-gray-500 text-sm sm:text-base">{title}</h3>
      <p className="text-xl sm:text-2xl font-semibold">{value}</p>
    </div>
  );
}
