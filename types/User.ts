
export enum UserRole {
    Admin = "admin",
    Contributor = "contributor",
}  

export interface BasicUser {
    email: string; // university email only
    password: string;
    role: UserRole;
    phoneNo: string;
    firstName: string;
    lastName: string;
    userName: string;
    universityId: string; // university id
}

export interface UserData extends BasicUser {
    _id: string;
}
