// export default function ViewConfigDetailsPage() {
//   return <div>View Config</div>;
// }


import { getSession } from "@/lib/auth";
import { getConfigurationDetail } from "@/services/configurationService";
import { redirect } from "next/navigation";

export default async function ViewConfigDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const session = await getSession()

    const getConfigs = await getConfigurationDetail(session!.user.id, id)

    if (!getConfigs) {
        redirect("/config/view")
    }

    return (
    <div>
        <h1>View Config</h1>
        <div>
            <h2>{getConfigs.name}</h2>
            <pre>{JSON.stringify(getConfigs, null, 2)}</pre>
        </div>
    </div>
    );
}
