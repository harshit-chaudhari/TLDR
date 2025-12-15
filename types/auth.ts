import { DefaultSession, Session } from 'next-auth';

// Extend NextAuth session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string | null;
      profilePicture?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    username?: string | null;
    profilePicture?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string | null;
    profilePicture?: string | null;
  }
}

export interface AuthContextType {
  user: Session['user'] | null;
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}
