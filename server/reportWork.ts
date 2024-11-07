'use server'

import startDb from "@/lib/db";
import ReportWorkModel from "@/models/ReportWorkModel";
import { ReportWork, ReportWork_BaseType } from "@/types/ReprotWork";


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