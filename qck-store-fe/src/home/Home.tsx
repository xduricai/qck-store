import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
import { GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useParams } from "react-router-dom";
import { DirectoryChip } from "./DirectoryChip";

export function Home() {
    const { folderId } = useParams();
    const { data: dirs, isLoading: dirsLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });

    //TODO change
    const content = folderId ? [] : dirs || [];

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }
    
    return (
        <div className="flex h-[calc(100%-4rem)]">
            {dirsLoading ? <Loading /> :         
            <div className="h-full flex float-left">
                {dirs?.length && <Sidebar directories={dirs} selectedId={parseId(folderId)} />}
            </div>}
            <section className="w-full m-4">
                <div className="flex flex-row flex-wrap gap-4">
                    {content.map(dir => <DirectoryChip data={dir} />)}
                </div>
                <div>
                    {/*TODO display files*/}
                </div>
            </section>
        </div>
    )
}