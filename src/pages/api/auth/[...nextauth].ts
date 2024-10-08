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
      email: string;
    };
  }
}

interface DbUser {
  _id: string;
  isProfileComplete: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      //this runs AFTER next gets the access token and the user profile
      try {
        await dbConnect();

        // Check if the user already exists in your database
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // If the user does not exist, create a new user document
          const newUser = new User({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
            isProfileComplete: false,
          });
          await newUser.save();
        }

        return true;
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Return false if there's an error
      }
    },
    async session({ session, token }) {
      try {
        await dbConnect();

        // Fetch the user from the database
        const dbUser = (await User.findOne({
          email: session.user?.email,
        })) as DbUser;

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.isProfileComplete = dbUser.isProfileComplete;
        }

        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: true, // Enable debug mode to get detailed logs
};

export default NextAuth(authOptions);
