import { File } from "../api/responses/File";

export function FileChip({ data }: { data: File }) {
    return (
        // <div className="flex w-full border-zinc-400 hover:border-zinc-800 hover:bg-zinc-100 border-[1px] items-center rounded-xl p-2 cursor-pointer">
            <span className="truncate">{data.name}</span>
        // </div>
    );
}