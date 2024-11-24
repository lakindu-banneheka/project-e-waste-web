export enum ReportWork_Status {
    PENDING = "Pending",
    APPROVED = "Approved",
    DECLINED = "Declined",
}


export interface ReportWork_BaseType {
    userId: string;
    projectId: string;
    dateSubmitted: Date;
    description: string;
    status: ReportWork_Status;
    work_minutes: number;
}



export interface ReportWork extends ReportWork_BaseType {
    _id: string;
    reviewedBy: string;
    createdAt: Date,
    updatedAt: Date
}

// // Dashboard
// export interface WeeklyWorkHours { // For the chart
//     week: string; 
//     hours: number
// }

// export interface WorkSummary {
//     totalApprovedHours: number;
//     totalPendingHours: number;
//     totalDeclinedHours: number;
//     weeklyWorkHours: WeeklyWorkHours[]; // For the chart
// }
