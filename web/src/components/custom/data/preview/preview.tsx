import { ImagePreview } from "@/components/custom/data/preview/image-preview";
import { VideoPreview } from "@/components/custom/data/preview/video-preview";

import { Item } from "@/types/item-type";

export function Preview({
    contentType,
    file,
}: {
    contentType: string
    file: Item
}) {
    if (contentType.startsWith("image/"))
        return <ImagePreview file={file} />;
    if (contentType.startsWith("video/"))
        return <VideoPreview file={file} />;

    return <div className="w-full h-full rounded bg-zinc-700" />;
}