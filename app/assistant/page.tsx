import NewChatSection from "@/app/assistant/components/NewChatSection";
import { getAuthenticateUserIdnRole } from "@/lib/dal/session.dal";
import { redirect } from "next/navigation";

export default async function AssistantPage() {
  const user = await getAuthenticateUserIdnRole();
  if (!user?.userId) redirect("/login");

  return (
    <main className="flex flex-col items-center">
      {/* New Chat Section */}
      <NewChatSection userId={user?.userId} />
    </main>
  );
}
