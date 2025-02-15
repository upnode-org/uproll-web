// export default function ViewConfigDetailsPage() {
//   return <div>View Config</div>;
// }


import { getSession } from "@/lib/auth";
import { getConfigurationDetail } from "@/services/configurationService";
import { redirect } from "next/navigation";

export default async function ViewConfigDetailsPage({ params }: { params: { id: string } }) {

    const session = await getSession()

    const getConfigs = await getConfigurationDetail(session!.user.id, params.id)

    if (!getConfigs) {
        redirect("/config/view")
    }

    return (
    <div>
        <h1>View Config</h1>
        <div>
            <h2>{getConfigs.name}</h2>
        </div>
    </div>
    );
}
