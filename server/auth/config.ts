import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
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
    providers: [GitHub, Google],
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
        colorScheme: "auto", // "auto" | "dark" | "light"
        //brandColor: "", // Hex color code
        logo: "http://localhost:3000/images/logo.png", // Absolute URL to image
        //buttonText: "", // Hex color code
    },
} satisfies NextAuthConfig;
