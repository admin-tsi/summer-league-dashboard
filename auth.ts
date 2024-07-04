import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export type MyUserType = {
  id: string;
  email: string;
  role: string;
  isverified: boolean;
  accessToken: string;
  expireIn: number;
  emailVerified: Date | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
          const { user, token, expiresIn } = response.data;
          console.log("expirin", response.data);
          if (user && token) {
            user.accessToken = token;
            user.expireIn = expiresIn;
            return user;
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
