import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";

import { UsersListSkeleton } from "@/components/custom/data/share/users-list-skeleton";
import { UserWithAccess } from "@/components/custom/data/share/user-with-access";

import { fetcher } from "@/services/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { User } from "@/types/response/user-type";
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

    const { data: ownerUserData } = useQuery<ResponseDto<User>>({
        queryKey: ["user-info", selectedItem.ownerUserId],
        queryFn: () => fetcher(`/user/users/info/${selectedItem.ownerUserId}`)
    });

    const { data: permissionsData } = useQuery<ResponseDto<{ permissions: UserPermission[] }>>({
        queryKey: ["user-permissions", selectedItem.id],
        queryFn: () => fetcher(`/storage/permissions/ancestors/${selectedItem.id}`)
    });

    if (!(currentUserData && ownerUserData && permissionsData)) {
        return <UsersListSkeleton />;
    }

    const currentUser = currentUserData.data.data.user;
    const ownerUser = ownerUserData.data.user;
    const permissions = permissionsData.data.permissions;

    const userPermissions = permissions.filter(permission => permission.userId !== "EVERYONE").filter(permission => permission.userId !== ownerUser.id);

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
                            <UserWithAccess key={i} userPermission={permission} currentUserId={currentUser.id} selectedItemId={selectedItem.id} />
                        )}
                    </section>
                </section>
            }
        </main>
    );
}