import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/types";
import MyAxios from "@/components/MyAxios";

const SignIn = async (email: string, password: string) => {
  try {
    const { data } = await MyAxios.post("user-auth/login", {
      email,
      password,
    });
    if (data.user) {
      return data;
    } else if (data?.message) {
      return { error: data?.message };
    } else {
      throw new Error("Error signing in");
    }
  } catch {
    // console.log(error)
    // "Wrong email or password"
    return { error: "البريد الاكتروني او كلمة المرور غير صحيحة" }; // Return error in a structured format
  }
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (email && password) {
          const data = await SignIn(email, password);
          const user: User = data?.user;
          const token: string = data?.token;
          if (data.token) {
            return { ...user, token };
          } else if (data.message) {
            throw new Error(data?.message);
          } else {
            throw new Error(data?.error ?? "Error signing in");
          }
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      return token;
    },
    session({ session, token }) {
      if (token?.email && session.user) {
        session.user = { ...token } as User;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth",
    error: "/auth/login",
    signOut: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };