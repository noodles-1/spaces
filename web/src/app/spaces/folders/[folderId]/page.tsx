import { FolderPage } from "@/app/spaces/folders/[folderId]/folder-page";

const Folder = async ({
    params,
}: {
    params: Promise<{ folderId: string }>
}) => {
    const { folderId } = await params;

    if (folderId === undefined) {
        return null;
    }

    return <FolderPage folderId={folderId} />;
}
 
export default Folder;