import { useQuery } from "@tanstack/react-query";
import { Sidenav } from "../navigation/Sidenav";
import { GetFolderContent, GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useLocation, useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import { useEffect, useState } from "react";
import { ContextMenuStatus } from "./ContextMenu";
import './home.css';

export type ItemType = "folder" | "file";

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

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }

    useEffect(() => {
        setMenuStatus(null);
    }, [location]);
    
    if (dirsLoading || contentLoading) {
        return <Loading />;
    }

    return (
        <div className="flex h-[calc(100%-4rem)]" onClick={() => setMenuStatus(null)}>        
            <div className="flex w-full">
                <section className="h-full flex">
                    <Sidenav directories={rootDirs} selectedId={parseId(folderId)} />
                </section>

                <section className="w-full m-4">
                    <span></span>
                    {contentDirs.length > 0 && 
                        <div className="dynamic-grid-sm gap-4 mb-8">
                            {contentDirs.map(dir => <DirectoryChip key={dir.id} dirs={dirs} menuStatus={menuStatus} setMenuStatus={setMenuStatus} data={dir} />)}
                        </div>
                    }
                    <div className="dynamic-grid-lg gap-4">
                        {files.map(file => <FileChip key={file.id} dirs={dirs} menuStatus={menuStatus} setMenuStatus={setMenuStatus} data={file} />)}
                    </div>
                </section>
            </div>
        </div>
    )
}