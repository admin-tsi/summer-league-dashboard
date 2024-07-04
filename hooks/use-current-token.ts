import { useSession } from "next-auth/react";
import { MyUserType } from "@/auth";

export const useCurrentToken = () => {
  const session = useSession();
  const user = session.data?.user as MyUserType | undefined;

  return user?.accessToken;
};
