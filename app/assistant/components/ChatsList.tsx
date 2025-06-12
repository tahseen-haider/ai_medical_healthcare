import { getChatList } from "@/actions/chat.action";
import ChatList from "./ChatList";

export default async function ChatsList() {
  const chatsList = await getChatList();

  return (
    <div className="flex flex-col gap-2">
      <ChatList chatsList={chatsList}/>
    </div>
  );
}
