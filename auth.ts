import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export type MyUserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isverified: boolean;
  accessToken: string;
  refreshToken: string;
  emailVerified: Date | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isManageTeam: string | null;
};

const api = process.env.NEXT_PUBLIC_BASE_URL;

export const {
  handlers: { POST, GET },
  auth,
  signIn,
} = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;
          const response = await axios.post(`${api}/auth/login`, {
            email,
            password,
          });

          console.log("response", response.data);

          const { user, accessToken, refreshToken } = response.data;

          if (user && accessToken && refreshToken) {
            const formattedUser: MyUserType = {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              isverified: user.isverified,
              accessToken,
              refreshToken,
              emailVerified: user.emailVerified,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              __v: user.__v,
              isManageTeam: user.isManageTeam || null,
            };

            return formattedUser;
          } else {
            return null;
          }
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user as MyUserType;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as MyUserType;
      return session;
    },
  },
});
