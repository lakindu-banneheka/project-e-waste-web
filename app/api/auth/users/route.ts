// import startDb from "@/lib/db";
// import UserModel from "@/models/UserModel";
// import { NextResponse } from "next/server";

// interface NewUserRequest {
//     mobile: string;
//     email: string;
//     password: string;
// }

// interface NewUserResponse {
//     id: string;
//     email: string;
//     mobile: string;
//     role: string;
// }

// type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>;

// export const POST = async (req: Request): Promise<NewResponse> => {
//     const body = (await req.json()) as NewUserRequest;
    
//     await startDb();

//     const oldUser = await UserModel.findOne({email: body.email});
//     if(oldUser){
//         return NextResponse.json(
//             {error: "Email is already in use!"},
//             {status: 422}
//         );   
//     }

//     console.log(body);
//     const user = await UserModel.create({...body});

//     return NextResponse.json({
//         user: {
//             id: user._id.toString(),
//             email: user.email,
//             role: user.role,
//             mobile: user.mobile
//         },
//     })
// }