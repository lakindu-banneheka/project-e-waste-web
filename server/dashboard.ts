'use server'
import startDb from "@/lib/db";
import ProjectModel from "@/models/ProjectModel";
import ReportWorkModel from "@/models/ReportWorkModel";
import { Project } from "@/types/project";
import { ReportWork, ReportWork_Status } from "@/types/ReprotWork";
import { subMonths, format, eachDayOfInterval } from "date-fns";
import { Res_Project } from "./project";

export interface WorkSummaryAnalyticsByUserId {
  date: string;
  totalApprovedHours: number;
  totalPendingHours: number;
  totalDeclinedHours: number;
  projects: {
    projectName: string;
    approvedHours: number;
    pendingHours: number;
    declinedHours: number;
  }[];
}


export const getWorkSummaryAnalyticsByUserId = async ({
  user_id,
}: {
  user_id: string;
}): Promise<WorkSummaryAnalyticsByUserId[] | undefined> => {
  try {
    // Initialize the database connection
    await startDb();

    // Calculate the start date (3 months ago) and the end date (today)
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);

    // Fetch reports for the user within the last 3 months
    const reports = await ReportWorkModel.find({
      userId: user_id,
      dateSubmitted: { $gte: threeMonthsAgo, $lte: today },
    }).lean();

    // Fetch projects for the user within the last 3 months
    const projects = await ProjectModel.find({
      members: user_id as string
      // $or: [
      //   { members: { $elemMatch: { $eq: user_id } } }, // Check if user_id exists in the members array
      //   { manager: user_id }, // Check if user_id is the manager
      // ],
    }).lean();
    

    if((!reports || reports.length === 0) && (!projects || projects.length === 0)) {
      return generateDefaultWorkSummary(threeMonthsAgo, today);
    }

    // Group and process the data into a map for faster lookup
    const workSummaryMap: Record<string, WorkSummaryAnalyticsByUserId> = reports.reduce(
      (acc, report) => {
        const date = format(new Date(report.dateSubmitted), "yyyy-MM-dd");
    
        if (!acc[date]) {
          acc[date] = {
            date,
            totalApprovedHours: 0,
            totalPendingHours: 0,
            totalDeclinedHours: 0,
            projects: [],
          };
        }

        const hours = report.work_minutes / 60; // Convert minutes to hours
    
        // Update aggregate totals
        if (report.status === ReportWork_Status.APPROVED) {
          acc[date].totalApprovedHours += hours;
        } else if (report.status === ReportWork_Status.PENDING) {
          acc[date].totalPendingHours += hours;
        } else if (report.status === ReportWork_Status.DECLINED) {
          acc[date].totalDeclinedHours += hours;
        }
    
        // Add project-specific details
        const project = projects.find((p) => p._id === report.projectId); // Match project by ID
        if (project) {
          const projectSummary = acc[date].projects.find(
            (p) => p.projectName === project.name
          );
    
          if (!projectSummary) {
            acc[date].projects.push({
              projectName: project.name as string,
              approvedHours: report.status === ReportWork_Status.APPROVED ? hours : 0,
              pendingHours: report.status === ReportWork_Status.PENDING ? hours : 0,
              declinedHours: report.status === ReportWork_Status.DECLINED ? hours : 0,
            });
          } else {
            if (report.status === ReportWork_Status.APPROVED) {
              projectSummary.approvedHours += hours;
            } else if (report.status === ReportWork_Status.PENDING) {
              projectSummary.pendingHours += hours;
            } else if (report.status === ReportWork_Status.DECLINED) {
              projectSummary.declinedHours += hours;
            }
          }
        }
    
        return acc;
      },
      {} as Record<string, WorkSummaryAnalyticsByUserId>
    );
    

    // Generate all dates for the last 3 months
    const allDates = eachDayOfInterval({ start: threeMonthsAgo, end: today });

    // Fill in missing dates with default values
    const fullWorkSummary: WorkSummaryAnalyticsByUserId[] = allDates.map(
      (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return (
          workSummaryMap[formattedDate] || {
            date: formattedDate,
            totalApprovedHours: 0,
            totalPendingHours: 0,
            totalDeclinedHours: 0,
            projects: [],
          }
        );
      }
    );

    return fullWorkSummary;
  } catch (error) {
    console.error(
      `Error fetching work summary for user ID ${user_id}:`,
      error
    );
  }
};

function getProjectName(projectId: string, projects: Project[]): string | undefined {
  const project = projects.find((p) => p._id === projectId);
  return project?.name as string; // Return project name if found
}


// Helper function to generate default work summary for the date range
const generateDefaultWorkSummary = (
  startDate: Date,
  endDate: Date
): WorkSummaryAnalyticsByUserId[] => {
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  return allDates.map((date) => ({
    date: format(date, "yyyy-MM-dd"),
    totalApprovedHours: 0,
    totalPendingHours: 0,
    totalDeclinedHours: 0,
    projects: [],
  }));
};


export interface ProjectList {
  name: string,
  // totalHours: number,
  approved_hours: number,
  pending_hours: number,
  // declined_hours: number
};

export interface ProjectSummaryByUserId {
  totalProjects: number;
  projects: ProjectList[];
}

export const getProjectSummaryByUserId = async ({
  user_id,
}: {
  user_id: string;
}): Promise<ProjectSummaryByUserId | undefined> => {
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

  const reports = await ReportWorkModel.find({
      userId: user_id,
  }).lean<ReportWork[]>();

  const projectList: ProjectList[] = [];

  projects.forEach((project: Project) => {
      projectList.push({
          name: project.name as string,
          approved_hours: calcTotalProjectHours({reports: reports, projectId: project._id, reportWorkStatus: ReportWork_Status.APPROVED}),
          pending_hours: calcTotalProjectHours({reports: reports, projectId: project._id, reportWorkStatus: ReportWork_Status.PENDING}),
      })
  });
  
  const projectSummary: ProjectSummaryByUserId = {
      totalProjects: projects.length??0,
      projects: projectList
  }

  return projectSummary;
  
  } catch (error) {
      console.error("Failed to find the Project by user ID:", error);
      return undefined; // Return undefined or handle the error based on your requirements
  }
};

const calcTotalProjectHours = ({reports, projectId, reportWorkStatus}:{reports: ReportWork[]; projectId: string; reportWorkStatus: ReportWork_Status}) => {
  const totalApprovedHours = reports
      .filter(
          (report) =>
              report.status === reportWorkStatus &&
              report.projectId === projectId
      )
      .reduce((sum, report) => sum + report.work_minutes / 60, 0);
  return totalApprovedHours;
}