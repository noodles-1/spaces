import { Session } from "next-auth";

import { ResponseDto } from "@/dto/response-dto";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function registerUser(session: Session, customUsername: string) {
    if (session.user === undefined)
        return;

    const response = await fetch(`${SERVER_URL}/user/auth/register`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customUsername: customUsername,
            providerUsername: session.user.name,
            providerEmail: session.user.email
        })
    });

    if (!response.ok) {
        throw new Error("Something went wrong with the request.");
    }

    const responseData: ResponseDto = await response.json();

    if (responseData.status !== 200) {
        throw new Error(`${responseData.message}`);
    }
}

export async function updateProfilePicture(imageFile: File) {
    const formData = new FormData();
    formData.append("file", imageFile);
    
    const response = await fetch(`${SERVER_URL}/user/users/me/update-profile-picture`, {
        credentials: "include",
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Something went wrong with the request.");
    }

    const responseData: ResponseDto = await response.json();

    if (responseData.status !== 200) {
        throw new Error(`${responseData.message}`);
    }
}