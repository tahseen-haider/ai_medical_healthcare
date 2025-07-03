export default function RecentInquiriesFallback() {
  const placeholders = Array.from({ length: 4 });

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md animate-pulse">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2 pl-2">Recent Messages:</h2>

      {/* Skeleton Messages */}
      <div className="max-h-[210px] overflow-y-auto">
        {placeholders.map((_, index) => (
          <div
            key={index}
            className="w-full border-b-[1px] flex gap-2 justify-between p-2"
          >
            <div className="flex gap-4 w-full">
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-md" />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-3 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>
        ))}
      </div>

      {/* Button Placeholder */}
      <div className="w-fit mx-auto mt-4">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-md" />
      </div>
    </div>
  );
}
