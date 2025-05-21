import React from "react";
import { toast } from "sonner";

export function customToast({
    icon,
    message,
    description,
} : {
    icon: React.ReactNode
    message: string
    description?: string
}) {
    toast(
            <div className="flex items-center gap-4 text-sm font-normal p-4 rounded-lg w-[23rem] bg-zinc-900 border-1 border-zinc-800">
                {icon}
                {description ?
                    <div className="flex flex-col">
                        <span> {message} </span>
                        <span className="text-zinc-300"> {description} </span>
                    </div>    
                :
                    <span> {message} </span>
                }
            </div>
        ,
            {
                unstyled: true
            }
    );
}