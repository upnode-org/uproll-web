import { RollupConfigForm } from "@/components/config/RollupConfig";
import { getSession } from "@/lib/auth";
import { getConfigurationDetail } from "@/services/server/configuration";
import { redirect } from "next/navigation";
export default async function ViewConfigDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // config id
  const id = (await params).id

  const session = await getSession()

  try {
    // If config has user set, then we can view it only if matches 
    // session user, if not set then any user can view it.
    const response = await getConfigurationDetail(id, session?.user?.id)
    if (!response) {
      if (session?.user?.id) {
        redirect("/config/view")
      } else {
        redirect("/auth/signin")
      }
    }
    return (
      <RollupConfigForm initialValues={response.config} id={id} />
    );
  } catch (error) {
    console.error(error)
    redirect("/auth/signin")
  }
}
