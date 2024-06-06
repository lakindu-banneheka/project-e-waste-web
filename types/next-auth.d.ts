import NextAuth from "next-auth"
import { UserRole } from "./User";

declare module "next-auth" {
  interface Session {
    user: {
        _id: string;
        email: string;
        role: UserRole;
        is_email_verified: boolean;
        is_phoneno_verified: boolean;
        phoneNo: string;
    }
  }
}