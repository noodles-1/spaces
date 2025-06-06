import { usePathname } from "next/navigation";

import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CircleX, Star } from "lucide-react";

import { FileIcon } from "@/components/custom/data/file-icon";

import { toggleItemStarred } from "@/services/storage";
import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function StarColumn({
    item
}: {
    item: Item
}) {
    const pathname = usePathname();

    const queryClient = useQueryClient();
    const toggleItemStarredMutation = useMutation({
        mutationFn: toggleItemStarred
    });

    const handleStarred = async (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();

        try {
            await toggleItemStarredMutation.mutateAsync({
                itemId: item.id
            });

            const paths = pathname.split("/");
            const parentId = paths.length === 4 ? paths[3] : undefined;

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

            if (item.starred) {
                customToast({
                    icon: <Star className="w-4 h-4" color="white" />,
                    message: `${item.name} has been removed from starred items.`,
                });
            }
            else {
                customToast({
                    icon: <Star className="w-4 h-4 fill-white" color="white" />,
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
                        ${item.starred ? "fill-white" : "hover:fill-white"}
                    `}
                />
            </div>
        </div>
    );
}