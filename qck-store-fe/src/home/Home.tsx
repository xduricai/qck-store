import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
import { GetFolderContent, GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";
import { FileChip } from "./FileChip";
import './home.css';

export function Home() {
    const { folderId } = useParams();
    
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
    
    return (
        <div className="flex h-[calc(100%-4rem)]">
            {areAnyLoading() ? <Loading /> :         
            <div className="flex w-full">
                <section className="h-full flex">
                    {dirs?.length && <Sidebar directories={dirs} selectedId={parseId(folderId)} />}
                </section>

                <section className="w-full m-4">
                    <div className="dynamic-grid gap-4">
                        {directories.map(dir => <DirectoryChip key={dir.id} data={dir} />)}
                    </div>
                    <div className="dynamic-grid gap-4">
                        {files.map(file => <FileChip key={file.id} data={file} />)}
                    </div>
                </section>
            </div>
            }
        </div>
    )
}