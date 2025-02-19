"use client"
import { ConfigDetails } from "@/components/config/config-details";
import Container from "@/components/Container";
import HeroWrapper from "@/components/HeroWrapper";
import { Button } from "@/components/ui/button";
import { createTestConfiguration } from "@/test/createTestConfiguration";
import { useSession } from "next-auth/react";

export default async function ConfigurePage() {
  // const session = await getSession();
  const { data: session, status } = useSession()


  return (
    <>
      <HeroWrapper className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-b border-stone-900">
        <Container className="p-10">
          <h1 className="text-4xl font-bold">Create a new config and deploy in minutes</h1>
        </Container>
      </HeroWrapper>
      {/* CTA to sign in to save configs */}
      {!session ? <div className="bg-red-500 py-2 text-center border-b border-stone-900">
        <h1 className="text-sm text-white">Sign in to save your configurations permanently</h1>
      </div> :
        <div className="bg-red-500 py-2 text-center border-b border-stone-900">
          <Button onClick={() => createTestConfiguration(session?.user?.id)}>Create Test Configuration</Button>
        </div>
      }
      <Container className="border-stone-900 pt-5">
        <ConfigDetails />
      </Container>
    </>
  );
}
