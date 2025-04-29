import { Session } from "next-auth";

import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";

export async function userExistsByProviderEmail(providerEmail: string): Promise<ResponseDto> {
    const response = await axiosClient.get(`/user/users/provider-email-exists/${providerEmail}`);

    return response.data
}

interface RegisterUserParams {
    session: Session;
    customUsername: string;
}

export async function registerUser(params: RegisterUserParams): Promise<ResponseDto> {
    const { session, customUsername } = params;

    const response = await axiosClient.post("/user/auth/register", {
        customUsername,
        providerUsername: session.user?.name,
        providerEmail: session.user?.email
    }, {
        headers: { "Content-Type": "application/json" }
    })

    return response.data;
}

interface LoginUserParams {
    session: Session;
}

export async function loginUser(params: LoginUserParams): Promise<ResponseDto> {
    const { session } = params;

    const response = await axiosClient.post("/user/auth/login", {
        providerEmail: session.user?.email
    }, {
        headers: { "Content-Type": "application/json" }
    })

    return response.data;
}

export async function signOutUser(): Promise<ResponseDto> {
    const response = await axiosClient.post("/user/auth/sign-out", undefined, {
        headers: { "Content-Type": "application/json" }
    })

    return response.data;
}

interface UpdateProfilePictureParams {
    imageFile: File;
}

export async function updateProfilePicture(params: UpdateProfilePictureParams): Promise<ResponseDto> {
    const { imageFile } = params;

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axiosClient.post("/user/users/me/update-profile-picture", formData);
    
    return response.data;
}

interface UpdateCustomUsernameParams {
    customUsername: string;
}

export async function updateCustomUsername(params: UpdateCustomUsernameParams): Promise<ResponseDto> {
    const { customUsername } = params;

    const response = await axiosClient.post("/user/users/me/update-custom-username", {
        newCustomUsername: customUsername
    });
    return response.data;
}