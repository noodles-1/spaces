import { usePathname } from "next/navigation";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CircleCheck, CircleX, Star } from "lucide-react";

import { FileIcon } from "@/components/custom/data/file-icon";

import { toggleItemStarred } from "@/services/starred";
import { customToast } from "@/lib/custom/custom-toast";
import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function StarColumn({
    item
}: {
    item: Item
}) {
    const pathname = usePathname();
    const paths = pathname.split("/");
    const parentId = paths.length === 4 ? paths[3] : undefined;

    const { data: starredExistsData } = useQuery<AxiosResponse<ResponseDto<{ exists: boolean }>>>({
        queryKey: ["starred-item-exists", item.id],
        queryFn: () => axiosClient.get(`/storage/starred/check-exists/${item.id}`)
    });

    const queryClient = useQueryClient();

    const toggleItemStarredMutation = useMutation({
        mutationFn: toggleItemStarred
    });

    if (!starredExistsData) {
        return null;
    }

    const isStarred = starredExistsData.data.data.exists;

    const handleStarred = async (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();

        try {
            await toggleItemStarredMutation.mutateAsync({
                itemId: item.id
            });

            if (parentId) {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items", parentId]
                });
            }
            else {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items"]
                });
            }

            queryClient.invalidateQueries({
                queryKey: ["user-accessible-starred-items"]
            });

            queryClient.invalidateQueries({
                queryKey: ["starred-item-exists", item.id]
            });

            if (isStarred) {
                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message: `${item.name} has been removed from starred items.`,
                });
            }
            else {
                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message: `${item.name} has been added to starred items.`,
                });
            }
        }
        catch (error) {
            const axiosError = error as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center w-full gap-8">
                <FileIcon
                    contentType={item.contentType}
                    className="w-4 h-4"
                />
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.name}
                </div>
                <Star
                    onClick={handleStarred}
                    className={`
                        w-4 h-4 mx-4 opacity-0 cursor-pointer group-hover:opacity-100 
                        ${isStarred ? "fill-white" : "hover:fill-white"}
                    `}
                />
            </div>
        </div>
    );
}