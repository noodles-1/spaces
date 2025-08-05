import { useEffect, useRef, useState } from "react";

import { AxiosError } from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CircleX } from "lucide-react";

import JSZip from "jszip";

import { Progress } from "@/components/ui/progress";
import { FileIcon } from "@/components/custom/data/file-icon";

import { downloadFile } from "@/services/storage";
import { fetcher } from "@/services/fetcher";

import { useDownloadStore } from "@/zustand/providers/download-store-provider";
import { formatFileSize } from "@/lib/custom/file-size";
import { customToast } from "@/lib/custom/custom-toast";
import { downloadDirectly } from "@/lib/custom/download-directly";
import { formatDownloadSpeed } from "@/lib/custom/download-speed";

import { ResponseDto } from "@/dto/response-dto";
import { Download } from "@/types/download-type";
import { Item } from "@/types/item-type";

export function DownloadFolder({
    download,
    idx,
}: {
    download: Download
    idx: number
}) {
    const { data: folderData } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items-recursive", download.file.id],
        queryFn: () => fetcher(`/storage/items/children/recursive/${download.file.id}`)
    });

    const { setDownloading, setDownloaded } = useDownloadStore(state => state);

    const hasRun = useRef<boolean>(false);

    const [progress, setProgress] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [downloadedBits, setDownloadedBits] = useState<number>(0);
    const [totalFolderSize, setTotalFolderSize] = useState<number>(-1);

    const calculateFolderSize = () => {
        let total = 0;

        function dfs(item: Item) {
            item.children?.map(child => dfs(child));
            if (item.size) {
                total += item.size;
            }
        }

        folderData.data.children[0]?.children?.map(child => dfs(child));
        setTotalFolderSize(total);
    };

    const downloadRecursive = async () => {
        const zip = new JSZip();

        function formattedDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        async function dfs(item: Item, path: string) {
            const currPath = `${path}/${item.name}`;

            if (item.type === "FILE") {
                const downloadResponse = await downloadFile({
                    file: item,
                    totalFolderSize,
                    setProgress,
                    setDownloadedBits
                });

                if (downloadResponse.isDownloaded) {
                    zip.file(currPath, downloadResponse.blob);
                }
            }
            else {
                zip.folder(currPath);

                if (item.children) {
                    await Promise.all(item.children.map(async (child) => await dfs(child, currPath)));
                }
            }
        }

        const zipName = `${download.file.name} - ${formattedDateTime()}`;
        
        if (folderData.data.children[0]?.children) {
            await Promise.all(folderData.data.children[0].children?.map(async (child) => await dfs(child, download.file.name)));
        }
        
        zip.generateAsync({ type: "blob" }).then(blob => downloadDirectly(blob, `${zipName}.zip`));
    };

    useEffect(() => {
        const interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        calculateFolderSize();

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        const handleDownload = async () => {
            try {
                if (download.isDownloaded) {
                    return;
                }
    
                setDownloading(idx);
                await downloadRecursive();            
                setDownloaded(idx);
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
        
        if (totalFolderSize >= 0) {
            if (hasRun.current)
                return;

            hasRun.current = true;

            handleDownload();
        }
    }, [totalFolderSize]);

    return (
        <div className="flex flex-col gap-5 p-4 border-2 rounded-lg border-zinc-800">
            <section className="flex items-center gap-4">
                <FileIcon contentType="application/zip" className="w-4 h-4" />
                <div className="text-[12px] flex-1">
                    <div className="max-w-[16rem] overflow-x-hidden text-ellipsis whitespace-nowrap">
                        {download.file.name}
                    </div>
                    {download.isDownloaded ?
                        <span className="text-zinc-400">
                            {`${formatFileSize(totalFolderSize)}`}
                        </span>
                    :
                        <section className="flex justify-between items-center">
                            {totalFolderSize >= 0 ?
                                <>
                                    <span className="text-zinc-400">
                                        {`(${formatFileSize(downloadedBits)} out of ${formatFileSize(totalFolderSize)})`}
                                    </span>
                                    <span className="text-zinc-400">
                                        {`${formatDownloadSpeed(downloadedBits, seconds)}`}
                                    </span>
                                </>
                            :
                                <span className="text-zinc-400">
                                    Calculating size...
                                </span>
                            }
                        </section>
                    }
                </div>
            </section>
            {progress < 100 && <Progress value={progress} className="h-1" />}
        </div>
    );
}