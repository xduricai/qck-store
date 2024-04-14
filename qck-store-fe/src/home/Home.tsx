import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
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

type ChipProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => any;
}

function Chip ({ children, className = "", onClick = () => {} }: ChipProps) {
    return (
        <span className={`w-full hover:bg-gray-100 items-center p-2 ${className}`} onClick={onClick}>
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

    const directories = folderId
        ? content?.directories || [] 
        : dirs || [];
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
        <div className="flex h-[calc(100%-4rem)]">
            {areAnyLoading() ? <Loading /> :         
            <div className="flex w-full">
                <section className="h-full flex">
                    <Sidebar directories={dirs || []} selectedId={parseId(folderId)} />
                </section>

                <section className="w-full m-4">
                    <span></span>
                    {directories.length > 0 && 
                        <div className="dynamic-grid-sm gap-4 mb-8">
                            {directories.map(dir => <DirectoryChip menuStatus={menuStatus} setMenuStatus={setMenuStatus} key={dir.id} data={dir} />)}
                        </div>
                    }
                    <div className="dynamic-grid-lg gap-4">
                        {files.map(file => <FileChip key={file.id} menuStatus={menuStatus} setMenuStatus={setMenuStatus} data={file} />)}
                    </div>
                    
                <section className="flex flex-row">
                    <div className="flex flex-col w-48 rounded border-gray-400 border-[1px]">
                        <Chip>Details</Chip>
                        <Chip className="rename-toggle" >Rename</Chip>
                        <Chip>Move To</Chip>
                        <Chip>Delete</Chip>
                        <Chip>Details</Chip>
                        <Chip>Details</Chip>
                    </div>
                    <div className="rename-section bg-red-400 w-36 hover:bg-blue-400 hidden hover:flex">
                        test
                    </div>
                </section>
                </section>
            </div>
            }
        </div>
    )
}