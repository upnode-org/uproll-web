"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function HomePage() {
  const router = useRouter();


  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <>
      <div>
        <h1>You are not signed in</h1>
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
        <br />
        <button onClick={() => router.push("/auth/signin")}>Sign in</button>
        <br />
        <button onClick={() => router.push("/auth/signup")}>Sign up</button>
      </div>
      <Link href="/config">Create Config</Link>
      </>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name || session.user?.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
