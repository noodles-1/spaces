import { useEffect, useRef, useState } from "react";

import { AxiosError } from "axios";

import { CircleX } from "lucide-react";

import { FileIcon } from "@/components/custom/data/file-icon";
import { Progress } from "@/components/ui/progress";

import { downloadFile } from "@/services/storage";
import { useDownloadStore } from "@/zustand/providers/download-store-provider";
import { formatFileSize } from "@/lib/custom/file-size";
import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";
import { Download } from "@/types/download-type";
import { formatDownloadSpeed } from "@/lib/custom/download-speed";

export function DownloadFile({
    download,
    idx,
}: {
    download: Download
    idx: number
}) {
    const { setDownloading, setDownloaded } = useDownloadStore(state => state);

    const hasRun = useRef<boolean>(false);

    const [progress, setProgress] = useState<number>(0);
    const [downloadedBits, setDownloadedBits] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const downloadFileDirectly = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const interval = setInterval(() => setSeconds(prev => prev + 1), 1000);

        if (hasRun.current)
            return;

        hasRun.current = true;

        const handleDownload = async () => {
            try {
                if (download.isDownloaded) {
                    return;
                }
    
                setDownloading(idx);
    
                const downloadResponse = await downloadFile({
                    file: download.file,
                    setProgress,
                    setDownloadedBits: setDownloadedBits,
                });
                
                if (downloadResponse.isDownloaded) {
                    setDownloaded(idx);
                    downloadFileDirectly(downloadResponse.blob, download.file.name);
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

        handleDownload();
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex flex-col gap-5 p-4 border-2 rounded-lg border-zinc-800">
            <section className="flex items-center gap-4">
                <FileIcon contentType={download.file.contentType} className="w-4 h-4" />
                <div className="text-[12px] flex-1">
                    <div className="max-w-[16rem] overflow-x-hidden text-ellipsis whitespace-nowrap">
                        {download.file.name}
                    </div>
                    {download.isDownloaded ?
                        <span className="text-zinc-400">
                            {`${formatFileSize(download.file.size ?? 0)}`}
                        </span>
                    :
                        <section className="flex justify-between items-center">
                            <span className="text-zinc-400">
                                {`(${formatFileSize(downloadedBits)} out of ${formatFileSize(download.file.size ?? 0)})`}
                            </span>
                            <span className="text-zinc-400">
                                {`${formatDownloadSpeed(downloadedBits, seconds)}`}
                            </span>
                        </section>
                    }
                </div>
            </section>
            {progress < 100 && <Progress value={progress} className="h-1" />}
        </div>
    );
}