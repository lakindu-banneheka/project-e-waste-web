import { Model, models, model } from "mongoose";
import { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { UserRole } from "@/types/User";



interface UserDocument extends Document {
    email: string; // university email only
    phoneNo: string;
    is_email_verified: boolean;
    is_phoneno_verified: boolean; 
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    userName: string;
    universityId: string; // university id
}

interface Methods {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>({
    email: {type: String, required: true, unique: true},
    phoneNo: {type: String, required: true},
    is_email_verified: {type: Boolean, default: false},
    is_phoneno_verified: {type: Boolean, default: false},
    password: {type: String, required: true},
    role: {type: String, enum: UserRole, default: UserRole.Contributor},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true},
    universityId: {type: String, required: true},
});


// hash the password before saving
userSchema.pre("save", async function(next) {
   if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (error) {
        throw error;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const UserModel = models.User || model("User", userSchema);
export default UserModel as Model<UserDocument, {}, Methods>;