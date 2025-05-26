"use client";

import { ArrowUpFromLine, FilePenLine, Menu, Search } from "lucide-react";
import ReportUploader from "./ReportUploader";

export default function ChatComponent() {
  return (
    <section className="w-full max-w-[1920px] h-[calc(100vh-64px)] min-h-52 flex">
      {/* Sidebar */}
      <div className="lg:w-1/4 border-r-2">
        {/* Menu buttons */}
        <div className="px-6 flex justify-between h-10 items-center border-b-2">
          <Menu />
          <div className="flex gap-4">
            <Search />
            <FilePenLine />
          </div>
        </div>
        {/* Chats List */}
        <div className="flex flex-col pl-6 py-2 pr-2 gap-2 h-[calc(100vh-104px)] overflow-auto">
          <h4>Today</h4>
          <div className="h-10 w-full border-2 bg-light-2 dark:bg-dark-2 text-black dark:text-white border-black dark:border-white rounded-lg flex items-center p-3 font-bold font-ubuntu ">
            Chat # 2: 5/26/2025
          </div>
          <div className="h-10 w-full border-[1px] border-gray-500 text-gray-500 rounded-lg flex items-center text-base p-3 ">
            Chat # 1: 5/26/2025
          </div>
        </div>
      </div>
      {/* Chat */}
      <div className="lg:w-3/4 flex flex-col items-center">
        {/* Messages Section */}
        <section className=""></section>
        {/* Input Box */}
        <div className="fixed w-3/4 bottom-0 h-32 bg-light-1 dark:bg-dark-4">
          <div className="border-[1px] border-gray-500 w-2/3 mx-auto h-28 rounded-2xl">
            <form action="">
              <textarea
                name="userPrompt"
                className="w-full resize-none focus:outline-none p-2 font-roboto leading-[22px] -tracking-tight"
                placeholder="Ask anything"
                rows={2}
                required
              />
              {/* Buttons */}
              <div className="w-full flex gap-5 justify-end p-2">
                {/* Report Uploader */}
                <ReportUploader/>
                {/* Prompt Sender */}
                <button type="submit" aria-label="Send message" className="bg-light-4 text-white p-2 rounded-full relative -top-5 shadow-light dark:shadow-dark">
                  <ArrowUpFromLine size={28}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// const { messages, input, handleInputChange, handleSubmit } = useChat();

// <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
//   <Badge
//     variant={"outline"}
//     className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
//   >
//     {reportData ? "✓ Report Added" : "No Report Added"}
//   </Badge>
//   <div className="flex-1"></div>
//   {/* <Messages messages={messages} /> */}

//   <form
//     onSubmit={(event) => {
//       event.preventDefault();
//       console.log('Submitted')
//     }}
//     className="relative overflow-hidden rounded-lg border bg-background"
//   >
//     <Textarea
//       placeholder="Type your query here..."
//       className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
//     />
//     <div className="flex items-center p-3">
//       <Button className="ml-auto" size="sm" type="submit">
//         <CornerDownLeft className="size-3.5" />
//       </Button>
//     </div>
//   </form>
// </div>
