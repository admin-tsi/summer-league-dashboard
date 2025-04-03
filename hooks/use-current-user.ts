import { useSession } from "next-auth/react";
import { AuthUser } from "@/lib/types/login/auth-user";

type CurrentUserReturn =
  | {
      user: AuthUser | undefined;
      updateUser: (userData: Partial<AuthUser>) => Promise<void>;
    }
  | undefined;

export const useCurrentUser = (): CurrentUserReturn => {
  const { data: session, status, update } = useSession();

  if (status === "loading") {
    return undefined;
  }

  const updateUser = async (userData: Partial<AuthUser>) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        ...userData,
      },
    });
  };

  return {
    user: session?.user as AuthUser | undefined,
    updateUser,
  };
};
