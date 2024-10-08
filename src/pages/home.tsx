// pages/home.tsx
import { GetServerSideProps } from "next";
import { getSession, signOut } from "next-auth/react";

interface HomeProps {
  user: {
    name: string;
    email: string;
  };
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Welcome, {user.name}!</h1>
      <p className="text-lg">Email: {user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Home;

// Protect the /home page with server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    // Redirect unauthenticated users to the login page
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        name: session.user?.name,
        email: session.user?.email,
      },
    },
  };
};
