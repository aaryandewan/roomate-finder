import NextAuth from "next-auth";

// Extending the default Session type in NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // <-- Add this line to include 'id'
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
