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

    // If config has user set, then we can view it only if matches 
    // session user, if not set then any user can view it.
    const {config, name, description} = await getConfigurationDetail(session!.user.id, id)
    if (!config) {
      if(session!.user.id) {
        redirect("/config/view")
      } else {
        redirect("/auth/signin")
      }
    }

    return (
        <>
        <HeroWrapper className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Container className="p-10">
            <h1 className="text-4xl font-bold">Edit your config and deploy in minutes</h1>
          </Container>
        </HeroWrapper>
        <Container className="border-t">
          <ConfigDetails id={id} initialConfig={config} initialName={name} initialDescription={description} />
        </Container>
      </>
    );
}
