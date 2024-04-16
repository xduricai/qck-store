import { useQuery } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { GetFolderContent, GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useLocation, useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import './home.css';
import { ReactNode, useEffect, useState } from "react";

export type ContextMenuStatus = {
    type: "folder" | "file";
    id: number;
}

type MenuItemProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => any;
}

function MenuItem ({ children, className = "", onClick = () => {} }: MenuItemProps) {
    return (
        <span className={`w-full hover:bg-gray-100 items-center p-2 cursor-pointer ${className}`} onClick={onClick}>
            {children}
        </span>
    );
}

export function Home() {
    const location = useLocation();
    const { folderId } = useParams();
    const [ menuStatus, setMenuStatus ] = useState<ContextMenuStatus | null>(null);
    
    const { data: dirs, isLoading: dirsLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });
    const { data: content, isLoading: contentLoading } = useQuery({
        queryKey: ["folder", folderId ],
        queryFn: () => GetFolderContent(folderId)
    });

    const rootDirs = dirs?.filter(dir => dir.isRoot) || [];
    const contentDirs = folderId 
        ? content?.directories || []
        : rootDirs;  
    const files = content?.files || [];  

    const areAnyLoading = () => dirsLoading || contentLoading;
    
    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }

    useEffect(() => {
        setMenuStatus(null);
    }, [location]);
    
    return (
        <div className="flex h-[calc(100%-4rem)]" onClick={() => setMenuStatus(null)}>
            {areAnyLoading() ? <Loading /> :         
            <div className="flex w-full">
                <section className="h-full flex">
                    <Sidenav directories={rootDirs} selectedId={parseId(folderId)} />
                </section>

                <section className="w-full m-4">
                    <span></span>
                    {contentDirs.length > 0 && 
                        <div className="dynamic-grid-sm gap-4 mb-8">
                            {contentDirs.map(dir => <DirectoryChip menuStatus={menuStatus} setMenuStatus={setMenuStatus} key={dir.id} data={dir} />)}
                        </div>
                    }
                    <div className="dynamic-grid-lg gap-4">
                        {files.map(file => <FileChip key={file.id} menuStatus={menuStatus} setMenuStatus={setMenuStatus} data={file} />)}
                    </div>
                    
                <section className="flex flex-row">
                    <div className="flex flex-col w-48 h-fit rounded outline outline-gray-400 outline-[1px]">
                        <MenuItem>Details</MenuItem>
                        <MenuItem className="rename-toggle cursor-default" >Rename</MenuItem>
                        <MenuItem className="cursor-default">Move To</MenuItem>
                        <MenuItem>Delete</MenuItem>
                    </div>
                    <div className="rename-section w-48 max-h-64 rounded-r border-gray-400 border flex-col overflow-y-scroll scrollbar hidden hover:flex">
                        {/* TODO filter current folder */}
                        { dirs!.map(dir => <MenuItem key={dir.id}>{dir.name}</MenuItem>) }
                    </div>
                </section>
                </section>
            </div>
            }
        </div>
    )
}