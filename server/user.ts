'use server'
import startDb from "@/lib/db";
import UserModel from "@/models/UserModel";
import { BasicUser, UserRole } from "@/types/User"

interface CreateUserReq extends BasicUser {
    password: string;
}

export const createUser = async ({user}: {user: CreateUserReq}) => {

    await startDb();

    const oldUser = await UserModel.findOne({email: user.email.toLocaleLowerCase()});
    if(oldUser) throw new Error("Email is already in use!");

    const newUser = await UserModel.create({...user, email: user.email.toLocaleLowerCase()});

    return {
        _id: newUser._id,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
        role: newUser.role,
        is_email_verified: newUser.is_email_verified,
        is_phoneno_verified: newUser.is_phoneno_verified
    }
}