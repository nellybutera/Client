import Sidebar from "../components/Sidebar";

export default function AccountDetails() {
  const user = {
    name: "Nelly Butera",
    dob: "1998-03-15",
    accountNumber: "ACC123456",
    creditScore: "720",
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-6">Account Details</h1>

        <div className="bg-white rounded shadow p-4 sm:p-6 max-w-lg space-y-3 text-sm sm:text-base">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-semibold">{user.dob}</p>
          </div>
          <div>
            <p className="text-gray-500">Account Number</p>
            <p className="font-semibold">{user.accountNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Credit Score</p>
            <p className="font-semibold">{user.creditScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
