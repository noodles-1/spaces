import { X } from "lucide-react";

import { useDownloadStore } from "@/zustand/providers/download-store-provider";

import { DownloadFile } from "@/components/custom/data/download/download-file";
import { toast } from "sonner";

export function DownloadFiles() {
    const { downloads, clearFiles } = useDownloadStore(state => state);
    const downloading = downloads.filter(download => download.isDownloading);

    const handleDismiss = () => {
        toast.dismiss("download-toast");
        clearFiles();
    };

    return (
        <main className="flex flex-col gap-4 p-4 text-sm font-normal rounded-lg w-[23rem] bg-zinc-900 border-1 border-zinc-800">
            {downloading.length > 0 ?
                <section>
                    <span className="font-semibold"> Downloading items </span>
                    <span className="text-zinc-400"> ({downloading.length}) </span>
                </section>
            :
                <section className="flex items-center justify-between">
                    <span className="font-semibold"> Items downloaded! </span>
                    <X 
                        className="h-5 w-5 hover:stroke-zinc-600 cursor-pointer"
                        onClick={() => handleDismiss()}
                    />
                </section>
            }
            <section className="flex flex-col gap-3 max-h-[16rem] overflow-x-auto">
                {downloads.map((download, idx) =>
                    <DownloadFile key={idx} download={download} idx={idx} />
                )}
            </section>
        </main>
    );
}