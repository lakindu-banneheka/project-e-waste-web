'use client'
import { Header } from "@/components/nav/header";
import { SidebarMenu } from "@/components/nav/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
// import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  if(session.status == "authenticated") redirect("/dashboard");
  if(session.status == "unauthenticated") redirect("/auth/login");

  return (
    <>
      <Header />
      <div className="">
        
      </div>
    </>
  );
}
