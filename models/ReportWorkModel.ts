// Project Schema
import { ReportWork_BaseType, ReportWork_Status } from "@/types/ReprotWork";
import { Model, models, model } from "mongoose";
import { Document, Schema } from "mongoose";



interface ReportWorkDocument extends ReportWork_BaseType, Document {
    reviewedBy: String;
}

interface Methods {

}

const ReportWorkSchema = new Schema<ReportWorkDocument, {}, Methods>({
    userId: {type: String, required: true},
    projectId: {type: String, required: true},
    dateSubmitted: {type: Date, required: true},
    status: {type: String, enum: ReportWork_Status, default: ReportWork_Status.PENDING},
    description: {type: String, required: true},
    reviewedBy: {type:String,  required: false, default: 'Unknown'},
    work_minutes: {type: Number, default: 0},

},{timestamps: true});

const ReportWorkModel = models.ReportWork || model("ReportWork", ReportWorkSchema);
export default ReportWorkModel as Model<ReportWorkDocument, {}, Methods>;