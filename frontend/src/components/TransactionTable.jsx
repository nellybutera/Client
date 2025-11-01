export default function TransactionTable({ transactions }) {
  return (
    <table className="min-w-full bg-white shadow rounded">
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
          <tr key={i} className="border-t">
            <td className="py-2 px-4">{t.id}</td>
            <td className="py-2 px-4">{t.type}</td>
            <td className="py-2 px-4">${t.amount}</td>
            <td className="py-2 px-4">{t.status}</td>
            <td className="py-2 px-4">{t.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
