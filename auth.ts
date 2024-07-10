import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthUser } from "@/lib/types/login/auth-user";
import Credentials from "next-auth/providers/credentials";

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

          const { user, accessToken, refreshToken } = response.data;

          if (user && accessToken && refreshToken) {
            const formattedUser: AuthUser = {
              // @ts-ignore
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              accessToken,
              refreshToken,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              __v: user.__v,
              specialization: user.specialization,
              countryCode: user.countryCode,
              phoneNumber: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              address: user.address,
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
        token.user = user as AuthUser;
      }
      console.log(token);
      return token;
    },
    session: async ({ session, token }) => {
      if (token.user) {
        // @ts-ignore
        session.user = token.user as AuthUser;
      }
      return session;
    },
  },
});
