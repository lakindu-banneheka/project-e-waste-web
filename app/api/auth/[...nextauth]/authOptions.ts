import startDb from "@/lib/db";
import UserModel from "@/models/UserModel";
import { UserData, UserRole } from "@/types/User";
import { NextAuthOptions, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

interface CustomUser extends User { // next-auth
    role: string;
    is_email_verified: boolean;
    is_phoneno_verified: boolean;
    phoneNo: string;
}

interface ResponseUser extends UserData {
    comparePassword: (password: string) => boolean;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) : Promise<CustomUser | null> {
                const { email, password, role } = credentials as {
                    email: string,
                    password: string,
                    role: UserRole,
                };

                await startDb();

                const user: ResponseUser | null = await UserModel.findOne({ email });
                if (!user) throw new Error("Email or Password mismatch!");

                const passwordMatch = await user.comparePassword(password);
                if (!passwordMatch) throw new Error("Email or Password mismatch!");

                const roleMatch = await user.role === role || user.role === UserRole.Admin;
                if (!roleMatch) throw new Error("Account Type mismatch!");

                return {
                    email: user.email,
                    id: user._id, 
                    role: role,
                    is_email_verified: user.is_email_verified || false,
                    is_phoneno_verified: user.is_phoneno_verified || false,
                    phoneNo: user.phoneNo,
                };
            },
        }),
    ],
    callbacks: {
        jwt(params: any) {
            if (params.user) {
                params.token.id = params.user.id;
                params.token.email = params.user.email;
                params.token.role = params.user.role;
                params.token.is_email_verified = params.user.is_email_verified;
                params.token.is_phoneno_verified = params.user.is_phoneno_verified;
                params.token.phoneNo = params.user.phoneNo;
            }
            return params.token;
        },
        async session({ session, token, user }) {
            if (session.user) {
                (session.user as { _id: string })._id = token.id as string;
                (session.user as { email: string }).email = token.email as string;
                (session.user as { role: string }).role = token.role as string;
                (session.user as { is_email_verified: boolean }).is_email_verified = token.is_email_verified as boolean;
                (session.user as { is_phoneno_verified: boolean }).is_phoneno_verified = token.is_phoneno_verified as boolean;
                (session.user as { phoneNo: string }).phoneNo = token.phoneNo as string;
            }
            return session;
        },
    }
};
