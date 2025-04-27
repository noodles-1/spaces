"use client"

import { useState } from "react";

export default function AuthSetupPage() {
    const [customUsername, setCustomUsername] = useState<string>("");

    return (
        <main className="relative flex items-center justify-center flex-1 h-screen bg-zinc-800">
            <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                spaces
            </p>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-semibold"> Welcome to spaces! </span>
                    <span className="text-lg text-[#abc4ff]"> Setup your profile to continue. </span>
                </div>
        </main>
    );
}