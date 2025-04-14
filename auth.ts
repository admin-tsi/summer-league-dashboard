import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";
import { JWT } from "next-auth/jwt";

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

// Étendre le type JWT pour inclure notre champ user
declare module "next-auth/jwt" {
  interface JWT {
    user?: MyUserType;
  }
}

// Étendre le type Session pour typer correctement user
declare module "next-auth" {
  interface Session {
    user: MyUserType;
  }
}

const api = process.env.NEXT_PUBLIC_BASE_URL;

export const {
  handlers: { POST, GET },
  auth,
  signIn,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${api}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          const { user, accessToken, refreshToken } = response.data;
          if (user && accessToken && refreshToken) {
            return {
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
            } as MyUserType;
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user as MyUserType;
      }

      if (trigger === "update" && session) {
        if (!token.user) {
          token.user = {} as MyUserType;
        }
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      if (token.user) {
        try {
          const newAccessToken = await verifyTokenExpiration(
            token.user.accessToken,
            token.user.refreshToken
          );
          if (newAccessToken) {
            token.user.accessToken = newAccessToken;
          } else {
            console.error("Failed to refresh access token");
            delete token.user;
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
          delete token.user;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});
