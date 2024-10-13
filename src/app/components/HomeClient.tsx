// src/app/components/HomeClient.tsx
"use client";

import { signIn, signOut } from "next-auth/react";

export default function HomeClient({ session }: { session: any }) {
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>You are not signed in</p>
        <button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Welcome, {session.user?.email}!</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
