import { useSession } from "next-auth/react";
import { AuthUser } from "@/lib/types/login/auth-user";

export const useCurrentToken = (): string | undefined => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return undefined;
  }

  if (status === "unauthenticated") {
    return undefined;
  }

  const user = session?.user as AuthUser | undefined;
  return user?.accessToken;
};
