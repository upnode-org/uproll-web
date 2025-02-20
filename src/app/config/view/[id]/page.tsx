import ConfigDetails from "@/components/config/ConfigDetails";
import Container from "@/components/Container";
import HeroWrapper from "@/components/HeroWrapper";
import { getSession } from "@/lib/auth";
import { getConfigurationDetail } from "@/services/server/configuration";
import { redirect } from "next/navigation";

export default async function ViewConfigDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // config id
    const id = (await params).id

    const session = await getSession()

    const config = await getConfigurationDetail(session!.user.id, id)

    if (!config) {
        redirect("/config/view")
    }

    return (
        <>
        <HeroWrapper className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Container className="p-10">
            <h1 className="text-4xl font-bold">Edit your config and deploy in minutes</h1>
          </Container>
        </HeroWrapper>
        <Container className="border-t">
          <ConfigDetails id={id} initialConfig={config} />
        </Container>
      </>
    );
}
