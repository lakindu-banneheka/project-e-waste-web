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
    reviewedBy: string;
    work_minutes: number;
}


export interface ReportWork extends ReportWork_BaseType {
    _id: string;
    createdAt: Date,
    updatedAt: Date
}