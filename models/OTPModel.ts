import { Model, models, model } from "mongoose";
import { Document, Schema } from "mongoose";
import { Base_OTPProps } from "@/types/OTP";



interface OTPDocument extends Base_OTPProps, Document {

}

interface Methods {
    // comparePassword(password: string): Promise<boolean>;
}

const otpSchema = new Schema<OTPDocument, {}, Methods>({
    email: {type: String, required: true},
    otp: {type: String, required: true},
    is_used: {type: Boolean, default: false},
},{timestamps: true});


// // hash the password before saving
// otpSchema.pre("save", async function(next) {
//    if(!this.isModified("password")) return next();
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//     next();
//     } catch (error) {
//         throw error;
//     }
// });

// // Compare password method
// otpSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

const OTPModel = models.OTP || model("OTP", otpSchema);
export default OTPModel as Model<OTPDocument, {}, Methods>;