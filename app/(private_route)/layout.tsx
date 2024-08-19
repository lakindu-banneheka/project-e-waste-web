import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { SidebarMenu } from "@/components/nav/sidebar";
import { Header } from "@/components/nav/header";

interface Props {
    children: ReactNode;
}

export default async function GestLayout ({ children }: Props) {
    const session = await getServerSession(authOptions);
    if(!session) redirect("/auth/login");

    return (
      <>
        <Header />
        <div className="flex h-screen w-full">
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