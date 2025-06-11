import React from "react";
import { toast } from "sonner";

import { DownloadFiles } from "@/components/custom/data/download/download-files";

export function downloadToast() {
    toast(
            <DownloadFiles />
        ,
            {
                id: "download-toast",
                duration: Infinity,
                dismissible: false,
                unstyled: true,
            }
    );
}