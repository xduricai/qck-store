import { useQuery } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { GetFolderContent, GetRootDirectories, GetSearchResults } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useLocation, useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import { useEffect, useState } from "react";
import { ContextMenu, ContextMenuStatus } from "./ContextMenu";
import { DetailsDialog } from "./dialogs/DetailsDialog";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { NewItemDialog } from "./dialogs/NewItemDialog";
import './home.css';

export type ItemType = "folder" | "file";

export function Home() {
    const location = useLocation();
    const { folderId, query } = useParams();
    const [ menuStatus, setMenuStatus ] = useState<ContextMenuStatus | null>(null);
    const [ detailsOpen, setDetailsOpen ] = useState(false);
    const [ renameOpen, setRenameOpen ] = useState(false);
    const [ deleteOpen, setDeleteOpen ] = useState(false);
    const [ itemDialogStatus, setItemDialogStatus ] = useState<ItemType | null>(null);
    
    const { data: dirs, isLoading: dirsLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });
    const { data: content, isLoading: contentLoading } = useQuery({
        queryKey: ["content", folderId || query ],
        queryFn: () => folderId ? GetFolderContent(folderId) : GetSearchResults(query)
    });

    const rootDirs = dirs?.filter(dir => dir.isRoot) || [];
    const contentDirs = getContentDirs(); 
    const files = content?.files || [];  
    const title = getTitle();

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }

    function getContentDirs() {
        if (folderId) return content?.directories || [];
        if (query) return content?.directories || [];
        return rootDirs;
    }

    function getTitle() {
        if (folderId) {
            return dirs?.find(dir => dir.id.toString() === folderId)?.name || "";
        }
        if (query) {
            return `Results for "${query}"`;
        }
        return null;
    }

    useEffect(() => {
        setMenuStatus(null);
    }, [location]);
    
    if (dirsLoading || contentLoading) {
        return <Loading />;
    }

    return (
        <>
        <div className="flex h-[calc(100%-4rem)] w-full bg-gray-100" onClick={() => setMenuStatus(null)}>
            <section className="h-full flex">
                <Sidenav directories={rootDirs} selectedId={parseId(folderId)} setMenuStatus={setMenuStatus} setDialogStatus={setItemDialogStatus} />
                <NewItemDialog dirs={[...dirs || []]} folderId={folderId} status={itemDialogStatus} setStatus={setItemDialogStatus} />
            </section>

            <section className="w-full mt-1 p-4 rounded-tl-xl bg-white">
                {title && <h1 className="text-xl font-semibold mb-4">{title}</h1>}
                {contentDirs.length > 0 && 
                    <div className="dynamic-grid-sm gap-4 mb-8">
                        {contentDirs.map(dir => <DirectoryChip key={dir.id} setMenuStatus={setMenuStatus} data={dir} />)}
                    </div>
                }
                <div className="dynamic-grid-lg gap-4">
                    {files.map(file => <FileChip key={file.id} setMenuStatus={setMenuStatus} data={file} />)}
                </div>
            </section>
        </div>
        {!!menuStatus && <>
            <ContextMenu dirs={dirs || []} menuStatus={menuStatus} setDetails={setDetailsOpen} setRename={setRenameOpen} setDelete={setDeleteOpen} />
            <DetailsDialog open={detailsOpen} setOpen={setDetailsOpen} item={menuStatus.item} />
            <RenameDialog open={renameOpen} setOpen={setRenameOpen} />
            <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} />
        </>}
        </>
    );
}