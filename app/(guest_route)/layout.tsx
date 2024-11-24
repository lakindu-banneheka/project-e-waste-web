import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

interface Props {
    children: ReactNode;
}

export default async function GestLayout ({ children }: Props) {
    const session = await getServerSession(authOptions);
    if(session && session.user.is_email_verified && session.user.is_phoneno_verified) redirect("/dashboard");

    return <>{children}</>;
} 