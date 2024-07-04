import { useSession } from "next-auth/react";
import { MyUserType } from "@/auth";

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user as MyUserType | undefined;
};
