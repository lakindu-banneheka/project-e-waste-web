'use client'
import { VerifyEmailMobileDialog } from "@/components/auth/verify-email-mobile/verify-email-mobile-dialog";
import { Header } from "@/components/nav/header";
import { useSession } from "next-auth/react";

export default function Home() {

  const { data, status } = useSession();
  console.log(data?.user);
  return (
    <>
      <Header />
      {/* <VerifyEmailMobileDialog 
        isOpen={true}
      /> */}
    </>
  );
}
