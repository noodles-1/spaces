import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton"
;
import { fetcher } from "@/services/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { User } from "@/types/response/user-type";
import { UserRound } from "lucide-react";

export function OwnerColumnAvatar({
    ownerUserId,
}: {
    ownerUserId: string
}) {
    const { data: userData } = useQuery<ResponseDto<User>>({
        queryKey: ["user-info", ownerUserId],
        queryFn: () => fetcher(`/user/users/info/${ownerUserId}`)
    });

    if (!userData) {
        return (
            <div className="flex items-center w-full gap-4">
                <div className="rounded-full outline">
                    <Skeleton className="rounded-full w-[2rem] h-[2rem] bg-zinc-600" />
                </div>
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Skeleton className="h-2 w-[3rem] bg-zinc-600" />
                </div>
            </div>
        );
    }

    const user = userData.data.user;

    return (
        <div className="flex items-center w-full gap-4">
            <div className="rounded-full outline">
                {user.profilePictureUrl ?
                    <img src={user.profilePictureUrl} className="object-cover w-8 h-8 rounded-full" />
                : 
                    <UserRound className="w-5 h-5" />
                }
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {user.customUsername} 
            </div>
        </div>
    );
}