import ChatComponent from "@/components/chat/Chat";

export default function AssistantPage() {
  
  return (
    <main className="flex flex-col items-center">
      {/* Chat Section */}
      <ChatComponent/>
    </main>
  );
}

// <div className="relative h-screen">
//   <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative top-14">
//     <div className="hidden md:flex flex-col h-[calc(100vh-56px)] overflow-auto sticky top-14">
//       <ReportUploader onReportUpload={onReportUpload} />
//     </div>
//     <div className="lg:col-span-2 p-4">
//       <ChatComponent reportData={reportData}/>
//     </div>
//   </main>
// </div>