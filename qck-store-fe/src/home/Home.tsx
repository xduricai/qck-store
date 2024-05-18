import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { GetFolderContent, GetRootDirectories, GetSearchResults } from "../api/DirectoryClient";
import { useLocation, useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import { useEffect, useState } from "react";
import { ContextMenu, ContextMenuStatus } from "./ContextMenu";
import { DetailsDialog } from "./dialogs/DetailsDialog";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { NewItemDialog } from "./dialogs/NewItemDialog";
import { ItemCompareFn, SortOption, getSortOptions } from "./Sorting";
import { File } from "../api/responses/File";
import { Directory } from "../api/responses/Directory";
import { ErrorPage } from "../shared/ErrorPage";
import { LoadingPage } from "../shared/Loading";
import { deleteFile, uploadFile } from "../api/FileClient";
import { FolderContentResponse } from "../api/responses/FolderContentResponse";
import { useSnackbarContext } from "../global/SnackbarContext";
import { useUserContext } from "../global/UserContext";
import './home.css';

export type ItemType = "folder" | "file";

export function Home() {
    const { folderId, query } = useParams();
    const location = useLocation();    
    const queryClient = useQueryClient();
    const showSnackbar = useSnackbarContext();
    const userContext = useUserContext();

    const sortOptions = getSortOptions();
    const [ sortOption, setSortOption ] = useState<SortOption>(sortOptions[0]);
    const [ addOpen, setAddOpen ] = useState(false);
    const [ sortOpen, setSortOpen ] = useState(false);
    const [ detailsOpen, setDetailsOpen ] = useState(false);
    const [ renameOpen, setRenameOpen ] = useState(false);
    const [ deleteOpen, setDeleteOpen ] = useState(false);
    const [ itemDialogStatus, setItemDialogStatus ] = useState<ItemType | null>(null);
    const [ menuStatus, setMenuStatus ] = useState<ContextMenuStatus | null>(null);

    useEffect(() => {
        setMenuStatus(null);
    }, [location]);
    
    // closes context menu when a dialog is closed
    useEffect(() => {
        if (!detailsOpen && !renameOpen && !deleteOpen) {
            setMenuStatus(null);
        }
    }, [detailsOpen, renameOpen, deleteOpen]);

    const { data: dirs, isLoading: dirsLoading, isError: dirsError} = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });
    const { data: content, isLoading: contentLoading, isError: contentError } = useQuery({
        queryKey: ["content", folderId || query ],
        queryFn: () => folderId ? GetFolderContent(folderId) : GetSearchResults(query)
    });

    const { mutate: uploadFileMutation } = useMutation({
        mutationFn: uploadFile,
        onSuccess: (file) => {
            showSnackbar("File uploaded successfully", "success");

            const user = {...userContext.user!};
            user.bytesUsed += file.size;
            userContext.setUser(user);

            if (folderId !== file.parentId) return;

            queryClient.setQueryData(["content", folderId], (content: FolderContentResponse) => {
                if (!content) return null;
                return {
                    ...content,
                    files: [...content.files, file]
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    //TODO 
    const { mutate: renameFileMutation } = useMutation({

    });

    const { mutate: deleteFileMutation } = useMutation({
        mutationFn: deleteFile,
        onSuccess: (res) => {
            showSnackbar("File deleted successfully", "success");

            const user = {...userContext.user!};
            user.bytesUsed -= res.size;
            userContext.setUser(user);

            queryClient.setQueryData(["content", folderId || query], (content: FolderContentResponse) => {
                if (!content) return null;
                return {
                    ...content,
                    files: content.files.filter(file => file.id !== res.id)
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });  

    if (dirsLoading || contentLoading) {
        return <LoadingPage />;
    }
    if (!dirs || dirsError || !content || contentError) {
        return <ErrorPage />;
    }

    const rootDirs = dirs.filter(dir => dir.isRoot) || [];
    const contentDirs = getContentDirs(sortOption.compareFn, content.directories); 
    const files = getFiles(sortOption.compareFn, content.files);  
    const title = getTitle();

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }

    function getContentDirs(compareFn: ItemCompareFn, dirs?: Directory[]) {
        if (!dirs) return [];
        if (folderId || query) return [...dirs].sort(compareFn);
        return [...rootDirs].sort(compareFn);
    }

    function getFiles(compareFn: ItemCompareFn, files?: File[]) {
        if (!files) return [];
        return [...files].sort(compareFn);
    }

    function getTitle() {
        if (folderId) {
            return dirs?.find(dir => dir.id.toString() === folderId)?.name || "";
        }
        if (query) {
            return `Results for "${query}"`;
        }
        return "Home";
    }

    function closeMenus() {
        setMenuStatus(null);
        setSortOpen(false);
        setAddOpen(false);
    }

    return (
        <>
        <div className="flex h-[calc(100%-4rem)] w-full bg-gray-100" onClick={() => closeMenus()}>
            <section className="h-full flex">
                <Sidenav directories={rootDirs} selectedId={parseId(folderId)} addOpen={addOpen} setAddOpen={setAddOpen} setMenuStatus={setMenuStatus} setDialogStatus={setItemDialogStatus} />
                <NewItemDialog dirs={[...dirs || []]} folderId={folderId} status={itemDialogStatus} setStatus={setItemDialogStatus} uploadFile={uploadFileMutation} />
            </section>

            <section className="w-full mt-1 p-4 rounded-tl-xl bg-white">
                <div className="w-full h-10 flex justify-between mb-4 overflow-x-visible">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <div className="h-fit w-28 relative border-gray-400 border rounded" onClick={(event) => {setSortOpen(!sortOpen); event.stopPropagation()}}>
                        <li className="menu-item">{sortOption.name}</li>
                        {sortOpen && sortOptions
                            .filter(opt => opt.name !== sortOption.name)
                            .map(opt => 
                                <li key={opt.name} className="menu-item" onClick={() => setSortOption(opt)}>
                                    {opt.name}
                                </li>
                        )}
                    </div>
                </div>

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
            <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} type={menuStatus.type} id={menuStatus.item.id} deleteFile={deleteFileMutation} />
        </>}
        </>
    );
}