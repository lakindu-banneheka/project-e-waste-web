'use server'
import startDb from "@/lib/db";
import UserModel from "@/models/UserModel";
import { DatabaseError, EmailInUseError } from "@/types/error";
import { BasicUser, User, UserRole } from "@/types/User"

interface CreateUserReq extends BasicUser {
    password: string;
}

interface resUser extends BasicUser {
    _id: string;
    password: string;
}

export const createUser = async ({ user }: { user: CreateUserReq }) => {
    try {
        await startDb();
    
        const oldUser = await UserModel.findOne({ email: user.email.toLocaleLowerCase() });
        if (oldUser) throw new EmailInUseError();
    
        const newUser = await UserModel.create({
            ...user,
            email: user.email.toLocaleLowerCase(),
        });
    
        return {
            _id: newUser._id,
            email: newUser.email,
            phoneNo: newUser.phoneNo,
            role: newUser.role,
            is_email_verified: newUser.is_email_verified,
            is_phoneno_verified: newUser.is_phoneno_verified,
        };
    } catch (error) {
        if (error instanceof EmailInUseError) {
            throw new EmailInUseError("Email is already in use.");
        } else {
            console.error("Unexpected error:", error);
            throw new DatabaseError("An error occurred while creating the user.");
        }
    }
};


export const getAllAdmins_name_id = async () => {
    try {
        await startDb();

        const res: resUser[] = await UserModel.find({ role: 'admin' }).lean();

        const admin_name_id = res.map(item => ({
            _id: item._id.toString(),
            name: `${item.firstName} ${item.lastName}`
        }));

        return admin_name_id;
    } catch (error) {
        console.error("Database error while retrieving admin data:", error);
        throw new DatabaseError("Failed to retrieve admin information.");
    }
};


export const getUserNameById = async ({_id}:{_id: string}) => {
    await startDb();

    const res: (resUser | null) = await UserModel.findById(_id);

    return res?.firstName + " " + res?.lastName;
}

export const getUserDataById = async ({_id}:{_id: string}) => {

    try {        
        await startDb();
    
        const res: (resUser | null) = await UserModel.findById(_id);
    
        return JSON.parse(JSON.stringify(res as resUser));
    } catch (error) {
       console.error('Failed to find the User by ID : ', error);
    }
}

interface res_basicUser extends BasicUser {
    _id: string;
}

export const getAllUsers = async (): Promise<User[] | undefined> => {
    
    try {
        await startDb();
        const res: res_basicUser[] = await UserModel.find({}).lean();
        if(!res){
            throw new Error('Failed to find Projects.');
        }
        const projects = res.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));

        return projects as res_basicUser[];

    } catch (error) {
       console.error('Failed to find Projects: ', error);
    }
}

export const updateUserById = async ({user}: {user: User}) => {
    try {
        await startDb();
        const res = await UserModel.findByIdAndUpdate(user._id, { ...user });
        if(!res){
            throw new Error('Failed to update the User.');
        }
        return JSON.stringify(res._id);
        
    } catch (error) {
        console.error('Failed to update the User : ', error);
    }
}