import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { getDirectoryContent, getRootDirectories, getSearchResults, createDirectory, renameDirectory, deleteDirectory, moveDirectory } from "../api/DirectoryClient";
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
    const { user, setUser } = useUserContext();

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
            { queryKey: ["dirs"], queryFn: getRootDirectories },
            {
                queryKey: ["content", folderId || query || "home" ],
                queryFn: () => query ? getSearchResults(query) : getDirectoryContent(folderId)
            }
        ]
    });

    const { mutate: uploadFileMutation } = useMutation({
        mutationFn: uploadFile,
        onSuccess: (file, variables) => {
            showSnackbar("File uploaded successfully", "success");
            setUser({ ...user!, bytesUsed: user!.bytesUsed + file.size });

            if (folderId !== variables.folderId) return;

            queryClient.setQueryData(["content", folderId], (content: FolderContentResponse) => content && ({
                ...content,
                files: [...content.files, file]
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: renameFileMutation } = useMutation({
        mutationFn: renameFile,
        onSuccess: (modified, variables) => {
            showSnackbar("File renamed successfully", "success");

            queryClient.setQueryData(["content", folderId || query], (content: FolderContentResponse) => content && ({
                ...content,
                files: content.files.map(file => 
                    (file.id === variables.id) 
                        ? { ...file, name: variables.name, modified } 
                        : file
                )
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: moveFileMutation } = useMutation({
        mutationFn: moveFile,
        onSuccess: (_, variables) => {
            showSnackbar("File moved successfully", "success");
            if (!folderId) return;

            queryClient.setQueryData(["content", folderId], (content: FolderContentResponse) => content && ({
                ...content,
                files: content.files.filter(file => file.id !== variables.itemId)
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: deleteFileMutation } = useMutation({
        mutationFn: deleteFile,
        onSuccess: (size, deletedId) => {
            showSnackbar("File deleted successfully", "success");
            setUser({ ...user!, bytesUsed: user!.bytesUsed - size});

            queryClient.setQueryData(["content", folderId || query], (content: FolderContentResponse) => content && ({
                ...content,
                files: content.files.filter(file => file.id !== deletedId)
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });  

    const { mutate: createDirectoryMutation } = useMutation({
        mutationFn: createDirectory,
        onSuccess: (dir, variables) => {
            showSnackbar("Directory created successfully", "success");
            queryClient.setQueryData(["dirs"], (dirs: Directory[]) => dirs && [...dirs, dir]);

            const current = folderId === variables.parentId;
            const home = dir.isRoot && !folderId && !query;
            if (!current && !home) return;

            queryClient.setQueryData(["content", folderId || "home"], (content: FolderContentResponse) => content && ({
                ...content,
                directories: [...content.directories, dir]
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: renameDirectoryMutation } = useMutation({
        mutationFn: renameDirectory,
        onSuccess: (modified, variables) => {
            showSnackbar("Directory renamed successfully", "success");

            queryClient.setQueryData(["dirs"], (dirs: Directory[]) => dirs && dirs.map(dir => 
                    (dir.id === variables.id) ? { ...dir, name: variables.name, modified } : dir
            ));
            
            queryClient.setQueryData(["content", folderId || query || "home"], (content: FolderContentResponse) => content && ({
                ...content,
                directories: content.directories.map(dir => 
                    (dir.id === variables.id) ? { ...dir, name: variables.name, modified } : dir
                )
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });
    
    const { mutate: moveDirectoryMutation } = useMutation({
        mutationFn: moveDirectory,
        onSuccess: (res, variables) => {
            showSnackbar("Directory moved successfully", "success");

            queryClient.setQueryData(["dirs"], (dirs: Directory[]) => dirs && dirs.map(
                dir => {
                    if (!dir.path.startsWith(res.oldPath)) return dir;
 
                    const path = dir.path.replace(res.oldPath, res.newPath);
                    const isRoot = path.split("/").length === 2;
                    
                    return {
                        ...dir,
                        path,
                        isRoot,
                        modified: res.modified
                    };
                }
            ));
            if (query) return;
            
            queryClient.setQueryData(["content", folderId || "home"], (content: FolderContentResponse) => content && ({
                ...content,
                directories: content.directories.filter(file => file.id !== variables.itemId)
            }));
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    const { mutate: deleteDirectoryMutation } = useMutation({
        mutationFn: deleteDirectory,
        onSuccess: (res) => {
            showSnackbar("Directory deleted successfully", "success");
            setUser({ ...user!, bytesUsed: user!.bytesUsed - res.size });

            queryClient.setQueryData(["dirs"], (dirs: Directory[]) => dirs &&
                dirs.filter(dir => !dir.path.startsWith(res.path))
            );

            queryClient.setQueryData(["content", folderId || query || "home"], (content: FolderContentResponse) => content && ({
                ...content,
                directories: content.directories.filter(dir => !dir.path.startsWith(res.path))
            }));
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
                <NewItemDialog dirs={[...dirs.data || []]} status={itemDialogStatus} setStatus={setItemDialogStatus} uploadFile={uploadFileMutation} createDirectory={createDirectoryMutation} />
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
            <ContextMenu dirs={dirs.data || []} setDetails={setDetailsOpen} setRename={setRenameOpen} setDelete={setDeleteOpen} moveFile={moveFileMutation} moveDirectory={moveDirectoryMutation} />
            <DetailsDialog open={detailsOpen} setOpen={setDetailsOpen} />
            <RenameDialog open={renameOpen} setOpen={setRenameOpen} renameFile={renameFileMutation} renameDirectory={renameDirectoryMutation} />
            <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} deleteFile={deleteFileMutation} deleteDirectory={deleteDirectoryMutation} />
        </>}
        </ContextMenuContext.Provider>
    );
}