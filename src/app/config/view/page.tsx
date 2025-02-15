
import { getSession } from "@/lib/auth";
import { getUserConfigurations } from "@/services/configurationService";

export default async function ViewConfigPage() {

    const session = await getSession()

    const getConfigs = await getUserConfigurations(session!.user.id)

    return (<div>View Config
        <div>
            {getConfigs.length === 0 ? (
                <div>
                    <h2>No configs found</h2>
                </div>
            ) : (
                getConfigs.map((config) => (
                    <div key={config.id}>
                        <h2>{config.name}</h2>
                    </div>
                ))
            )}
        </div>
    </div>);
  }
  