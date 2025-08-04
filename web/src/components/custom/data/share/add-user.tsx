import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Check, CircleCheck, CircleX, Eye, Loader2, Pen } from "lucide-react";

import AsyncSelect from "react-select/async";
import { StylesConfig } from "react-select";

import axiosClient from "@/lib/axios-client";
import { fetcher } from "@/services/fetcher";
import { createPermission, deletePermission } from "@/services/permission";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AddUserSkeleton } from "@/components/custom/data/share/add-user-skeleton";

import { customToast } from "@/lib/custom/custom-toast";
import { Item } from "@/types/item-type";
import { User, UserResponse } from "@/types/response/user-type";
import { UserPermission } from "@/types/user-permission-type";
import { ResponseDto } from "@/dto/response-dto";
import { Switch } from "@/components/ui/switch";

interface UserOption {
    value: string;
    label: string;
    providerUsername: string;
    profilePictureUrl: string;
}

const customStyles: StylesConfig<UserOption> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "#3f3f46",
        borderColor: state.isFocused ? "#71717b" : "#3f3f46",
        boxShadow: state.isFocused ? "0 0 0 1px #d4d4d8" : "none",
        color: "#f4f4f5",
        "&:hover": {
            borderColor: "#71717b",
        },
        borderWidth: "1px",
        borderRadius: "0",
        height: "3.5rem",
        padding: "0",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#3f3f46",
        borderRadius: "0",
        marginTop: "0",
        zIndex: 50,
        overflow: "hidden",
        fontSize: "14px",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? "#3f3f46"
            : "transparent",
        color: "#f4f4f5",
        padding: "0.2rem",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#3f3f46",
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: "#f4f4f5",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#a1a1aa",
        fontSize: "14px",
    }),
    input: (base) => ({
        ...base,
        color: "#f4f4f5",
        fontSize: "14px",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "#d4d4d8",
        "&:hover": {
            color: "#f4f4f5",
            cursor: "pointer"
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "#71717a",
    }),
    clearIndicator: (base) => ({
        ...base,
        color: "#d4d4d8",
        "&:hover": {
            color: "#f4f4f5",
            cursor: "pointer"
        },
    })
};

export function AddUser({ selectedItem }: { selectedItem: Item }) {
    const { data: currentUserData } = useQuery<AxiosResponse<ResponseDto<User>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me"),
    });

    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner-id", selectedItem.id],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${selectedItem.id}`)
    });

    const { data: permissionsData } = useQuery<ResponseDto<{ permissions: UserPermission[] }>>({
        queryKey: ["user-permissions", selectedItem.id],
        queryFn: () =>
            fetcher(`/storage/permissions/ancestors/${selectedItem.id}`),
    });

    const createPermissionMutation = useMutation({
        mutationFn: createPermission
    });

    const deletePermissionMutation = useMutation({
        mutationFn: deletePermission
    });

    const queryClient = useQueryClient();

    const [selectedUserOption, setSelectedUserOption] = useState<UserOption | null>(null);
    const [selectedPermissionType, setSelectedPermissionType] = useState<"EDIT" | "VIEW">("VIEW");
    const [loading, setLoading] = useState<boolean>(false);
    const [toggleLoading, setToggleLoading] = useState<boolean>(false);
    const [ownerUser, setOwnerUser] = useState<UserResponse | null>(null);
    
    useEffect(() => {
        if (!ownerUserIdData)
            return;

        const fetchUser = async () => {
            const response = await fetcher<User>(`/user/users/info/${ownerUserIdData.data.data.ownerUserId}`);
            setOwnerUser(response.data.user);
        };

        fetchUser();
    }, [ownerUserIdData])

    if (!(currentUserData && ownerUserIdData && permissionsData && ownerUser)) {
        return <AddUserSkeleton />;
    }

    const currentUser = currentUserData.data.data.user;
    const permissions = permissionsData.data.permissions;

    const userPermissions = permissions.filter(permission => permission.userId !== "EVERYONE");
    const publicViewPermission = permissions.find(permission => permission.userId === "EVERYONE");
    const idSet = new Set([currentUser.id, ownerUser.id]);
    userPermissions.map(permission => idSet.add(permission.userId));

    const fetchUsers = async (value: string) => {
        if (value.length === 0) return [];

        const response = await fetcher<{ users: UserResponse[] }>(`/user/users/search/${encodeURIComponent(value)}`);
        const users = response.data.users.filter(user => !idSet.has(user.id));

        return users.map<UserOption>((user) => ({
            value: user.id,
            label: user.customUsername ?? "",
            providerUsername: user.providerUsername,
            profilePictureUrl: user.profilePictureUrl ?? "",
        }));
    };

    const handleCreatePermission = async () => {
        if (!selectedUserOption)
            return;

        try {
            setLoading(true);

            await createPermissionMutation.mutateAsync({
                userId: selectedUserOption.value,
                type: selectedPermissionType,
                itemId: selectedItem.id
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: "Permission created successfully."
            });

            queryClient.invalidateQueries({
                queryKey: ["user-permissions", selectedItem.id]
            });

            setSelectedUserOption(null);
            setSelectedPermissionType("VIEW");
        }
        catch (err) {
            const axiosError = err as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleTogglePublicView = async () => {
        try {
            setToggleLoading(true);

            if (publicViewPermission) {
                await deletePermissionMutation.mutateAsync({
                    id: publicViewPermission.id
                });
            }
            else {
                await createPermissionMutation.mutateAsync({
                    userId: "EVERYONE",
                    type: "VIEW",
                    itemId: selectedItem.id
                });
            }

            const message = publicViewPermission
                ? `${selectedItem.name} is now a private ${selectedItem.type.toLowerCase()}.`
                : `Everyone with the link can now view ${selectedItem.name}.`

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message
            });

            queryClient.invalidateQueries({
                queryKey: ["user-permissions", selectedItem.id]
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
        finally {
            setToggleLoading(false);
        }
    };

    return (
        <main className="flex flex-1 flex-col gap-6">
            <section className="flex flex-col gap-3">
                <span className="text-[14px] font-semibold text-zinc-300"> Add user </span>
                <div className="flex items-center">
                    <AsyncSelect<UserOption>
                        cacheOptions
                        loadOptions={fetchUsers}
                        onChange={option => setSelectedUserOption(option)}
                        value={selectedUserOption}
                        placeholder="Search user to add"
                        className="flex-1"
                        isClearable
                        styles={customStyles}
                        formatOptionLabel={(option) =>
                            <div className="flex-1 flex gap-3 hover:bg-zinc-600 items-center py-1 px-3 m-0">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full outline-zinc-500 group-hover:outline-[#7076a7]">
                                    <img src={option.profilePictureUrl} className="object-cover h-full w-full rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-sm">
                                        <span> {option.label} </span>
                                    </div>
                                    <span className="text-[12px] text-zinc-300"> {option.providerUsername} </span>
                                </div>
                            </div>
                        }
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="p-0 cursor-pointer rounded-none h-full w-[3.5rem] hover:text-spaces-secondary">
                                {selectedPermissionType === "EDIT" &&
                                    <Pen />
                                }
                                {selectedPermissionType === "VIEW" &&
                                    <Eye />
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                disabled={selectedPermissionType === "EDIT"} 
                                className="cursor-pointer flex items-center justify-between hover:bg-zinc-800"
                                onClick={() => setSelectedPermissionType("EDIT")}
                            >
                                <div className="flex items-center gap-3">
                                    <Pen height={20} width={20} className="stroke-zinc-300" />
                                    <span> Edit </span>
                                </div>
                                {selectedPermissionType === "EDIT" && <Check height={20} width={20} className="stroke-zinc-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                disabled={selectedPermissionType === "VIEW"} 
                                className="cursor-pointer flex items-center justify-between hover:bg-zinc-800"
                                onClick={() => setSelectedPermissionType("VIEW")}
                            >
                                <div className="flex items-center gap-3">
                                    <Eye height={20} width={20} className="stroke-zinc-300" />
                                    <span> View </span>
                                </div>
                                {selectedPermissionType === "VIEW" && <Check height={20} width={20} className="stroke-zinc-400" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    disabled={!selectedUserOption || loading}
                    variant="outline"
                    className="hover:text-spaces-secondary h-[2.4rem] cursor-pointer rounded-none"
                    onClick={handleCreatePermission}
                >
                    {loading && <Loader2 className="animate-spin"/>}
                    {loading ?
                        "Adding user..."
                    :
                        "Add"
                    }
                </Button>
            </section>
            <section className="flex gap-4 items-center justify-between bg-zinc-900 inset-ring-1 inset-ring-zinc-700 w-full py-4 px-6">
                <div className="flex flex-col">
                    <span className="text-[14px] text-zinc-300"> Everyone with the link can view? </span>
                    {publicViewPermission ?
                        <div className="text-[12px] text-zinc-400">
                            Turning this off will remove public view for
                            <span className="font-semibold text-zinc-300"> {publicViewPermission.item.name}. </span>
                        </div>
                    :
                        <div className="text-[12px] text-zinc-400">
                            Turning this on will allow public view for
                            <span className="font-semibold text-zinc-300"> {selectedItem.name}. </span>
                        </div>
                    }
                </div>
                <Switch 
                    disabled={toggleLoading}
                    checked={publicViewPermission !== undefined}
                    onClick={handleTogglePublicView}
                    className="cursor-pointer"
                />
            </section>
        </main>
    );
}
