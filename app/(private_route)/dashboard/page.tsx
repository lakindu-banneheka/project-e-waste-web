'use client'
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Overview } from "@/components/dashboard/overview"
import { OverviewAdmin } from "@/components/dashboard/overview-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjectSummaryByUserId, getWorkSummaryAnalyticsByUserId, WorkSummaryAnalyticsByUserId } from "@/server/dashboard"
import { getProjectsByUserId } from "@/server/project"
import { getUserDataById } from "@/server/user"
import { UserRole } from "@/types/User"
// import { WeeklyWorkHours, WorkSummary } from "@/types/ReprotWork"
import { useMutation } from "@tanstack/react-query"
import { FileClock, Target } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
// import { Metadata } from "next"
// import Image from "next/image"


// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// }

export default function DashboardPage() {
    const session = useSession();
    const user_id = session.data?.user._id || ""; // get the user name 
    const user_role = session.data?.user.role || "";

    const _getUserById = useMutation({
        mutationFn: getUserDataById,
    });
    const  { mutate: server_getUserById } = _getUserById;

    useEffect(() => {
        server_getUserById({ _id: user_id });
    }, [user_id]);
    const userData = _getUserById.data;

    // work Details
    const _getWorkSummaryAnalyticsByUserId = useMutation({
        mutationFn: getWorkSummaryAnalyticsByUserId, // fetch project details
    });
    const  { mutate: server_getWorkSummaryAnalyticsByUserId } = _getWorkSummaryAnalyticsByUserId;

    useEffect(() => {
        if(user_id){
            server_getWorkSummaryAnalyticsByUserId({ user_id });
        }
    }, [user_id]);
    const WorkSummaryAnalytics = _getWorkSummaryAnalyticsByUserId.data;

    // project Details
    const _getProjectSummaryByUserId = useMutation({
        mutationFn: getProjectSummaryByUserId, // fetch project details
    });
    const  { mutate: server_getProjectSummaryByUserId } = _getProjectSummaryByUserId;

    useEffect(() => {
        if(user_id){
            server_getProjectSummaryByUserId({ user_id });
        }
    }, [user_id]);
    const projectSummary = _getProjectSummaryByUserId.data;

    return (
        <>
            <div className=" flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight pb-5">Hi, {userData?.firstName}!</h2>
                </div>
                    <div className="w-full">
                        { user_role === UserRole.Contributor
                            ?<Overview
                                data={WorkSummaryAnalytics||[]}
                                projectSummary={projectSummary}
                                key={''}
                            />
                            : user_role === UserRole.Admin && <OverviewAdmin
                                data={WorkSummaryAnalytics||[]}
                                projectSummary={projectSummary}
                                key={''}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}