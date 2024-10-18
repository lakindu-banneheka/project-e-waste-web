import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { SidebarMenu } from "@/components/nav/sidebar";
import { Header } from "@/components/nav/header";
import { UserRole } from "@/types/User";

interface Props {
    children: ReactNode;
}

export default async function GestLayout ({ children }: Props) {
    const session = await getServerSession(authOptions);
    if(!session) redirect("/auth/login");
    if(session.user.role != UserRole.Admin) redirect("/auth/login");


    return (
      <>
        <Header />
        <div className="flex h-screen w-full min-w-[480px]">
          <div className="hidden md:block h-full">
              <SidebarMenu />
          </div>
          <div className="w-full px-10 py-5" >
            {children}
          </div>
        </div>
        
      </>
    );
} 