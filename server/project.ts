'use server'

import startDb from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import { Project, Project_BaseType } from "@/types/project";


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