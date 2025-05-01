"use client"

import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/tanstack/query-client";

export default function TanstackProvider({
    children
}: {
    children: React.ReactNode
}) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}