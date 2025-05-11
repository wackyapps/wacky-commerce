import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
          if (user && user.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
          return null;
        } catch (err: any) {
          console.error("Authorize error:", err.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
    async session({ session, token }: { session: any; token: any }) {
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth, { NextAuthOptions } from "next-auth";
// import { Account, User as AuthUser } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import prisma from "@/utils/db";
// import { nanoid } from "nanoid";

// const authOptions: NextAuthOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any) {
//         try {
//           const user = await prisma.user.findFirst({
//             where: {
//               email: credentials.email,
//             },
//           });
//           if (user) {
//             const isPasswordCorrect = await bcrypt.compare(
//               credentials.password,
//               user.password!
//             );
//             if (isPasswordCorrect) {
//               return user;
//             }
//           }
//           return null; // Return null if authentication fails
//         } catch (err: any) {
//           throw new Error(err);
//         }
//       },
//     }),
//     // GithubProvider({
//     //   clientId: process.env.GITHUB_ID ?? "",
//     //   clientSecret: process.env.GITHUB_SECRET ?? "",
//     // }),
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_ID ?? "",
//     //   clientSecret: process.env.GOOGLE_SECRET ?? "",
//     // }),
//     // ...add more providers here if you want. You can find them on nextauth website.
//   ],
//   callbacks: {
//     async signIn({
//       user,
//       account,
//     }: {
//       user: AuthUser;
//       account: Account | null;
//     }) {
//       if (account?.provider === "credentials") {
//         return true;
//       }
//       // if (account?.provider == "github") {
//       //
//       //   try {
//       //     const existingUser = await prisma.user.findFirst({ where: {email: user.email!} });
//       //     if (!existingUser) {
//       //
//       //       await prisma.user.create({
//       //           data: {
//       //             id: nanoid() + "",
//       //             email: user.email!
//       //           },
//       //         });
//       //       return true;
//       //     }
//       //     return true;
//       //   } catch (err) {
//       //     console.log("Error saving user", err);
//       //     return false;
//       //   }
//       // }
//       //
//       // if (account?.provider == "google") {
//       //
//       //   try {
//       //     const existingUser = await prisma.user.findFirst({where: { email: user.email! }});
//       //     if (!existingUser) {
//       //       await prisma.user.create({
//       //           data: {
//       //             id: nanoid() + "",
//       //             email: user.email!
//       //           },
//       //         });
//       //
//       //       return true;
//       //     }
//       //     return true;
//       //   } catch (err) {
//       //     console.log("Error saving user", err);
//       //     return false;
//       //   }
//       // }
//       return true; // Default to true for other providers
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
