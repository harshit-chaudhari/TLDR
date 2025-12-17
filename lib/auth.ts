import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  // No database adapter - using JWT sessions only
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in - populate token from Google profile
      if (account && profile) {
        token.id = profile.sub || account.providerAccountId;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.username = session.username;
        token.profilePicture = session.profilePicture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.username = token.username as string | null;
        session.user.profilePicture = token.profilePicture as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
};
