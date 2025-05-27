"use client";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

export default function Signinout({ session }: { session: Session | null }) {
    return session ? (
        <button
            className="btn btn-wide"
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            Sign out
        </button>
    ) : (
        <button className="btn btn-wide" onClick={() => signIn()}>
            Sign in
        </button>
    );
}
