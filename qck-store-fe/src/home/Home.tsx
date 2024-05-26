import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { GetDirectoryContent, GetRootDirectories, GetSearchResults, createDirectory } from "../api/DirectoryClient";
import { useLocation, useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import { useEffect, useState } from "react";
import { ContextMenu } from "./ContextMenu";
import { DetailsDialog } from "./dialogs/DetailsDialog";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { NewItemDialog } from "./dialogs/NewItemDialog";
import { SortOption, getSortOptions } from "./Sorting";
import { ErrorPage } from "../shared/ErrorPage";
import { LoadingPage } from "../shared/Loading";
import { deleteFile, moveFile, renameFile, uploadFile } from "../api/FileClient";
import { FolderContentResponse } from "../api/responses/FolderContentResponse";
import { useSnackbarContext } from "../global/SnackbarContext";
import { useUserContext } from "../global/UserContext";
import { ContextMenuContext, ContextMenuStatus, ItemType } from "../global/MenuContext";
import { Directory } from "../api/responses/Directory";
import './home.css';

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

    const [dirs, content] = useQueries({
        queries: [
            { queryKey: ["dirs"], queryFn: GetRootDirectories },
            {
                queryKey: ["content", folderId || query || "home" ],
                queryFn: () => query ? GetSearchResults(query) : GetDirectoryContent(folderId)
            }
        ]
    });

    const { mutate: uploadFileMutation } = useMutation({
        mutationFn: uploadFile,
        onSuccess: (file, variables) => {
            showSnackbar("File uploaded successfully", "success");

            const user = {...userContext.user!};
            user.bytesUsed += file.size;
            userContext.setUser(user);

            if (folderId !== variables.folderId) return;

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

    const { mutate: renameFileMutation } = useMutation({
        mutationFn: renameFile,
        throwOnError: true,
        onSuccess: (_, variables) => {
            showSnackbar("File renamed successfully", "success");

            queryClient.setQueryData(["content", folderId || query], (content: FolderContentResponse) => {
                if (!content) return null;

                return {
                    ...content,
                    files: content.files.map(file => 
                        (file.id === variables.id) ? { ...file, name: variables.name } : file
                    )
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: moveFileMutation } = useMutation({
        mutationFn: moveFile,
        onSuccess: (_, variables) => {
            showSnackbar("File moved successfully", "success");
            if (!folderId) return;

            queryClient.setQueryData(["content", folderId], (content: FolderContentResponse) => {
                if (!content) return null;

                return {
                    ...content,
                    files: content.files.filter(file => file.id !== variables.id)
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: deleteFileMutation } = useMutation({
        mutationFn: deleteFile,
        onSuccess: (size, deletedId) => {
            showSnackbar("File deleted successfully", "success");

            const user = {...userContext.user!};
            user.bytesUsed -= size;
            userContext.setUser(user);

            queryClient.setQueryData(["content", folderId || query], (content: FolderContentResponse) => {
                if (!content) return null;
                return {
                    ...content,
                    files: content.files.filter(file => file.id !== deletedId)
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });  


    const { mutate: createDirectoryMutation } = useMutation({
        mutationFn: createDirectory,
        onSuccess: (dir, variables) => {
            showSnackbar("Directory created successfully", "success");
            queryClient.setQueryData(["dirs"], (dirs: Directory[]) => dirs ? [...dirs, dir] : null);

            const current = folderId === variables.parentId;
            const home = dir.isRoot && !folderId && !query;
            if (!current && !home) return;

            queryClient.setQueryData(["content", folderId || "home"], (content: FolderContentResponse) => {
                if (!content) return null;
                return {
                    ...content,
                    directories: [...content.directories, dir]
                }
            });
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    if (dirs.isLoading || content.isLoading) {
        return <LoadingPage />;
    }
    if (dirs.isError || content.isError || !dirs.data) {
        return <ErrorPage />;
    }

    const rootDirs = dirs.data.filter(dir => dir.isRoot).sort(sortOption.compareFn);
    const contentDirs = content.data?.directories 
        ? [...content.data.directories].sort(sortOption.compareFn)
        : [...rootDirs];
    const files = [...content.data?.files || []].sort(sortOption.compareFn); 
    const title = getTitle();

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }

    function getTitle() {
        if (folderId) {
            return dirs.data?.find(dir => dir.id.toString() === folderId)?.name || "";
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
        <ContextMenuContext.Provider value={{menuStatus, setMenuStatus}}>
        <div className="flex h-[calc(100%-4rem)] w-full bg-gray-100" onClick={() => closeMenus()}>
            <section className="h-full flex">
                <Sidenav directories={rootDirs} selectedId={parseId(folderId)} addOpen={addOpen} setAddOpen={setAddOpen} setDialogStatus={setItemDialogStatus} />
                <NewItemDialog dirs={[...dirs.data || []]} folderId={folderId} status={itemDialogStatus} setStatus={setItemDialogStatus} uploadFile={uploadFileMutation} createDirectory={createDirectoryMutation} />
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
                        {contentDirs.map(dir => <DirectoryChip key={dir.id} data={dir} />)}
                    </div>
                }
                <div className="dynamic-grid-lg gap-4">
                    {files.map(file => <FileChip key={file.id} data={file} />)}
                </div>
            </section>
        </div>
        {!!menuStatus && <>
            <ContextMenu dirs={dirs.data || []} setDetails={setDetailsOpen} setRename={setRenameOpen} setDelete={setDeleteOpen} moveFile={moveFileMutation} />
            <DetailsDialog open={detailsOpen} setOpen={setDetailsOpen} />
            <RenameDialog open={renameOpen} setOpen={setRenameOpen} renameFile={renameFileMutation} />
            <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} deleteFile={deleteFileMutation} />
        </>}
        </ContextMenuContext.Provider>
    );
}