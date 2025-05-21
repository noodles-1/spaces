import React from "react";
import { toast } from "sonner";

import { UploadFiles } from "@/components/custom/data/upload/upload-files";

export function uploadToast() {
    toast(
            <UploadFiles />
        ,
            {
                id: "upload-toast",
                duration: Infinity,
                dismissible: false,
                unstyled: true,
            }
    );
}