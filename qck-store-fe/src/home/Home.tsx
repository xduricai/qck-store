import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
import { GetFolderContent, GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";

export function Home() {
    const { folderId } = useParams();
    
    const { data: dirs, isLoading: dirsLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });
    const { data: dirContent, isLoading: contentLoading } = useQuery({
        queryKey: ["folder", folderId ],
        queryFn: () => GetFolderContent(folderId)
    });

    const content = folderId
        ? dirContent?.directories || [] 
        : dirs || [];

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
            <div className="flex">
                <section className="h-full flex">
                    {dirs?.length && <Sidebar directories={dirs} selectedId={parseId(folderId)} />}
                </section>

                <section className="w-full m-4">
                    <div className="flex flex-row flex-wrap gap-4">
                        {content.map(dir => <DirectoryChip data={dir} />)}
                    </div>
                    <div>
                        {/*TODO display files*/}
                    </div>
                </section>
            </div>
            }
        </div>
    )
}