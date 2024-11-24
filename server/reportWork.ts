'use server'

import startDb from "@/lib/db";
import ReportWorkModel from "@/models/ReportWorkModel";
import { ReportWork, ReportWork_BaseType, ReportWork_Status } from "@/types/ReprotWork";


export interface NewReprotWork extends ReportWork_BaseType {
    reviewedBy: string;
};
export interface Res_ReportWork extends ReportWork {};

export const ReportNewWork = async ({ReprotWorkData}: {ReprotWorkData: ReportWork_BaseType}) => {
    
    try {
        await startDb();
        const reportWork_Data: NewReprotWork = {...ReprotWorkData, reviewedBy: ''}
        const newReport = await ReportWorkModel.create({...reportWork_Data});
        if(!newReport){
            throw new Error('Failed to add new Report.');
        }
        return JSON.stringify(newReport._id);
    } catch (error) {
       console.error('Failed to add new Report: ', error);
    }
    
}

export const getAllReports = async (): Promise<Res_ReportWork[] | undefined> => {
    
    try {
        await startDb();
        const res: Res_ReportWork[] = await ReportWorkModel.find({}).lean();
        if(!res){
            throw new Error('Failed to find Reports.');
        }
        const reports = res.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));
        return reports as Res_ReportWork[];

    } catch (error) {
       console.error('Failed to find reports: ', error);
    }
}


export const getReportById = async ({id}: {id: string}) => {
    try {
        await startDb();
        const res: Res_ReportWork | null = await ReportWorkModel.findById(id).lean();
        if(!res){
            throw new Error('Failed to find the Report by ID.');
        }
        const report = {...res, _id: res._id.toString()}

        return report as Res_ReportWork;

    } catch (error) {
       console.error('Failed to find the Report by ID : ', error);
    }
}

export const getReportDetailsByUserId = async ({ user_id }: { user_id: string }): Promise<Res_ReportWork[] | undefined> => {
    try {
        await startDb();

        // Fetch reports for the given user ID
        const res: Res_ReportWork[] = await ReportWorkModel.find({ userId: user_id }).lean();

        if (!res || res.length === 0) {
            throw new Error(`No reports found for user ID: ${user_id}`);
        }

        // Ensure each `_id` is converted to a string
        const reports = res.map(report => ({
            ...report,
            _id: report._id.toString(),
        }));

        return reports;
    } catch (error) {
        console.error('Failed to find the Report by user ID: ', error);
    }
};


export const updateReportById = async ({report}: {report: ReportWork}) => {
    
    try {
        await startDb();
        const res = await ReportWorkModel.findByIdAndUpdate(report._id, { ...report });
        if(!res){
            throw new Error('Failed to update the Report.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
       console.error('Failed to update the Report : ', error);
    }
}


export const deleteReportById = async ({id}: {id: string}) => {
    try {
        await startDb();
        const res = await ReportWorkModel.findByIdAndDelete(id);
        if(!res){
            throw new Error('Failed to update the Report.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
       console.error('Failed to update the Report : ', error);
    }
}

// export const getWorkSummaryByUserId = async ({
//     user_id,
// }: {
//     user_id: string;
// }): Promise<WorkSummary | undefined> => {
//     try {
//         await startDb();

//         // Fetch all reports by user_id
//         const reports: ReportWork[] = await ReportWorkModel.find({ userId: user_id }).lean();

//         if (!reports || reports.length === 0) {
//             throw new Error(`No reports found for user ID: ${user_id}`);
//         }

//         // Filter reports by status and calculate total hours
//         const totalApprovedHours = reports
//             .filter((report) => report.status === ReportWork_Status.APPROVED)
//             .reduce((sum, report) => sum + report.work_minutes / 60, 0); // Convert minutes to hours

//         const totalPendingHours = reports
//             .filter((report) => report.status === ReportWork_Status.PENDING)
//             .reduce((sum, report) => sum + report.work_minutes / 60, 0);

//         const totalDeclinedHours = reports
//             .filter((report) => report.status === ReportWork_Status.DECLINED)
//             .reduce((sum, report) => sum + report.work_minutes / 60, 0);

//         // Calculate weekly hours for the last 15 weeks
//         const now = new Date();
//         const fifteenWeeksAgo = new Date();
//         fifteenWeeksAgo.setDate(now.getDate() - 7 * 15);

//         const weeklyWorkHours: { week: string; hours: number }[] = [];

//         for (let i = 0; i < 15; i++) {
//             const startOfWeek = new Date();
//             startOfWeek.setDate(now.getDate() - i * 7);
//             startOfWeek.setHours(0, 0, 0, 0);

//             const endOfWeek = new Date(startOfWeek);
//             endOfWeek.setDate(startOfWeek.getDate() + 6);
//             endOfWeek.setHours(23, 59, 59, 999);

//             const weeklyHours = reports
//                 .filter(
//                     (report) =>
//                         report.status === ReportWork_Status.APPROVED &&
//                         report.dateSubmitted >= startOfWeek &&
//                         report.dateSubmitted <= endOfWeek
//                 )
//                 .reduce((sum, report) => sum + report.work_minutes / 60, 0); // Convert minutes to hours

//             weeklyWorkHours.push({
//                 week: startOfWeek.toISOString().split("T")[0], // Format as YYYY-MM-DD
//                 hours: weeklyHours,
//             });
//         }

//         return {
//             totalApprovedHours,
//             totalPendingHours,
//             totalDeclinedHours,
//             weeklyWorkHours: weeklyWorkHours.reverse(), // Reverse to show oldest week first
//         };
//     } catch (error) {
//         console.error("Failed to fetch work summary: ", error);
//     }
// };