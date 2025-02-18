import GradientBackground from "@/components/GradientBackground";
import PageSplit from "@/components/PageSplit";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (session) {
        redirect("/config/view");
    }

    return (
        <PageSplit
            backgroundElement={<GradientBackground className="absolute inset-0 h-full w-full hidden md:block" />}
            className="bg-white"
            asideElement={
            <div className="mb-10 w-full h-full flex flex-col justify-center items-center text-white max-w-96 mx-auto" >
                <p className="text-2xl lg:text-4xl w-full">Welcome to Uproll</p>
                <h1 className="text-4xl lg:text-7xl font-bold">Enjoy the ease of deploying configured rollups in one click</h1>
            </div>}
            mainElement={<div className="mb-10 w-full h-full flex flex-col justify-center items-center px-10 max-w-96 mx-auto">
                {children}
            </div>}
        />
    );
}