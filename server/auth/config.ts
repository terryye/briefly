import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/nodemailer";

import { db } from "@/server/db";
import {
    accounts,
    sessions,
    users,
    verificationTokens,
} from "@/server/db/schema";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

export const authConfig = {
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            name: "Email",
        }),
        Google,
        GitHub,
    ],
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        //brandColor: "", // Hex color code
        logo: process.env.SITE_LOGO, // Absolute URL to image
        //buttonText: "", // Hex color code
    },
} satisfies NextAuthConfig;
