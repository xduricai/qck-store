import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sidebar/Sidebar";
import { GetRootDirectories } from "../api/DirectoryClient";
import { Loading } from "./Loading";
import { useState } from "react";

export function Home() {
    const [selected, setSelected] = useState<number | null>(null);
    const { data, isLoading } = useQuery({
        queryKey: ["dirs"],
        queryFn: GetRootDirectories
    });

    const onDirSelected = (id: number) => {
        setSelected(id);
    };
    
    return (
        isLoading ? <Loading /> :         
        <div className="h-full flex">
            {data?.length && <Sidebar directories={data} selectedId={selected} onSelected={onDirSelected} />}
        </div>
    )
}