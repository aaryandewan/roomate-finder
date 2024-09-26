// pages/auth/signin.tsx
import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import React from "react";

interface SignInProps {
  providers: Record<string, ClientSafeProvider>;
}

const SignIn: React.FC<SignInProps> = ({ providers }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => signIn(provider.id)}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
