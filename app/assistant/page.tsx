import NewChatSection from "@/app/assistant/components/NewChatSection";
import { getAuthenticateUserIdnRole } from "@/lib/session";

export default async function AssistantPage() {
  const user = await getAuthenticateUserIdnRole();
  return (
    <main className="flex flex-col items-center">
      {/* New Chat Section */}
      <NewChatSection userId={user.userId}/>
    </main>
  );
}
