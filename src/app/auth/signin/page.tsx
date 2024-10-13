// src/app/auth/signin/page.tsx

"use client";
import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<any>();

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {providers &&
        Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
}
