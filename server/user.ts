'use server'
import startDb from "@/lib/db";
import UserModel from "@/models/UserModel";
import { BasicUser, UserRole } from "@/types/User"
import { NextResponse } from "next/server";

interface CreateUserReq extends BasicUser {}
interface NewUserResponse {
    _id: string;
    email:  string;
    role: UserRole;
}

type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>;

export const createUser = async ({user}: {user: CreateUserReq}) => {

    // await startDb();

    // const oldUser = await UserModel.findOne({email: user.email});
    // if(oldUser){
    //     return NextResponse.json(
    //         {error: "Email is already in use!"},
    //         {status: 422}
    //     );   
    // }

    console.log(user);
    // const newUser = await UserModel.create({...user});
    const newUser = {
        _id: '123',
        email: user.email,
        role: user.role
    }

    return {
        // user: {
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        // },
    }
}