import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
import { GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function Home() {
    const { folderId } = useParams();
    //TODO rewrite this later
    const [selected, setSelected] = useState<number | null>(parseId(folderId));
    const { data, isLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });

    const onDirSelected = (id: number) => {
        setSelected(id);
    };

    function parseId(id: string | undefined) {
        if (!id) return null;
        const res = parseInt(id);
        if (isNaN(res)) return null;
        return res;
    }
    
    return (
        isLoading ? <Loading /> :         
        <div className="h-full flex">
            {data?.length && <Sidebar directories={data} selectedId={selected} onSelected={onDirSelected} />}
        </div>
    )
}