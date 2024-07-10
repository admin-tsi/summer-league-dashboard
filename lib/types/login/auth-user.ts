import { User } from "@/lib/types/login/user";

export type AuthUser = User & {
  accessToken: string;
  refreshToken: string;
};
