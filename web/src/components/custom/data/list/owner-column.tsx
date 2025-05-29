import { useSuspenseQuery } from "@tanstack/react-query";

import { UserRound } from "lucide-react";

import { fetcher } from "@/actions/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { User } from "@/types/response/user-type";

export function OwnerColumn({
    ownerUserId
}: {
    ownerUserId: string
}) {
    const { data: userInfo } = useSuspenseQuery<ResponseDto<User>>({
        queryKey: ["user-info", ownerUserId],
        queryFn: () => fetcher(`/user/users/info/${ownerUserId}`)
    });

    return (
        <div className="flex items-center w-full gap-4">
            <div className="rounded-full outline">
                {userInfo.data.user.profilePictureUrl ?
                    <img src={userInfo.data.user.profilePictureUrl} className="object-cover w-8 h-8 rounded-full" />
                : 
                    <UserRound className="w-5 h-5" />
                }
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {userInfo.data.user.customUsername} 
            </div>
        </div>
    );
}