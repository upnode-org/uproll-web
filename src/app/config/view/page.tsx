import { getSession } from "@/lib/auth";
import { getUserConfigurations } from "@/services/server/configuration";
import { ConfigList } from "@/components/config/ConfigList";
import { redirect } from "next/navigation";
export default async function ViewConfigPage() {

    const session = await getSession()

    if (!session) {
        redirect("/auth/signin")
    }

    const configs = await getUserConfigurations(session!.user.id)

    return (<>
        {/* <HeroWrapper className="bg-linear-to-r from-blue-500 to-purple-500 text-white mb-4">
            <Container className="p-10">
                <h1 className="text-4xl font-bold">{configs.length > 0 ? "Your configs" : "Create a config to get started"}</h1>
            </Container>
        </HeroWrapper>
        <Container> */}
            <ConfigList configs={configs} />
        {/* </Container> */}
    </>);
}
