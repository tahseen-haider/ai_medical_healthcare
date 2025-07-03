export default function RecentMembersFallback() {
  const placeholders = Array.from({ length: 5 });

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 animate-pulse">
      <h2 className="font-bold font-ubuntu pb-2">Recent Members:</h2>
      <div className="max-h-[210px] overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-950 sticky top-0 z-10">
            <tr>
              <th className="font-semibold p-2 py-3 pr-4">#</th>
              <th className="font-semibold">Avatar</th>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Role</th>
              <th className="font-semibold">Email</th>
              <th className="font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {placeholders.map((_, i) => (
              <tr key={i} className="p-2">
                <td className="p-2 py-4">
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td>
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </td>
                <td>
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td>
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
                <td>
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-fit mx-auto mt-4">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
