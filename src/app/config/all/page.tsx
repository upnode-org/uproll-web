import prisma from "@/lib/prisma";
import { ConfigList } from "@/components/config/ConfigList";
import { RollupConfigForm } from "@/components/config/OpDetails";
import HeroWrapper from "@/components/HeroWrapper";
// async function getUserConfigurations() {
//     try {
//         const configurations = await prisma.configuration.findMany();
//         return configurations;
//     } catch (error) {
//         console.error("Error fetching configurations for user:", error);
//         throw error;
//     }
// }

export default function ConfigAllPage() {

    // const configurations = await getUserConfigurations();

    return (
        <div>
            <HeroWrapper>
                <RollupConfigForm />
            </HeroWrapper>
            {/* <h1>Config All List</h1>
            <ConfigList configs={configurations} />
            <h1>Config All List</h1>
            {configurations.map((config) => (
                <div key={config.id} className="bg-white p-4 rounded-md border border-gray-200" >
                    <h2>Name: {config.name}</h2>
                    <p>Description: {config.description}</p>
                    <p>Expires At: {config.expiresAt?.toISOString()}</p>
                    <p>Created At: {config.createdAt.toISOString()}</p>
                    <p>Updated At: {config.updatedAt.toISOString()}</p>
                    <p>User ID: {config.userId}</p>
                    <code>{JSON.stringify(config.config, null, 2)}</code>
                </div>
            ))} */}
        </div>
    );
}
