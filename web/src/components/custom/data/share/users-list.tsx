import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { UsersListSkeleton } from "@/components/custom/data/share/users-list-skeleton";
import { UserWithAccess } from "@/components/custom/data/share/user-with-access";

import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { User, UserResponse } from "@/types/response/user-type";
import { UserPermission } from "@/types/user-permission-type";

export function UsersList({
    selectedItem,
}: { 
    selectedItem: Item
}) {
    const { data: currentUserData } = useQuery<AxiosResponse<ResponseDto<User>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me")
    });

    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner-id", selectedItem.id],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${selectedItem.id}`)
    });

    const { data: permissionsData } = useQuery<AxiosResponse<ResponseDto<{ permissions: UserPermission[] }>>>({
        queryKey: ["user-permissions", selectedItem.id],
        queryFn: () => axiosClient.get(`/storage/permissions/ancestors/${selectedItem.id}`)
    });

    const [ownerUser, setOwnerUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        if (!ownerUserIdData)
            return;

        const fetchUser = async () => {
            const response = await axiosClient.get<ResponseDto<User>>(`/user/users/info/${ownerUserIdData.data.data.ownerUserId}`);
            setOwnerUser(response.data.data.user);
        };

        fetchUser();
    }, [ownerUserIdData])

    if (!(currentUserData && ownerUserIdData && permissionsData && ownerUser)) {
        return <UsersListSkeleton />;
    }

    const currentUser = currentUserData.data.data.user;
    const permissions = permissionsData.data.data.permissions;
    const userPermissions = permissions.filter(permission => permission.userId !== "EVERYONE");

    return (
        <main className="flex-1 flex flex-col gap-4">
            <section className="flex flex-col gap-3">
                <span className="text-[14px] font-semibold text-zinc-300"> Owner </span>
                <div className="w-full min-h-[4rem] rounded-lg bg-zinc-700 flex items-center px-4 inset-ring-1 inset-ring-zinc-500">
                    <div className="flex gap-4 items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full outline-zinc-500 group-hover:outline-[#7076a7]">
                            <img src={ownerUser.profilePictureUrl ?? ""} className="object-cover h-full w-full rounded-full" />
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="text-sm">
                                <span> {ownerUser.customUsername} </span>
                                {ownerUser.id === currentUser.id &&
                                    <span className="text-zinc-400 font-semibold"> (You) </span>
                                }
                            </div>
                            <span className="text-[12px] text-zinc-300"> {ownerUser.providerUsername} </span>
                        </div>
                    </div>
                </div>
            </section>
            {userPermissions.length > 0 &&
                <section className="flex flex-col gap-3">
                    <span className="text-[14px] font-semibold text-zinc-300"> Users with access </span>
                    <section className="max-h-[12rem] overflow-y-auto flex flex-col gap-3">
                        {userPermissions.map((permission, i) =>
                            <UserWithAccess 
                                key={i} 
                                userPermission={permission} 
                                currentUserId={currentUser.id} 
                                selectedItemId={selectedItem.id}
                                ownerUserId={ownerUser.id}
                            />
                        )}
                    </section>
                </section>
            }
        </main>
    );
}