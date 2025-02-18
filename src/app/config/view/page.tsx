
import HeroWrapper from "@/components/HeroWrapper";
import { getSession } from "@/lib/auth";
import { getUserConfigurations } from "@/services/server/configuration";
import { ConfigList } from "@/components/config/config-list";
import Container from "@/components/Container";

export default async function ViewConfigPage() {

    const session = await getSession()

    const configs = await getUserConfigurations(session!.user.id)

    // const mockConfigs = [
    //     {
    //         id: "config-1",
    //         name: "Default Config",
    //         userId: "user-001",
    //         globalLogLevel: "info", // Adjust based on your $Enums.LogLevel
    //         globalNodeSelectors: { region: "us-west", environment: "production" },
    //         persistent: true,
    //         createdAt: new Date("2025-01-01T00:00:00Z"),
    //         updatedAt: new Date("2025-01-02T00:00:00Z"),
    //         expiresAt: null,
    //     },
    //     {
    //         id: "config-2",
    //         name: "Staging Config",
    //         userId: "user-002",
    //         globalLogLevel: "warn",
    //         globalNodeSelectors: { region: "us-east", environment: "staging" },
    //         persistent: false,
    //         createdAt: new Date("2025-02-01T12:00:00Z"),
    //         updatedAt: new Date("2025-02-03T12:00:00Z"),
    //         expiresAt: new Date("2025-06-01T12:00:00Z"),
    //     },
    //     {
    //         id: "config-3",
    //         name: "Test Config",
    //         userId: null,
    //         globalLogLevel: "error",
    //         globalNodeSelectors: null,
    //         persistent: false,
    //         createdAt: new Date("2025-03-01T08:00:00Z"),
    //         updatedAt: new Date("2025-03-02T08:00:00Z"),
    //         expiresAt: null,
    //     },
    // ] as unknown as ReturnType<typeof getUserConfigurations>;
      
    return (<>
        <HeroWrapper> Create a config to get started</HeroWrapper>
        <Container>
            <ConfigList configs={configs} />
        </Container>
    </>);
}
