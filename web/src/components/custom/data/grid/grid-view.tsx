import { Folder } from "@/components/custom/data/grid/folder";
import { File } from "@/components/custom/data/grid/file";

import { FILES, FOLDERS } from "@/constants/data/placeholder";

export function GridView() {
    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
                <span> Folders </span>
                <div className="flex flex-wrap gap-4">
                    {FOLDERS.map((folder, i) => (
                        <Folder key={i} folderItem={folder} />
                    ))}
                </div>
            </section>
            <section className="flex flex-col gap-4">
                <span> Files </span>
                <div className="flex flex-wrap gap-4">
                    {FILES.map((folder, i) => (
                        <File key={i} fileItem={folder} />
                    ))}
                </div>
            </section>
        </div>
    );
}
