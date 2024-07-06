'use client'
import { Header } from "@/components/nav/header";
import { SidebarMenu } from "@/components/nav/sidebar";
// import { useSession } from "next-auth/react";

export default function Home() {

  // const { data, status } = useSession();
  // console.log(data?.user);
  return (
    <>
      <Header />
      <div className="">
        test
      </div>
    </>
  );
}
