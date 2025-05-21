import { X } from "lucide-react";

import { useUploadStore } from "@/zustand/providers/upload-store-provider";

import { UploadFile } from "@/components/custom/data/upload/upload-file";
import { toast } from "sonner";

export function UploadFiles() {
    const { uploads, clearFiles } = useUploadStore(state => state);
    const uploading = uploads.filter(upload => upload.isUploading);

    const handleDismiss = () => {
        toast.dismiss("upload-toast");
        clearFiles();
    };

    return (
        <main className="flex flex-col gap-4 p-4 text-sm font-normal rounded-lg w-[23rem] bg-zinc-900 border-1 border-zinc-800">
            {uploading.length > 0 ?
                <section>
                    <span className="font-semibold"> Uploading files </span>
                    <span className="text-zinc-400"> ({uploading.length}) </span>
                </section>
            :
                <section className="flex items-center justify-between">
                    <span className="font-semibold"> Files uploaded! </span>
                    <X 
                        className="h-5 w-5 hover:stroke-zinc-600 cursor-pointer"
                        onClick={() => handleDismiss()}
                    />
                </section>
            }
            <section className="flex flex-col gap-3 max-h-[16rem] overflow-x-auto">
                {uploads.map((upload, idx) =>
                    <UploadFile key={idx} upload={upload} idx={idx} />
                )}
            </section>
        </main>
    );
}