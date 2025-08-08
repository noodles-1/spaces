"use client"

import React, { Dispatch, SetStateAction } from "react";

import { AxiosResponse } from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SharedMoveTreeView } from "@/components/custom/data/move/shared-move-tree-view";

import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { UserResponse } from "@/types/response/user-type";
import { OwnerMoveTreeView } from "./owner-move-tree-view";
import { UserPermission } from "@/types/user-permission-type";

export function RootMoveTreeView({
    selectedFolderId,
    selectedItems,
    sourceParentId,
    setSelectedFolderId,
    setSelectedItemsIdx,
    setOpen
}: {
    selectedFolderId: string | null
    selectedItems: Item[]
    sourceParentId: string
    setSelectedFolderId: Dispatch<SetStateAction<string | null>>
    setSelectedItemsIdx: Dispatch<SetStateAction<Set<number>>>
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const { data: ownerUserIdData } = useSuspenseQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner-id", sourceParentId],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${sourceParentId}`)
    });

    const { data: permissionData } = useSuspenseQuery<AxiosResponse<ResponseDto<{ permission: UserPermission | null }>>>({
        queryKey: ["current-user-permission", sourceParentId],
        queryFn: () => axiosClient.get(`/storage/permissions/public/permission/${sourceParentId}`)
    });

    const { data: currentUserData } = useSuspenseQuery<AxiosResponse<ResponseDto<{ user: UserResponse | null }>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me")
    });

    const ownerUserId = ownerUserIdData.data.data.ownerUserId;
    const permission = permissionData.data.data.permission;
    const currentUser = currentUserData.data.data.user;

    const isOwner = currentUser?.id === ownerUserId;

    if (isOwner) {
        return (
            <OwnerMoveTreeView
                selectedFolderId={selectedFolderId}
                selectedItems={selectedItems}
                sourceParentId={sourceParentId}
                setSelectedFolderId={setSelectedFolderId}
                setSelectedItemsIdx={setSelectedItemsIdx}
                setOpen={setOpen}
            />
        );
    }

    if (!permission) {
        return null;
    }
    
    return (
        <SharedMoveTreeView
            selectedFolderId={selectedFolderId}
            selectedItems={selectedItems}
            sourceParentId={sourceParentId}
            permission={permission}
            setSelectedFolderId={setSelectedFolderId}
            setSelectedItemsIdx={setSelectedItemsIdx}
            setOpen={setOpen}
        />
    );
}