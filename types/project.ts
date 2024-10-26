export enum Project_Status {
    PENDING = "Pending",
    APPROVED = "Approved",
    ONGOING = "Ongoing",
    COMPLETED = "Completed",
    EVALUATION = "evaluation",
    DISCONTINUED =  "discontinued",
    HOLD = "hold",
    PREPARATION_STAGE = "Preparation Stage",
    RECRUITMENT_PHASE = "Recruitment Phase",
    TEAM_FORMATION_STAGE = "Team Formation Stage",
    STAFFING_STAGE = "Staffing Stage"
}


export interface Project_BaseType {
    name: String;
    startDate: Date;
    endDate: Date;
    status: Project_Status;
    progress: number;
    manager: String;
    members: String[];
    supervisor: String;
    memberCount: number;
    description: String;
}


export interface Project extends Project_BaseType {
    _id: string;
    createdAt: Date,
    updatedAt: Date
}