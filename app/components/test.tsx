"use client";
import { api } from "@/trpc/react";

export function Test() {
    const { data } = api.test.foo.useQuery({ test: "客户端组件" });
    return (
        <div>
            <h1>Test</h1>
            <div>{data?.input.test}</div>
        </div>
    );
}
