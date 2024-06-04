import startDb from "@/lib/db";
import UserModel from "@/models/UserModel";
import { UserData } from "@/types/User";
import { NextAuthOptions, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

interface CustomUser extends User { // next-auth
    role: string;
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
                const { email, password } = credentials as {
                    email: string,
                    password: string
                };

                await startDb();

                const user: ResponseUser | null = await UserModel.findOne({ email });
                if (!user) throw new Error("Email/password mismatch!");

                const passwordMatch = await user.comparePassword(password);
                if (!passwordMatch) throw new Error("Email/password mismatch!");

                // const {email, id, role}: {email: string, id:string, role: string} = user;

                return {
                    email: user.email,
                    id: user._id, 
                    role: user.role
                };
            },
        }),
    ],
    callbacks: {
        jwt(params: any) {
            if (params.user) {
                params.token.id = params.user.id;
                params.token.email = params.user.email;
                params.token.role = params.user.role;  // Add role to token
            }
            return params.token;
        },
        session({ session, token }) {
            if (session.user) {
                (session.user as { id: string }).id = token.id as string;
                (session.user as { email: string }).email = token.email as string;
                (session.user as { role: string }).role = token.role as string;  // Add role to session
            }
            return session;
        },
    }
};
