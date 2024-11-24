// Project Schema
import { Model, models, model } from "mongoose";
import { Document, Schema } from "mongoose";
import { Project_BaseType, Project_Status } from "@/types/project";



interface ProjectDocument extends Project_BaseType, Document {
    _id: string;
}

interface Methods {

}

const projectSchema = new Schema<ProjectDocument, {}, Methods>({
    name: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    status: {type: String, enum: Project_Status, default: Project_Status.PENDING},
    progress: {type: Number, default: 0},
    manager: {type: String, required: true},
    members: [{type: String, required: true}],
    supervisor: {type: String, required: true},
    memberCount: {type: Number, required: true},
    description: {type: String, required: true},
},{timestamps: true});

const ProjectModel = models.Project || model("Project", projectSchema);
export default ProjectModel as Model<ProjectDocument, {}, Methods>;