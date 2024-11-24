'use server'

import startDb from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import ReportWorkModel from "@/models/ReportWorkModel";
import { Project, Project_BaseType } from "@/types/project";
import { ReportWork, ReportWork_Status } from "@/types/ReprotWork";


export interface CreateProject extends Project_BaseType {};
export interface Res_Project extends Project {};

export const createNewProject = async ({projectData}: {projectData: CreateProject}) => {
    
    try {
        await startDb();
        const newProject = await ProjectModel.create({...projectData});
        if(!newProject){
            throw new Error('Failed to create new Project.');
        }
        return JSON.stringify(newProject._id);
    } catch (error) {
       console.error('Failed to create new Project: ', error);
    }
    
}

export const getAllProjects = async (): Promise<Res_Project[] | undefined> => {
    
    try {
        await startDb();
        const res: Res_Project[] = await ProjectModel.find({}).lean();
        if(!res){
            throw new Error('Failed to find Projects.');
        }
        const projects = res.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));

        return projects as Res_Project[];

    } catch (error) {
       console.error('Failed to find Projects: ', error);
    }
}


export const getProjectById = async ({id}: {id: string}) => {
    
    try {
        await startDb();
        const res: Res_Project | null = await ProjectModel.findById(id).lean();
        if(!res){
            throw new Error('Failed to find the Project by ID.');
        }
        const project = {...res, _id: res._id.toString()}

        return project as Res_Project;

    } catch (error) {
       console.error('Failed to find the Project by ID : ', error);
    }
}

export const getProjectsByUserId = async ({
    user_id,
  }: {
    user_id: string;
  }): Promise<Res_Project[] | undefined> => {
    try {
      await startDb();
  
      if (!user_id) {
        throw new Error("User ID is required.");
      }
  
      // Fetch projects where the user is a member
      const res: Res_Project[] = await ProjectModel.find({
        members: user_id,
      }).lean();
  
      if (!res || res.length === 0) {
        throw new Error("No projects found for the given user ID.");
      }
  
      // Convert _id to string for all projects
      const projects = res.map((project) => ({
        ...project,
        _id: project._id.toString(),
      }));
  
      return projects;

    } catch (error) {
      console.error("Failed to find the Project by user ID:", error);
      return undefined; // Return undefined or handle the error based on your requirements
    }
};

// export interface ProjectSummaryByUserId {
//     totalProjects: number;
//     projects: {
//         name: string,
//         totalHours: number
//     }[];
// }

// export const getProjectSummaryByUserId = async ({
//     user_id,
// }: {
//     user_id: string;
// }): Promise<ProjectSummaryByUserId | undefined> => {
//     try {
//     await startDb();

//     if (!user_id) {
//         throw new Error("User ID is required.");
//     }

//     // Fetch projects where the user is a member
//     const res: Res_Project[] = await ProjectModel.find({
//         members: user_id,
//     }).lean();

//     if (!res || res.length === 0) {
//         throw new Error("No projects found for the given user ID.");
//     }

//     // Convert _id to string for all projects
//     const projects = res.map((project) => ({
//         ...project,
//         _id: project._id.toString(),
//     }));

//     const reports = await ReportWorkModel.find({
//         userId: user_id,
//     }).lean<ReportWork[]>();

//     const projectList = [];

//     projects.forEach((project: Project) => {
//         projectList.push({
//             name: project.name,
//             totalHours: calcTotalProjectHours({reports: reports, projectId: project._id})
//         })
//     })
    
//     const projectSummary: ProjectSummaryByUserId = {
//         totalProjects: projects.length??0,
//         projects: [
//             {
//                 name: '',
//                 totalHours: 0
//             }
//         ]
//     }

//     return projectSummary;
    
//     } catch (error) {
//         console.error("Failed to find the Project by user ID:", error);
//         return undefined; // Return undefined or handle the error based on your requirements
//     }
// };

// const calcTotalProjectHours = ({reports, projectId}:{reports: ReportWork[]; projectId: string;}) => {
//     const totalApprovedHours = reports
//         .filter(
//             (report) =>
//                 report.status === ReportWork_Status.APPROVED &&
//                 report.projectId === projectId
//         )
//         .reduce((sum, report) => sum + report.work_minutes / 60, 0);
//     return totalApprovedHours;
// }

export const updateProjectById = async ({project}: {project: Project}) => {
    
    try {
        await startDb();
        const res = await ProjectModel.findByIdAndUpdate(project._id, { ...project });
        if(!res){
            throw new Error('Failed to update the Project.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
       console.error('Failed to update the Project : ', error);
    }
}


export const deleteProjectById = async ({id}: {id: string}) => {
    try {
        await startDb();
        const res = await ProjectModel.findByIdAndDelete(id);
        if(!res){
            throw new Error('Failed to update the Project.');
        }
        return JSON.stringify(res._id);
    } catch (error) {
       console.error('Failed to update the Project : ', error);
    }
}