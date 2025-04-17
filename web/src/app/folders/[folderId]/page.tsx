import { FolderPage } from "@/app/folders/[folderId]/folder-page";

const Folder = async ({
    params,
} : {
    params: Promise<{ folderId: string }>
}) => {
    const { folderId } = await params;

    return <FolderPage folderId={folderId} />;
}
 
export default Folder;