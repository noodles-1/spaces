import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";

interface CreatePermissionParams {
    userId: string;
    type: "EDIT" | "VIEW";
    itemId: string;
}

export async function createPermission(params: CreatePermissionParams): Promise<ResponseDto> {
    const response = await axiosClient.post("/storage/permission/create", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

interface UpdatePermissionParams {
    id: string;
    type: "EDIT" | "VIEW";
}

export async function updatePermission(params: UpdatePermissionParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/permissions/update", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

interface DeletePermissionParams {
    id: string;
}

export async function deletePermission(params: DeletePermissionParams): Promise<ResponseDto> {
    const response = await axiosClient.delete(`/storage/permissions/delete/${params.id}`);
    return response.data;
}