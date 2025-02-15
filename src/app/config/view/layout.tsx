import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ViewConfigLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession()

    if (!session) {
        redirect("/auth/signin")
    }

  return (
    <div>
      {children}
    </div>
  );
}