import { api, HydrateClient } from "@/trpc/server";
import { Test } from "@/app/components/test";
import { auth } from "@/server/auth";

export default async function Home() {
    const result = await api.test.foo({ test: "你好" });
    const session = await auth();

    return (
        <HydrateClient>
            <div className="flex w-full flex-col overflow-y-auto">
                <div className="flex w-full flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold">Hello World</h1>
                    <p className="text-lg">Welcome to the Next.js app!</p>
                </div>

                <div className="flex w-full flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold">Test Result</h2>
                    <p className="text-lg">{result.input.test}</p>
                </div>
            </div>
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
