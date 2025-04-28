import { api, HydrateClient } from "@/trpc/server";
import { Test } from "./components/test";
import { auth } from "@/server/auth";

export default async function Home() {
    const result = await api.test.foo({ test: "你好" });
    const session = await auth();

    return (
        <HydrateClient>
            <div>{result.input.test}</div>
            <Test />
            {session && (
                <div>
                    <div>{session.user.name}</div>
                    <div>{session.user.email}</div>
                </div>
            )}
        </HydrateClient>
    );
}
