import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";

interface LoginUserParams {
    code: string;
    provider: string;
}

export async function loginUser(params: LoginUserParams): Promise<ResponseDto> {
    const { code, provider } = params;

    const response = await axiosClient.post(`/user/auth/login/${provider}`, {
        code
    }, {
        headers: { "Content-Type": "application/json" }
    });
    
    return response.data;
}

export async function userExistsByProviderEmail(providerEmail: string): Promise<ResponseDto> {
    const response = await axiosClient.get(`/user/users/provider-email-exists/${providerEmail}`);

    return response.data
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

export async function updateSetupDone(): Promise<ResponseDto> {
    const response = await axiosClient.post("/user/users/me/update-setup-done");
    return response.data;
}