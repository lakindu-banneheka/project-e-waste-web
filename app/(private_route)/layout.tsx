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
  <div className="flex h-screen w-full min-w-[480px]">
    {/* Sidebar - visible only on medium and larger screens */}
    <div className="hidden md:block lg:fixed lg:inset-y-0 h-full w-[250px] pt-14">
      <SidebarMenu />
    </div>
    
    {/* Main content area */}
    <div className="w-full px-10 py-5 lg:ml-[250px]">
      {children}
    </div>
  </div>
</>

    );
} 