import { useSession } from "next-auth/react";
import { AuthUser } from "@/lib/types/login/auth-user";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  console.log(session, "session");

  if (status === "loading") {
    return undefined;
  }

  return session?.user as AuthUser | undefined;
};
