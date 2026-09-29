import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function currentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id || null;
}
