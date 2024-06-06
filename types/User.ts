
export enum UserRole {
    Admin = "admin",
    Contributor = "contributor",
}  

export interface BasicUser {
    email: string; // university email only
    phoneNo: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    userName: string;
    universityId: string; // university id
}
    
export interface UserData extends BasicUser {
    _id: string;
    password: string;
    is_email_verified?: boolean;
    is_phoneno_verified?: boolean;
}
