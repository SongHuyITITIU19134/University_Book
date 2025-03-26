import { auth } from "@/auth";
import Navbar from "@/components/admin/navbar";
import Header from "@/components/admin/Header";

import "@/styles/admin.css";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();
    if (!session?.user?.id) redirect("/sign-in")

    return (
        <main className="flex min-h-screen w-full flex-row">
            <Navbar session={session} />
            <div className="admin-container">
              <Header session={session}/>
                {children}
            </div>
        </main>
    )
}

export default layout