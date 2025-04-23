import { FolderPage } from "@/app/spaces/folders/[folderId]/folder-page";

const Folder = async ({
    params,
}: {
    params: Promise<{ folderId: string }>
}) => {
    const { folderId } = await params;

    return <FolderPage folderId={folderId} />;
}
 
export default Folder;