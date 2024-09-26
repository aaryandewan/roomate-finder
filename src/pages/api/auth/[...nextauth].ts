// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { Session } from "next-auth";

// Extend the Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isProfileComplete: boolean;
      email: string; // Add email property
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await dbConnect();

      // Check if the user already exists in your database
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // If the user does not exist, create a new user document
        const newUser = new User({
          name: user.name,
          email: user.email,
          profilePicture: user.image,
          isProfileComplete: false, // We'll add this field to track profile completion
        });
        await newUser.save();
      }

      return true;
    },
    async session({ session, token, user }) {
      await dbConnect();

      // Fetch the user from the database
      const dbUser = await User.findOne({ email: session.user?.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.isProfileComplete = dbUser.isProfileComplete;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
