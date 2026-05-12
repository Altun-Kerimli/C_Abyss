import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) { 
        if (
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { 
            id: "1", 
            name: "Admin", 
            email: credentials.email as string 
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/adminOfTheAbyss/login', 
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // Expires in 1 day
  },
});