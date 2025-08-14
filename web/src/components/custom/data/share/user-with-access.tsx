import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CircleCheck, CircleX, Eye, Pen, X } from "lucide-react";
import { AxiosError, AxiosResponse } from "axios";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { deletePermission, updatePermission } from "@/services/permission";

import { customToast } from "@/lib/custom/custom-toast";
import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { User } from "@/types/response/user-type";
import { UserPermission } from "@/types/user-permission-type";

export function UserWithAccess({
    userPermission,
    currentUserId,
    selectedItemId,
    ownerUserId
}: {
    userPermission: UserPermission
    currentUserId: string
    selectedItemId: string
    ownerUserId: string
}) {
    const { data: ownerUserData } = useQuery<AxiosResponse<ResponseDto<User>>>({
        queryKey: ["user-info", userPermission.userId],
        queryFn: () => axiosClient.get(`/user/users/info/${userPermission.userId}`)
    });

    const updatePermissionMutation = useMutation({
        mutationFn: updatePermission
    });

    const deletePermissionMutation = useMutation({
        mutationFn: deletePermission
    });

    const queryClient = useQueryClient();

    if (!ownerUserData) {
        return (
            <Skeleton className="rounded-lg w-full h-[4rem] bg-zinc-600" />
        );
    }

    const user = ownerUserData.data.data.user;

    const handleEditPermission = async (newType: typeof userPermission.type) => {
        try {
            await updatePermissionMutation.mutateAsync({
                id: userPermission.id,
                type: newType
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: "Permission edited successfully."
            });

            queryClient.invalidateQueries({
                queryKey: ["user-permissions", selectedItemId]
            });
        }
        catch (err) {
            const axiosError = err as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
    };

    const handleDeletePermission = async () => {
        try {
            await deletePermissionMutation.mutateAsync({
                id: userPermission.id
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: "Permission deleted successfully."
            });

            queryClient.invalidateQueries({
                queryKey: ["user-permissions", selectedItemId]
            });
        }
        catch (err) {
            const axiosError = err as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
    };

    return (
        <div className="w-full min-h-[5rem] rounded-lg bg-zinc-700 flex justify-between items-center px-4 inset-ring-1 inset-ring-zinc-500">
            <div className="flex gap-4 items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full outline-zinc-500 group-hover:outline-[#7076a7]">
                    <img src={user.profilePictureUrl ?? ""} className="object-cover h-full w-full rounded-full" />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm">
                        <span> {user.customUsername} </span>
                        {user.id === currentUserId &&
                            <span className="text-zinc-400 font-semibold"> (You) </span>
                        }
                    </div>
                    <span className="text-[12px] text-zinc-300"> {user.providerUsername} </span>
                    {(user.id === currentUserId || ownerUserId === currentUserId) &&
                        <div className="text-[12px] text-zinc-300">
                            Root permission:
                            <span className="font-semibold"> {userPermission.item.name} </span>
                        </div>
                    }
                </div>
            </div>
            {ownerUserId === currentUserId &&
                <section className="flex items-center gap-1">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-0 cursor-pointer">
                                        {userPermission.type === "EDIT" &&
                                            <Pen height={20} width={20} className="stroke-zinc-300" />
                                        }
                                        {userPermission.type === "VIEW" &&
                                            <Eye height={20} width={20} className="stroke-zinc-300" />
                                        }
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span> Edit permission </span>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                disabled={userPermission.type === "EDIT"} 
                                className="cursor-pointer flex items-center justify-between hover:bg-zinc-800"
                                onClick={() => handleEditPermission("EDIT")}
                            >
                                <div className="flex items-center gap-3">
                                    <Pen height={20} width={20} className="stroke-zinc-300" />
                                    <span> Edit </span>
                                </div>
                                {userPermission.type === "EDIT" && <Check height={20} width={20} className="stroke-zinc-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                disabled={userPermission.type === "VIEW"} 
                                className="cursor-pointer flex items-center justify-between hover:bg-zinc-800"
                                onClick={() => handleEditPermission("VIEW")}
                            >
                                <div className="flex items-center gap-3">
                                    <Eye height={20} width={20} className="stroke-zinc-300" />
                                    <span> View </span>
                                </div>
                                {userPermission.type === "VIEW" && <Check height={20} width={20} className="stroke-zinc-400" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <X 
                                height={20} 
                                width={20} 
                                className="stroke-zinc-300 cursor-pointer hover:stroke-spaces-tertiary"
                                onClick={handleDeletePermission}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <span> Remove access </span>
                        </TooltipContent>
                    </Tooltip>
                </section>
            }
        </div>
    );
}